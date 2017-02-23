import {
  GraphQLID as ID,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull
} from 'graphql';
import GraphQLDate from 'graphql-date';


export default new ObjectType({
  name: 'Organization',
  fields: {
    id: { type: ID },
    name: {
      type: StringType,
      description: 'Name of the organization'
    },
    employee_count: {
      type: IntType,
      description: 'Count of employees'
    },
    created_at: {
      type: GraphQLDate,
      description: 'Date the organization was created'
    },
    update_at: {
      type: GraphQLDate,
      description: 'Date the organization was updated'
    }
  }
});
