import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';

const PieDataPointType = new ObjectType({
  name: 'PieDataPointType',
  fields: {
    name: {type: StringType},
    value: {type: IntType}
  }
})

export default PieDataPointType;
