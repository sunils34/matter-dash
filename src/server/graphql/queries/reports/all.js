import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';
import _ from 'lodash';

import ReportType from '../../types/ReportType';

const reports = {
  type: new ObjectType({
    name: 'Reports',
    fields: {
      results: { type: new List(ReportType) },
    },
  }),
  args: {
    sort: { type: StringType },
  },
  async resolve(parent, args) {
    if (!parent.request.user) return null;
    const user = parent.request.user;
    const sort = (args.sort && _.lowerCase(args.sort) === 'asc') ? 'ASC' : 'DESC';

    // TODO pagination
    const results = await user.getReports({
      order: `updatedAt ${sort}`,
    });

    return { results };
  },
};

export default reports;

