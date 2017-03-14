import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import _ from 'lodash';
import GraphQLJSON from 'graphql-type-json';
import sequelize from '../../../database/mysql/sequelize';

const ComparisonType = new ObjectType({
  name: 'ComparisonType',
  fields: {
    companyName: { type: StringType },
    year: { type: StringType },
    genderResults: { type: new List(GraphQLJSON) },
    ethnicityResults: { type: new List(GraphQLJSON) },
  },
});

const getCompanyResults = (type = 'gender', department = '') => {
  let departmentStmt = '';
  if (department && _.lowerCase(department) !== 'all') {
    departmentStmt = `WHERE department='${department}'`;
  }

  const stmt = `
    SELECT companyName, year, ${type}, sum(total) as total
    FROM companyEeoRows
    ${departmentStmt}
    GROUP BY companyName, year, ${type}
    ORDER BY year DESC, companyName ASC`;

  return sequelize.query(stmt, {
    type: sequelize.QueryTypes.SELECT,
  });
};


const comparison = {
  type: new ObjectType({
    name: 'ComparisonResults',
    fields: {
      results: { type: new List(ComparisonType) },
    },
  }),
  args: {
    department: { type: StringType },
    sort: { type: StringType },
  },
  async resolve(parent, args) {
    if (!parent.request.user) return null;
    const department = args.department;

    const genderResults = await getCompanyResults('gender', department);
    const ethnicityResults = await getCompanyResults('ethnicity', department);
    const results = {};
    genderResults.forEach((item) => {
      const key = `${item.companyName}_${item.year}`;
      // initialize
      if (!results[key]) {
        results[key] = {
          companyName: item.companyName,
          year: item.year,
          genderResults: [],
          ethnicityResults: [],
        };
      }
      results[key].genderResults.push(item);
    });

    ethnicityResults.forEach((item) => {
      const key = `${item.companyName}_${item.year}`;
      results[key].ethnicityResults.push(item);
    });

    return { results: _.values(results) };
  },
};

export default comparison;

