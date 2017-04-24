import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { schema as userSchema, resolvers as userResolvers } from './UserSchema';

const rootSchema = [`
  type Query {
    me: User
  }

  schema {
    query: Query
  }
`];

const rootResolvers = {
  Query: {
  },
};

const schema = [...rootSchema, ...userSchema];
const resolvers = merge(rootResolvers, userResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

export default executableSchema;
