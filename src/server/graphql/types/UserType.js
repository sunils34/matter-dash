import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull
} from 'graphql';

import GraphQLDate from 'graphql-date';

export default new ObjectType({
  name: 'User',
  fields: {
    id: { type: ID },
    email: {
      type: StringType,
      description: 'Email of the user'
    },
    name: {
      type: StringType,
      description: 'Name of the user'
    },
    company_name: {
      type: StringType,
      description: 'Name of the company this user is associated with'
    },
    company_total_employees: {
      type: IntType,
      description: 'Name of the company this user is associated with'
    },
    created_at: {
      type: GraphQLDate,
      description: 'Date the user signed up'
    }
  }
});
