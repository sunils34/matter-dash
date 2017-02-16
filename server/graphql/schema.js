import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import tests from './queries/tests/all';


export default  new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
     tests
    }
  })
});
