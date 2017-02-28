import Organization from '../../database/mysql/models/Organization';
import User from '../../database/mysql/models/User';
import {GraphQLID as ID,GraphQLNonNull as NonNull,GraphQLList as List} from 'graphql';
import sequelize from '../../database/mysql/sequelize';
import _ from 'lodash';
import getFields from './fields';

import {
  GraphQLString as StringType,
  GraphQLObjectType as ObjectType,
} from 'graphql';

const COLORS = ['#6E6EE2', '#72D5C6', '#3DBAEF', '#E96DA4', '#E28D6E', '#F1BA00', '#3481A5'];
import GraphQLJSON from 'graphql-type-json';

const getLast5Years = async function(organization, query) {
  const stmt = 'select * from (select DISTINCT YEAR(hireDate) as name from employees where orgId= $orgId ORDER BY name DESC LIMIT 5) AS T ORDER BY name ASC;';
  var results = await sequelize.query(stmt, {
    bind: {orgId: organization.id},
    type: sequelize.QueryTypes.SELECT
  });

  return results;
}


const barDataPoints = {
  type: new ObjectType({
    name: 'BarDataResults',
    fields: {
      results: { type: new List(GraphQLJSON) },
      fields: { type: new List(
        new ObjectType({
          name: 'BarDataField',
          fields: {
            name: { type: StringType },
            color: { type: StringType },
          },
        })),
      },
    },
  }),
  args: {
    query: { type: GraphQLJSON },
  },
  async resolve(parent, args) {
    if(!parent.request.user) return null;
    const user = parent.request.user;
    const organizations = await user.getOrganizations({raw: true});
    if(!organizations.length) return null;
    var organization = organizations[0];
    var query = args.query;
    var type = query.type;

    if(type == 'ethnicity') {
      type = 'eeoEthnicDescription';
    }
    else {
      type = 'gender';
    }

    var stmt = 'SELECT COUNT (*) as v, '+type+' as k FROM employees where orgId=$orgId '

    if(query.department != 'All') {
      stmt += ' AND department = $department ';
    }
    stmt += ` AND hireDate < '$year' GROUP BY ${type} ORDER BY v ASC`;
    const results = await getLast5Years(organization, query);

    for (let idx in results)  {
      var r = results[idx];
      var countResults = await sequelize.query(stmt, {
        bind: { orgId: organization.id, department: query.department, year: r.name, type },
        type: sequelize.QueryTypes.SELECT,
      });
      countResults.forEach(function(c) {
        r[c.k] = c.v;
      });
    }

    const fields = await getFields(type, organization.id, sequelize);
    return { results, fields };
  },
}

export default barDataPoints;

