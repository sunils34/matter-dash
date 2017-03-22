import {
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLObjectType as ObjectType,
} from 'graphql';

export default {
  type: new ObjectType({
    name: 'DeleteReportResponse',
    fields: {
      success: { type: BooleanType },
      error: { type: StringType },
    },
  }),
  args: {
    reportId: { type: StringType },
  },
  async resolve(parent, args) {
    if (!parent.request.user) return null;
    const user = parent.request.user;
    const reports = await user.getReports({
      where: {
        id: args.reportId,
      },
    });
    if (reports.length !== 1) {
      return {
        success: false,
        error: 'Could not find report',
      };
    }

    await reports[0].destroy();

    return {
      success: true,
    };
  },
};
