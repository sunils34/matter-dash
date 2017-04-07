
import {
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
  GraphQLList as List,
} from 'graphql';
import sequelize from '../../../database/mysql/sequelize';
import ReportType from '../../types/ReportType';

const ReportsPageInitType = new List(new ObjectType({
  name: 'ReportsPageInitType',
  fields: {
    label: { type: StringType },
    value: { type: StringType },
  },
}));

const getDistinctValues = async (orgId, field) =>
  sequelize.query(
    `SELECT DISTINCT ${field} as value, ${field} as label
      FROM employees
      WHERE orgId=$orgId;`, { bind: { orgId },
        type: sequelize.QueryTypes.SELECT,
      });


const companyPageInit = {
  type: new ObjectType({
    name: 'ReportsPageInitResults',
    fields: {
      report: { type: ReportType },
      departments: { type: ReportsPageInitType },
      focuses: { type: ReportsPageInitType },
      measures: { type: ReportsPageInitType },
      timeframes: { type: ReportsPageInitType },
    },
  }),
  args: {
    id: { type: StringType },
  },
  async resolve(parent, args) {
    if (!parent.request.user) return null;
    const user = parent.request.user;
    const organizations = await user.getOrganizations({ raw: true });
    if (!organizations.length) return null;
    const organization = organizations[0];
    const results = {
      departments: await getDistinctValues(organization.id, 'department'),
      measures: [
        { label: 'Gender', value: 'Gender' },
        { label: 'Ethnicity', value: 'Ethnicity' },
        { label: 'Age', value: 'Age' },
        { label: 'Location', value: 'Location' },
     /*   { label: 'Pay Grade', value: 'Pay Grade' }, */
      ],
      timeframes: [
        { label: 'Quarterly', value: 'Quarterly' },
        { label: 'Yearly', value: 'Yearly' },
        { label: 'Monthly', value: 'Monthly' },
      ],
      focuses: [
        { label: 'Overall', value: 'Overall' },
        { label: 'Hiring', value: 'Hiring' },
        { label: 'Churn', value: 'Churn' },
      ],
    };

    // include all as a department label
    results.departments.unshift({ label: 'All', value: 'All' });

    // include report details if we're asking for it
    if (args.id) {
      if (args.id === 'new') {
        results.report = {
          id: 'new',
          name: 'New Report',
          details: {},
          objects: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: user,
        };
      } else {
        user.reports = await user.getReports({
          where: {
            id: args.id,
          },
        });

        if (user.reports.length) {
          results.report = user.reports[0];
          results.report.objects = await results.report.getReportObjects({
            order: 'orderNumber ASC',
          });
        } else {
          throw new Error('Cannot find report');
        }
      }
    }
    return results;
  },
};

export default companyPageInit;

