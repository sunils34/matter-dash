import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import _ from 'lodash';


import sequelize from '../../database/mysql/sequelize';
import getFields from './fields';

const getLast5Years = async (organization, limit = 6) => {
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

const getResults = async (organization, department, focus, measure, timeframe) => {
  let results = [];
  let stmt = `SELECT COUNT (*) as v, ${measure} as k FROM employees where orgId=$orgId `;
  let timeframeStmt = '';

  if (department !== 'All') {
    stmt += ' AND department = $department ';
  }
  stmt += ` AND ${measure} IS NOT NULL AND ${measure} <> '' `;

  if (timeframe === 'monthly') {
    results = await getLast6Months(organization);
    timeframeStmt = ' DATE_FORMAT(employees.hireDate ,\'%Y-%m\') <= $time';
  } else {
    results = await getLast5Years(organization);
    timeframeStmt = ' YEAR(hireDate) <= $time';
  }

  stmt += ` AND ${timeframeStmt} GROUP BY ${measure} ORDER BY v ASC`;

  for (const idx in results)  {
    const r = results[idx];
    const countResults = await sequelize.query(stmt, {
      bind: { orgId: organization.id, time: r.time, department, measure },
      type: sequelize.QueryTypes.SELECT,
    });
    countResults.forEach((c) => {
      r[c.k] = c.v;
    });
  }

  return results;
};


const barDataPoints = {
  type: new ObjectType({
    name: 'BarDataResults',
    fields: {
      results: { type: new List(GraphQLJSON) },
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
    const focus = _.lowerCase(query.focus) || 'overall';
    let timeframe = _.lowerCase(query.timeframe);

    if (timeframe === 'monthly') {
      timeframe = 'monthly';
    } else {
      timeframe = 'yearly';
    }

    if (!_.includes(['overall', 'hiring', 'churn'], focus)) {
      throw new Error('Focus parameter must be either "overall", "hiring", or "churn"');
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

    const results = await getResults(organization, query.department, focus, measure, timeframe);
    const fields = await getFields(measure, organization.id, sequelize);
    return { results, fields };
  },
};

export default barDataPoints;

