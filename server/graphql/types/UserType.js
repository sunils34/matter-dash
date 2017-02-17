import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
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
    created_at: {
      type: GraphQLDate,
      description: 'Date the user signed up'
    }
  }
});
