import _ from 'lodash';

const COLORS = ['#DEDEDE', '#72D5C6', '#6E6EE2', '#F1BA00', '#E96DA4', '#E28D6E', '#3DBAEF', '#3481A5'];

const getFields = async (type, orgId, sequelize) => {
  let fields = await sequelize.query(`SELECT ${type} as name FROM employees where orgId=$orgId GROUP BY ${type} ORDER BY count(*) DESC`, {
    bind: { orgId },
    type: sequelize.QueryTypes.SELECT,
  });

  fields = _.map(fields, (element, idx) => (
    _.extend(element, { color: COLORS[idx % COLORS.length] })
  ));
  _.reverse(fields);
  return fields;
};

export default getFields;
