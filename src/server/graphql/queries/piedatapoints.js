import _ from 'lodash';
import {
  GraphQLList as List,
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import PieDataPointType from '../types/PieDataPointType';
import sequelize from '../../database/mysql/sequelize';
import getFields from './fields';

const getPeriodStatement = (period) => {
  if (period === 'Last Quarter') {
    return ' AND hireDate <  NOW() - INTERVAL 3 MONTH';
  }
  if (period === 'Last 6 Months') {
    return ' AND hireDate <  NOW() - INTERVAL 6 MONTH';
  }
  if (period === 'Last Year') {
    return ' AND hireDate <  NOW() - INTERVAL 12 MONTH';
  }

  return '';
};

const getFocusStmt = (focus) => {
  if (focus === 'attrition') {
    return ' AND terminationDate';
  } else if (focus === 'hiring') {
    return ' AND hireDate';
  }
  // overall, include all current employees
  return ' AND hireDate AND terminationDate IS NULL';
};

const pieDataPoints = {
  type: new ObjectType({
    name: 'PieDataResults',
    fields: {
      results: { type: new List(PieDataPointType) },
      fields: { type: new List(
        new ObjectType({
          name: 'PieDataField',
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
    if (!parent.request.user) return null;
    const user = parent.request.user;
    const organizations = await user.getOrganizations({ raw: true });
    if (!organizations.length) return null;
    const organization = organizations[0];
    const query = args.query;
    let measure = _.lowerCase(query.measure || query.type);
    const focus = _.lowerCase(query.focus || 'Overall');
    let results = null;

    if (measure === 'ethnicity') {
      measure = 'ethnicity';
    } else if (measure === 'age') {
      measure = 'ageRange';
    } else if (measure === 'location') {
      measure = 'location';
    } else if (measure === 'pay grade') {
      measure = 'payGradeCode';
    } else {
      measure = 'gender';
    }

    let stmt = `SELECT COUNT (*) as value, ${measure} as name FROM employees WHERE orgId = $orgId `;

    stmt += getPeriodStatement(query.period);
    stmt += getFocusStmt(focus);

    if (query.department !== 'All') {
      stmt += ` AND (
        department = $department
        OR department IN (
          SELECT employeeValue
          FROM EmployeeComparisonMappings
          WHERE orgId = $orgId
          AND employeeField='department'
          AND comparisonField='department'
          AND comparisonValue = $department
        )
        OR payGradeCode IN (
          SELECT employeeValue
          FROM EmployeeComparisonMappings
          WHERE orgId = $orgId
          AND employeeField='payGradeCode'
          AND comparisonField='department'
          AND comparisonValue = $department
        )
      )
      `;
    }

    stmt += ` GROUP BY ${measure}`;
    results = await sequelize.query(stmt, {
      bind: { orgId: organization.id, department: query.department },
      type: sequelize.QueryTypes.SELECT,
    });
    const fields = await getFields(measure, organization.id, sequelize);
    return { results, fields };
  },
};

export default pieDataPoints;

