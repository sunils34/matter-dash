import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import tests from './queries/tests/all';
import User from './types/UserType';


export default  new Schema({
  query: new ObjectType({
    name: 'CurrentUser',
    fields: () => ({
      me: {
        type: User,
        resolve(parent, args, {db}) {
          if(parent.request.user) {
            const user = parent.request.user;
            return {
              id: user._id,
              email: user.email,
              name: user.name,
              created_at: user.created_at,
              company_name:'XO Group',
              company_total_employees: 333
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
