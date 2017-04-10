import OrganizationType from '../types/OrganizationType';
import Organization from '../../database/mysql/models/Organization';
import User from '../../database/mysql/models/User';
import sequelize from '../../database/mysql/sequelize';
import getFieldNames from 'graphql-list-fields';
import _ from 'lodash';

import {
  GraphQLList as List
} from 'graphql';

const organization = {
  type: OrganizationType,
  args: {},
  async resolve(parent, args, context, info) {
    const fields = getFieldNames(info);
    if (parent.request.user) {
      const user = parent.request.user;
      const organizations = await user.getOrganizations({ raw: true });

      // TODO for now assume only one org per user exists
      if (organizations.length) {
        const org = organizations[0];

        if (_.includes(fields, 'employee_count')) {
          const e = await sequelize.query('SELECT COUNT (*) as count FROM employees WHERE positionStatus=\'Active\' AND orgId = ?', {
            replacements: [org.id], type: sequelize.QueryTypes.SELECT,
          });

          if (e.length && e[0].count) {
            org.employee_count = e[0].count;
          }
        }

        if (_.includes(fields, 'departments')) {
          const d = await sequelize.query(`
            SELECT DISTINCT (department) from employees WHERE orgId=$orgId AND department <> ''
            UNION DISTINCT SELECT distinct(comparisonValue) FROM EmployeeComparisonMappings
              WHERE comparisonField='department' AND orgId=$orgId
            ORDER BY department ASC`, {
              bind: { orgId: org.id }, type: sequelize.QueryTypes.SELECT,
            });
          org.departments = _.map(d, 'department');
        }
        return org;
      }
    }
    return null;
  }
};

export default organization;

