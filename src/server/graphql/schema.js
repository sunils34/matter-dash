import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import organization from './queries/organization';
import user from './queries/user';


export default  new Schema({
  query: new ObjectType({
    name: 'Query',
    fields:  {
      user,
      organization
    }
  })
});
