import {
  GraphQLID as ID,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';

export default new ObjectType({
  name: 'ReportObject',
  fields: {
    id: { type: ID },
    type: {
      type: StringType,
      description: 'Type of the object',
    },
    details: {
      type: GraphQLJSON,
      description: 'Extra details of the object',
    },
    created_at: {
      type: GraphQLDate,
      description: 'Date the object was created',
    },
    update_at: {
      type: GraphQLDate,
      description: 'Date the object was updated',
    },
  },
});
