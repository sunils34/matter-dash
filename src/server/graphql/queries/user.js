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
        createdAt: user.created_at,
      };
    }
    else {
      return null;
    }
  }
}

export default user;
