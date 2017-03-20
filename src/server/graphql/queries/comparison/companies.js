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

  let fields = await sequelize.query(`SELECT TRIM(${type}) as name FROM companyComparisons WHERE ${type} <> '' GROUP BY ${type} ORDER BY SUM(pct) DESC`, {
    type: sequelize.QueryTypes.SELECT,
  });

  fields = _.map(fields, (element, idx) => (
    _.extend(element, { color: COLORS[type][idx % COLORS[type].length] })
  ));
  return fields;
};

const getCompanyResults = (measure = 'gender', department = 'All', year = 'latest') => {
  const yearStmt = year === 'latest' ? '' : ` AND year = ${year}`;

  const stmt = `
    SELECT CONCAT(c.companyName, '-', c.year) as companyKey,
      c.companyName as companyName,
      c.year, TRIM(c.${measure}) as ${measure},
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


const comparison = {
  type: new ObjectType({
    name: 'ComparisonCompanyResults',
    fields: {
      results: { type: new List(GraphQLJSON) },
      fields: { type: new List(
        new ObjectType({
          name: 'ComparisonCompanyField',
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
    if (!parent.request.user) return null;
    const department = args.department;
    const year = args.year || 'latest';
    let measure = 'gender';
    if (_.lowerCase(args.measure) === 'ethnicity') {
      measure = 'ethnicity';
    }

    const r = await getCompanyResults(measure, department, year);
    const results = {};
    r.forEach((item) => {
      // initialize
      if (!results[item.companyKey]) {
        results[item.companyKey] = {
          companyKey: item.companyKey,
          companyName: item.companyName,
          [measure]: {},
        };
      }
      results[item.companyKey][measure][item[measure]] = item.total;
    });

    const fields = await getFields(measure);

    return { results: _.values(results), fields };
  },
};

export default comparison;

