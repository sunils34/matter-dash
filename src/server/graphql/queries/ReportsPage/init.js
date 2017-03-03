
import {
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
  GraphQLList as List,
} from 'graphql';
import sequelize from '../../../database/mysql/sequelize';

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
      departments: { type: ReportsPageInitType },
      measures: { type: ReportsPageInitType },
      timeframes: { type: ReportsPageInitType },
    },
  }),
  async resolve(parent) {
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
      ],
      timeframes: [
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Yearly', value: 'Yearly' },
      ],
    };

    // include all as a department label
    results.departments.unshift({ label: 'All', value: 'All' });
    return results;
  },
};

export default companyPageInit;

