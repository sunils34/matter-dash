
import {
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
  GraphQLList as List,
} from 'graphql';
import sequelize from '../../../database/mysql/sequelize';

const CompanyPageInitType = new List(new ObjectType({
  name: 'CompanyPageInitType',
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
    name: 'CompanyPageInitResults',
    fields: {
      departments: { type: CompanyPageInitType },
      genders: { type: CompanyPageInitType },
      ethnicities: { type: CompanyPageInitType },
      timeframes: { type: CompanyPageInitType },
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
      genders: await getDistinctValues(organization.id, 'gender'),
      ethnicities: await getDistinctValues(organization.id, 'eeoEthnicDescription'),
      timeframes: [
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Yearly', value: 'Yearly' },
      ],
    };

    return results;
  },
};

export default companyPageInit;
