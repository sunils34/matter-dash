import { GraphQLID as ID,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
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
    orderNumber: {
      type: IntType,
      description: 'Order number',
    },
    details: {
      type: GraphQLJSON,
      description: 'Extra details of the object',
    },
    createdAt: {
      type: GraphQLDate,
      description: 'Date the object was created',
    },
    updateAt: {
      type: GraphQLDate,
      description: 'Date the object was updated',
    },
  },
});
