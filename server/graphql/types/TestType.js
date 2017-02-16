import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull
} from 'graphql';

export default new ObjectType({
  name: 'Test',
  fields: {
    id: { type: new NonNull(ID) },
    title: { type: StringType }
  }
});
