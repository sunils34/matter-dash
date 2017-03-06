
import {
  GraphQLID as ID,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLList as List,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';
import ReportObjectType from './ReportObjectType';
import UserType from './UserType';


export default new ObjectType({
  name: 'Report',
  fields: {
    id: { type: ID },
    name: {
      type: StringType,
      description: 'Name of the report',
    },
    details: {
      type: GraphQLJSON,
      description: 'Extra details of the object',
    },
    objects: {
      type: new List(ReportObjectType),
      description: 'List of objects to render',
    },
    createdAt: {
      type: GraphQLDate,
      description: 'Date the report was created',
    },
    updateAt: {
      type: GraphQLDate,
      description: 'Date the report was updated',
    },
    owner: {
      type: UserType,
      description: 'Owner of the report',
    },
  },
});
