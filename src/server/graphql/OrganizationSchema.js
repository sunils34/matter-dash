export const schema = [`

type Organization {
  # id of organization
  id: String!

  # name of organization
  name: String!

  # subdomain of organization
  name: String!

  # full name of user
  logoUrl: String

  # all employees associated with this organization
  users: [User]
}
`];

export const resolvers = {
  Query: {
    organization: async (root, args, context) => {
      const org = await context.user.getOrganization();
      return {
        ...org.toJSON(),
        users: await org.getEmployees(),
      };
    },
  },
};
