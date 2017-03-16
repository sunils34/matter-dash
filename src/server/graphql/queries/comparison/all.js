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
    ethnicity: ['#ABABAB', '#72D5C6', '#6E6EE2', '#F1BA00', '#E96DA4', '#E28D6E', '#3DBAEF', '#3481A5'],
  };

  let fields = await sequelize.query(`SELECT ${type} as name FROM companyEeoRows GROUP BY ${type} ORDER BY sum(total) DESC`, {
    type: sequelize.QueryTypes.SELECT,
  });

  fields = _.map(fields, (element, idx) => (
    _.extend(element, { color: COLORS[type][idx % COLORS[type].length] })
  ));
  return fields;
};

const getCompanyResults = (type = 'gender', department = '') => {
  let departmentStmt = '';
  if (department && _.lowerCase(department) !== 'all') {
    departmentStmt = `WHERE department='${department}'`;
  }

  const stmt = `
    SELECT CONCAT(companyName, '-', year) as companyKey, companyName, year, ${type}, sum(total) as total FROM companyEeoRows ${departmentStmt} GROUP BY companyName, year, ${type}
    ORDER BY year DESC, companyName ASC`;

  return sequelize.query(stmt, {
    type: sequelize.QueryTypes.SELECT,
  });
};

const convertToPercentageData = (data, fields, measure) => {
  const retData = _.map(data, (element) => {
    let total = 0;
    const elt = _.extend({}, element);
    fields.forEach((f) => {
      if (elt[f.name]) {
        total += elt[f.name];
      }
    });
    // move data to elt.gender or elt.enthnicity
    elt[measure] = {};
    elt[`${measure}Raw`] = {};
    fields.forEach((f) => {
      if (elt[f.name]) {
        elt[`${measure}Raw`][f.name] = elt[f.name];
        elt[measure][f.name] = _.round((elt[f.name] / total) * 100, 1);
        delete elt[f.name];
      }
    });
    return elt;
  });
  return retData;
};


const comparison = {
  type: new ObjectType({
    name: 'ComparisonResults',
    fields: {
      results: { type: new List(GraphQLJSON) },
      fields: { type: new List(
        new ObjectType({
          name: 'ComparisonField',
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
  },
  async resolve(parent, args) {
    if (!parent.request.user) return null;
    const department = args.department;
    let measure = 'gender';
    if (_.lowerCase(args.measure) === 'ethnicity') {
      measure = 'ethnicity';
    }

    const r = await getCompanyResults(measure, department);
    const results = {};
    r.forEach((item) => {
      // initialize
      if (!results[item.companyKey]) {
        results[item.companyKey] = {
          companyKey: item.companyKey,
          companyName: item.companyName,
          year: item.year,
        };
      }
      results[item.companyKey][item[measure]] = item.total;
    });

    const fields = await getFields(measure);
    const finalRes = convertToPercentageData(_.values(results), fields, measure);

    return { results: finalRes, fields };
  },
};

export default comparison;

