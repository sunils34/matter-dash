import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import tests from './queries/tests/all';
import User from './types/UserType';


export default  new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: () => ({
      me: {
        type: User,
        resolve(parent, args, {db}) {
          if(parent.request.user) {
            const user = parent.request.user;
            return {
              id: user._id,
              email: user.email,
              name: user.google.name,
              created_at: user.created_at
            };
          }
          else {
            return null;
          }
        }
      }
    })
  })
});
