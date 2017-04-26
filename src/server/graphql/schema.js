import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { schema as userSchema, resolvers as userResolvers } from './UserSchema';
import { schema as organizationSchema, resolvers as organizationResolvers } from './OrganizationSchema';

const rootSchema = [`
  type Query {
    me: User
    organization: Organization
  }

  schema {
    query: Query
  }
`];

const rootResolvers = {
  Query: {
  },
};

const schema = [...rootSchema, ...userSchema, ...organizationSchema];
const resolvers = merge(rootResolvers, userResolvers, organizationResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

export default executableSchema;
