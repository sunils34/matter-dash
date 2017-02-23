import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import UserType from '../types/UserType';
import User from '../../database/mysql/models/User';

const user = {
  type: UserType,
  args: {},
  resolve(parent, args, {db}) {
    if(parent.request.user) {
      const user = parent.request.user;
      return {
        id: user.id,
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

export default user;
