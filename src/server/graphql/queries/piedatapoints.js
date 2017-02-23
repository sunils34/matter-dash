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


const getOrganization = async(user) => {
  var organization = null;
  const organizations = await Organization.findAll({
    include: [{
      model: User,
      through: {
        where: {userId: user.id}
      }
    }] ,
    raw: true
  });

  //TODO for now assume only one org per user
  if(organizations.length) {
    organization = organizations[0];
  }
  return organization;
}

const pieDataPoints = {
  type: new List(PieDataPointType),
  args: {
    query: {type: GraphQLJSON}
  },
  async resolve(parent, args) {
    if(!parent.request.user) return null;
    const user = parent.request.user;
    var organization = await getOrganization(user);
    var query = args.query;
    var results = null;
    if(query.type == 'gender') {
      results = await sequelize.query('SELECT COUNT (*) as value, gender as name FROM adp WHERE orgId = ? GROUP BY gender', {
        replacements: [organization.id], type: sequelize.QueryTypes.SELECT
      });
    }
    else if(query.type == 'ethnicity') {
      results = await sequelize.query('SELECT COUNT (*) as value, eeoEthnicDescription as name FROM adp WHERE orgId = ? GROUP BY eeoEthnicDescription', {
        replacements: [organization.id], type: sequelize.QueryTypes.SELECT
      });
    }
    return results;
  }
}

export default pieDataPoints;

