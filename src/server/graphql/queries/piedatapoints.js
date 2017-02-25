import Organization from '../../database/mysql/models/Organization';
import User from '../../database/mysql/models/User';
import {GraphQLID as ID,GraphQLNonNull as NonNull,GraphQLList as List} from 'graphql';
import PieDataPointType from '../types/PieDataPointType';
import sequelize from '../../database/mysql/sequelize';

import {
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import GraphQLJSON from 'graphql-type-json';


const getPeriodStatement = (period) => {

  if(period == 'Last Quarter') {
    return ' AND hireDate <  NOW() - INTERVAL 3 MONTH';
  }
  if(period == 'Last 6 Months') {
    return ' AND hireDate <  NOW() - INTERVAL 6 MONTH';
  }
  if(period == 'Last Year') {
    return ' AND hireDate <  NOW() - INTERVAL 12 MONTH';
  }

  return '';
}

const pieDataPoints = {
  type: new List(PieDataPointType),
  args: {
    query: {type: GraphQLJSON}
  },
  async resolve(parent, args) {
    if(!parent.request.user) return null;
    const user = parent.request.user;
    const organizations = await user.getOrganizations({raw: true});
    if(!organizations.length) return null;
    var organization = organizations[0];
    var query = args.query;
    var type = query.type;
    var results = null;

    if(type == 'ethnicity') {
      type = 'eeoEthnicDescription';
    }
    else {
      type = 'gender';
    }

    var stmt = 'SELECT COUNT (*) as value, ' + type + ' as name FROM employees WHERE positionStatus = "Active" AND orgId = $orgId ';

    stmt += getPeriodStatement(query.period);
    console.log(stmt);

    if(query.department != 'All') {
      stmt += ' AND department = $department ';
    }
    stmt += ' GROUP BY ' + type;
    results = await sequelize.query(stmt, {
      bind: { orgId: organization.id, department: query.department},
      type: sequelize.QueryTypes.SELECT
    });
    return results;
  }
}

export default pieDataPoints;

