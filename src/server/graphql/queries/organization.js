import OrganizationType from '../types/OrganizationType';
import Organization from '../../database/mysql/models/Organization';
import User from '../../database/mysql/models/User';
import sequelize from '../../database/mysql/sequelize';
import _ from 'lodash';

import {
  GraphQLList as List
} from 'graphql';

const organization = {
  type: OrganizationType,
  args: {},
  async resolve(parent, args, {db}) {

    if(parent.request.user) {
      const user = parent.request.user;
      const organizations = await user.getOrganizations({raw: true});

      //TODO for now assume only one org per user exists
      if(organizations.length) {
        var organization = organizations[0];

        var results = await sequelize.query('SELECT COUNT (*) as count FROM employees WHERE positionStatus=\'Active\' AND orgId = ?', {
          replacements: [organization.id], type: sequelize.QueryTypes.SELECT
        });

        if(results.length && results[0].count) {
          organization.employee_count = results[0].count;
        }

        var results = await sequelize.query('SELECT DISTINCT(department) FROM employees WHERE orgId = ?', {
          replacements: [organization.id], type: sequelize.QueryTypes.SELECT
        });
        organization.departments = _.map(results, 'department');
        return organization;
      }
    }
    return null;
  }
};

export default organization;

