import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import _ from 'lodash';
import GraphQLJSON from 'graphql-type-json';
import sequelize from '../../../database/mysql/sequelize';

const getFields = async (type = 'gender') => {
  const COLORS = {
    gender: ['#CBCBCB', '#72D5C6', '#6E6EE2', '#F1BA00', '#E96DA4', '#E28D6E', '#3DBAEF', '#3481A5'],
    ethnicity: ['#ABABAB', '#6E6EE2', '#F1BA00', '#E96DA4', '#E28D6E', '#3DBAEF', '#72D5C6', '#3481A5'],
  };

  const stmt = `
    SELECT
      CASE TRIM(${type})
        WHEN 'Two or more races' THEN '2+ Races'
        WHEN 'American Indian or Alaska Native or Native Hawaiian or other Pacific Islander' THEN 'Other'
        ELSE TRIM(${type})
      END as name
    FROM companyComparisons
    WHERE ${type} <> ''
    GROUP BY ${type}
    ORDER BY SUM(pct) DESC`;

  let fields = await sequelize.query(stmt, {
    type: sequelize.QueryTypes.SELECT,
  });

  fields = _.map(fields, (element, idx) => (
    _.extend(element, { color: COLORS[type][idx % COLORS[type].length] })
  ));
  return fields;
};

const getCompanyResults = async (measure = 'gender', department = 'All', year = 'latest') => {
  const yearStmt = year === 'latest' ? '' : ` AND year = ${year}`;

  // TODO this is very hacky. Plesae ask sunil if you're confused.
  // Eventually abstract this out instead of hard code mappings
  const stmt = `
    SELECT CONCAT(c.companyName, '-', c.year) as companyKey,
      c.companyName as companyName,
      c.year,
      CASE TRIM(c.${measure})
        WHEN 'Two or more races' THEN '2+ Races'
        WHEN 'American Indian or Alaska Native or Native Hawaiian or other Pacific Islander' THEN 'Other'
        ELSE TRIM(c.${measure})
      END as ${measure},
      c.pct as total
      FROM companyComparisons c
      INNER JOIN
      (
        SELECT companyName, department, max(year) as year
        FROM companyComparisons
        WHERE
          department = "${department}"
          AND ${measure} <> ''
          ${yearStmt}
        GROUP BY companyName, department
      ) cc ON c.companyName=cc.companyName
        AND c.year=cc.year
        AND c.department=cc.department
      WHERE ${measure} <> ''
      ORDER BY year DESC, companyName ASC;`;
  return sequelize.query(stmt, {
    type: sequelize.QueryTypes.SELECT,
  });
};

const getMyCompanyResults = async (organization, measure = 'gender', department = 'All', year = 'latest') => {
  const departmentStmt = department === 'All' ? "<> ''" : ` = "${department}"`;
  const measureField = measure === 'gender' ? 'gender' : 'ethnicity';
  const yearStmt = year === 'latest' ? '' : ` AND YEAR(hireDate) <= ${year} `;

  // TODO this is very hacky. Plesae ask sunil if you're confused.
  // Eventually abstract this out instead of hard code mappings
  const stmt = `
      SELECT CONCAT(t.companyName, '-', '2016') as companyKey,
        t.companyName as companyName,
        '2016' as year,

        CASE TRIM(t.${measure})
          WHEN 'Two or more races' THEN '2+ Races'
          WHEN 'American Indian or Alaska Native or Native Hawaiian or other Pacific Islander' THEN 'Other'
          ELSE TRIM(t.${measure})
        END as ${measure},

        COUNT(t.${measure}) as count
        FROM (SELECT
          o.name as companyName,
          TRIM(e.${measureField}) as ${measure}
          FROM employees e LEFT JOIN organizations o ON e.orgId = o.id
          WHERE
            o.id = $orgId
            ${yearStmt}
            AND (
              e.department IN (
                SELECT employeeValue
                FROM EmployeeComparisonMappings
                WHERE orgId =$orgId
                  AND employeeField='department'
                  AND comparisonField='department'
                  AND comparisonValue ${departmentStmt}
              )
              OR e.payGradeCode IN (
                SELECT employeeValue
                FROM EmployeeComparisonMappings
                WHERE orgId =$orgId
                  AND employeeField='payGradeCode'
                  AND comparisonField='department'
                  AND comparisonValue ${departmentStmt}
              )
            )
        ) t
      GROUP BY t.companyName, t.${measure}
  `;

  let results = await sequelize.query(stmt, {
    type: sequelize.QueryTypes.SELECT,
    bind: { orgId: organization.id },
  });

  let total = 0;
  _.forEach(results, (item) => {
    total += item.count;
  });

  results = _.map(results, item => (
    { ...item, total: _.round((item.count * 100) / total, 2), isMine: true }
  ));

  return results;
};

const comparison = {
  type: new ObjectType({
    name: 'ComparisonCompaniesResults',
    fields: {
      results: { type: new List(GraphQLJSON) },
      fields: { type: new List(
        new ObjectType({
          name: 'ComparisonCompaniesField',
          fields: {
            name: { type: StringType },
            color: { type: StringType },
          },
        })),
      },
    },
  }),
  args: {
    department: { type: StringType },
    measure: { type: StringType },
    sort: { type: StringType },
    year: { type: StringType },
  },
  async resolve(parent, args) {
    const user = parent.request.user;
    if (!user) { throw new Error('Must be logged in to access this API'); }
    const organizations = await user.getOrganizations({ raw: true });
    if (!organizations.length) { throw new Error('User does not have an organization'); }
    const organization = organizations[0];

    const department = args.department;
    const year = args.year || 'latest';
    let measure = 'gender';
    if (_.lowerCase(args.measure) === 'ethnicity') {
      measure = 'ethnicity';
    }

    let r = await getCompanyResults(measure, department, year);

    // add my company results to the list
    r = _.concat(r, await getMyCompanyResults(organization, measure, department, year));

    const results = {};
    r.forEach((item) => {
      // initialize
      if (!results[item.companyKey]) {
        results[item.companyKey] = {
          companyKey: item.companyKey,
          companyName: item.companyName,
          [measure]: {},
        };
        if (item.isMine) { results[item.companyKey].isMine = true; }
      }
      results[item.companyKey][measure][item[measure]] = item.total;
    });

    const fields = await getFields(measure);

    return { results: _.values(results), fields };
  },
};

export default comparison;

