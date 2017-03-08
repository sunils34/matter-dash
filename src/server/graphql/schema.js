import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import organization from './queries/organization';
import user from './queries/user';
import piedatapoints from './queries/piedatapoints';
import bardatapoints from './queries/bardatapoints';
import reportsPageInit from './queries/ReportsPage/init';
import createReport from './mutations/reports/create';
import updateReport from './mutations/reports/update';
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
      createReport,
      updateReport,
    }),
  }),
});
