import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import _ from 'lodash';
import sequelize from '../../../database/mysql/sequelize';


const getFilters = (type) => {
  const stmt = `
  SELECT ${type} as label, ${type} as value
  FROM companyComparisons
  GROUP BY ${type}`;

  return sequelize.query(stmt, {
    type: sequelize.QueryTypes.SELECT,
  });
};

const FilterResult = new ObjectType({
  name: 'FilterResult',
  fields: {
    label: { type: StringType },
    value: { type: StringType },
  },
});

const comparisonFilters = {
  type: new ObjectType({
    name: 'ComparisonFilterResults',
    fields: {
      results: { type: new List(FilterResult) },
    },
  }),
  args: {
    type: { type: StringType },
  },
  async resolve(parent, args) {
    if (!parent.request.user) return null;

    // right now there are only two types
    const type = args.type === 'year' ? 'year' : 'department';
    const results = await getFilters(type);
    if (type === 'year') _.reverse(results);
    return { results };
  },
};

export default comparisonFilters;
