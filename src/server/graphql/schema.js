import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import organization from './queries/organization';
import user from './queries/user';
import piedatapoints from './queries/piedatapoints';
import bardatapoints from './queries/bardatapoints';
import reportsPageInit from './queries/ReportsPage/init';
import createOrUpdateReport from './mutations/reports/createOrUpdate';
import deleteReport from './mutations/reports/delete';
import reports from './queries/reports/all';


export default new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      user,
      organization,
      reports,
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
