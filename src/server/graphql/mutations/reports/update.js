import {
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import ReportType from '../../types/ReportType';
import { Report, ReportObject } from '../../../database/mysql/models';

const updateReportObject = async (report, newObject, idx) => {
  const reportObject = await ReportObject.findOne({
    where: {
      id: newObject.id,
      reportId: report.id,
    },
  });

  if (!reportObject) {
    return { error: 'Cannot find the report object to modify' };
  }

  reportObject.orderNumber = idx;
  if (newObject.type) reportObject.type = newObject.type;
  if (newObject.details) reportObject.details = newObject.details;
  return reportObject.save();
};

const createReportObject = async (report, newObject, idx) => {
  let reportObject = {};
  reportObject.orderNumber = idx;
  if (newObject.type) {
    reportObject.type = newObject.type;
  } else {
    return { error: 'Report Objects must have types' };
  }

  if (newObject.details) {
    reportObject.details = newObject.details;
  } else {
    return { error: 'Report Objects must have details' };
  }

  reportObject = await ReportObject.create(reportObject);
  return reportObject.setReport(report);
};


export default {
  type: ReportType,
  args: {
    id: { type: new NonNull(StringType) },
    name: { type: StringType },
    objects: { type: new List(GraphQLJSON) },
  },
  async resolve(parent, args) {
    if (!parent.request.user) return null;
    const user = parent.request.user;
    const reportObjects = [];
    let report = await Report.findOne({
      where: {
        id: args.id,
        userId: user.id,
      },
    });
    if (!report) {
      throw new Error('This report does not exist');
    }

    if (args.name) {
      report.name = args.name;
      report = await report.save();
    }

    if (args.objects && args.objects.length) {
      for(let idx in args.objects) {
        const object = args.objects[idx];
        let reportObject = null;
        if (object.id) {
          reportObject = await updateReportObject(report, object, idx);
        } else {
          reportObject = await createReportObject(report, object, idx);
        }
        if (reportObject.error) {
          throw new Error(reportObject.error);
        }
        reportObjects.push(reportObject);
      }
    }

    return {
      id: report.id,
      name: report.name,
      createdAt: report.createdAt,
      owner: user,
      objects: reportObjects,
    };
  },
};
