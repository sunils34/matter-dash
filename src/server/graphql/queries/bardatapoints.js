import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import _ from 'lodash';


import sequelize from '../../database/mysql/sequelize';
import getFields from './fields';

const getLast6Years = async (organization, limit = 6) => {
  const stmt = `
  SELECT name as name, name as time FROM
    (select DISTINCT YEAR(hireDate) as name
     FROM employees
     WHERE orgId=$orgId
     ORDER BY name
     DESC LIMIT ${limit})
  AS T ORDER BY time ASC;`;
  return sequelize.query(stmt, {
    bind: { orgId: organization.id },
    type: sequelize.QueryTypes.SELECT,
  });
};

const getLast6Quarters = async (organization, limit = 6) => {
  const stmt = `
  SELECT name as name, name as time FROM
    (select DISTINCT CONCAT(YEAR(hireDate), ' Q', QUARTER(hireDate)) as name
     FROM employees
     WHERE orgId=$orgId
     ORDER BY name
     DESC LIMIT ${limit})
  AS T ORDER BY time ASC;`;
  return sequelize.query(stmt, {
    bind: { orgId: organization.id },
    type: sequelize.QueryTypes.SELECT,
  });
};

const getLast6Months = async (organization, limit = 6) => {
  const stmt = `
    SELECT * FROM (
      SELECT DATE_FORMAT(employees.hireDate ,'%Y-%m') as time,
      DATE_FORMAT(employees.hireDate ,'%b %Y') as name
      FROM employees where orgId=$orgId
      GROUP BY
        DATE_FORMAT(employees.hireDate ,'%Y-%m'),
        DATE_FORMAT(employees.hireDate ,'%b %Y')
      ORDER BY time
      DESC
      LIMIT ${limit}
    ) AS T ORDER BY time ASC;`;

  return sequelize.query(stmt, {
    bind: { orgId: organization.id },
    type: sequelize.QueryTypes.SELECT,
  });
};

const getTimeframeFilter = (dateFilter, timeframe) => {
  switch (timeframe) {

    case 'quarterly':
      return ` CONCAT(YEAR(${dateFilter}), ' Q',  QUARTER(${dateFilter}))`;
    case 'monthly':
      return ` DATE_FORMAT(${dateFilter}, '%Y-%m')`;
    case 'yearly':
    default:
      return ` DATE_FORMAT(${dateFilter}, '%Y')`;
  }
};

const getFocusFilterTimeStmt = (focus, timeframe) => {
  if (focus === 'attrition') {
    return ` ${getTimeframeFilter('employees.terminationDate', timeframe)} = $time`;
  } else if (focus === 'hiring') {
    return ` ${getTimeframeFilter('employees.hireDate', timeframe)} = $time`;
  }

  return ` ${getTimeframeFilter('employees.hireDate', timeframe)} <= $time AND
  (employees.terminationDate IS NULL OR employees.terminationDate = '' OR
   ${getTimeframeFilter('employees.terminationDate', timeframe)} > $time)
   `;
};

const getResults = async (organization, department, focus, measure, timeframe) => {
  let stmt = `SELECT COUNT (*) as v, ${measure} as k FROM employees where orgId=$orgId `;

  // obtain the time periods we want to obtain
  let timeFrames = null;
  if (timeframe === 'monthly') {
    timeFrames = await getLast6Months(organization);
  } else if (timeframe === 'quarterly') {
    timeFrames = await getLast6Quarters(organization);
  } else {
    timeFrames = await getLast6Years(organization);
  }

  if (department !== 'All') {
    // use comparison mapping to query off pay grade or department
    stmt += ` AND (
      department = $department
      OR department IN (
        SELECT employeeValue
        FROM EmployeeComparisonMappings
        WHERE orgId ='app'
        AND employeeField='department'
        AND comparisonField='department'
        AND comparisonValue = $department
      )
      OR payGradeCode IN (
        SELECT employeeValue
        FROM EmployeeComparisonMappings
        WHERE orgId ='app'
        AND employeeField='payGradeCode'
        AND comparisonField='department'
        AND comparisonValue = $department
      )
    )
  `;
  }
  stmt += ` AND ${measure} IS NOT NULL AND ${measure} <> '' `;

  const focusStmt = getFocusFilterTimeStmt(focus, timeframe);

  stmt += ` AND ${focusStmt} GROUP BY ${measure} ORDER BY v ASC`;

  let total = 0;
  const possibleValues = {};
  let results = [];
  for (const idx in timeFrames)  {
    const r = timeFrames[idx];
    const countResults = await sequelize.query(stmt, {
      bind: { orgId: organization.id, time: r.time, department, measure },
      type: sequelize.QueryTypes.SELECT,
    });
    let timeframeTotal = 0;
    countResults.forEach((c) => {
      r[c.k] = c.v;
      total += c.v;
      timeframeTotal += c.v;
      possibleValues[c.k] = 0;
    });
    if (timeframeTotal) {
      results.push(r);
    }
  }

  results = _.map(results, item => (
    {
      ...possibleValues,
      ...item,
    }
  ));

  if (!total) return null;
  return results;
};


const barDataPoints = {
  type: new ObjectType({
    name: 'BarDataResults',
    fields: {
      results: { type: new List(GraphQLJSON) },
      overall: { type: new List(GraphQLJSON) },
      fields: { type: new List(
        new ObjectType({
          name: 'BarDataField',
          fields: {
            name: { type: StringType },
            color: { type: StringType },
          },
        })),
      },
    },
  }),
  args: {
    query: { type: GraphQLJSON },
  },
  async resolve(parent, args) {
    if (!parent.request.user) return null;
    const user = parent.request.user;
    const organizations = await user.getOrganizations({ raw: true });
    if (!organizations.length) return null;
    const organization = organizations[0];
    const query = args.query;
    let measure = _.lowerCase(query.measure);
    const focus = _.lowerCase(query.focus).replace('churn', 'attrition') || 'overall';
    const department = query.department || 'All';
    let timeframe = _.lowerCase(query.timeframe);
    let overall = null;

    if (timeframe === 'monthly') {
      timeframe = 'monthly';
    } else if (timeframe === 'quarterly') {
      timeframe = 'quarterly';
    } else {
      timeframe = 'yearly';
    }

    if (!_.includes(['overall', 'hiring', 'attrition'], focus)) {
      throw new Error('Focus parameter must be either "overall", "hiring", or "attrition"');
    }

    if (measure === 'ethnicity') {
      measure = 'ethnicity';
    } else if (measure === 'age') {
      measure = 'ageRange';
    } else if (measure === 'location') {
      measure = 'location';
    } else if (measure === 'pay grade') {
      measure = 'payGradeCode';
    } else {
      measure = 'gender';
    }

    const fields = await getFields(measure, organization.id, sequelize);
    const results = await getResults(organization, department, focus, measure, timeframe);
    // include overall data in results
    if (focus === 'attrition') {
      overall = await getResults(organization, department, 'overall', measure, timeframe);
    }
    return { results, fields, overall };
  },
};

export default barDataPoints;

