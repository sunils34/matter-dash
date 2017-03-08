import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import ReportType from '../../types/ReportType';
import ReportObjectType from '../../types/ReportObjectType';
import { Report, ReportObject, User } from '../../../database/mysql/models';

export default {
  type: ReportType,
  args: {
    name: { type: new NonNull(StringType) },
    objects: { type: GraphQLJSON },
  },
  async resolve(parent, args) {
    if (!parent.request.user) return null;
    const user = parent.request.user;
    const report = await Report.create({
      name: args.name,
    });
    await report.setOwner(user);
    return {
      id: report.id,
      name: report.name,
      createdAt: report.createdAt,
      owner: user,
    };
  },
};
