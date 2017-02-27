import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';

import organization from './queries/organization';
import user from './queries/user';
import piedatapoints from './queries/piedatapoints';
import bardatapoints from './queries/bardatapoints';


export default  new Schema({
  query: new ObjectType({
    name: 'Query',
    fields:  {
      user,
      organization,
      piedatapoints,
      bardatapoints
    }
  })
});
