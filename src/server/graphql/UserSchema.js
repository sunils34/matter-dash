export const schema = [`

type User {
  # id of user
  id: String!

  # name of user
  name: String!

  # full name of user
  full_name: String!

  # email address of user
  email: String!

  # whether we're impersonating a user
  impersonating: Boolean
}
`];

export const resolvers = {
  Query: {
    me: (root, args, context) => (
      context.user
    ),
  },
};
