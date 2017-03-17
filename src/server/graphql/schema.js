import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import organization from './queries/organization';
import user from './queries/user';
import piedatapoints from './queries/piedatapoints';
import bardatapoints from './queries/bardatapoints';
import reports from './queries/reports/all';
import comparison from './queries/comparison/all';
import comparisonFilters from './queries/comparison/filters';
import reportsPageInit from './queries/reports/pageinit';
import createOrUpdateReport from './mutations/reports/createOrUpdate';
import deleteReport from './mutations/reports/delete';


export default new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      user,
      organization,
      reports,
      comparison,
      comparisonFilters,
      piedatapoints,
      bardatapoints,
      reportsPageInit,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutations',
    fields: () => ({
      createOrUpdateReport,
      deleteReport,
    }),
  }),
});
