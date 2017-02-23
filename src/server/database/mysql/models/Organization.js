import Sequelize from 'sequelize';
import Model from '../sequelize';
import shortid from 'shortid';

const Organization = Model.define('organizations', {
  id: {
    type: Sequelize.STRING,
    defaultValue: shortid.generate,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  }
}, {
  indexes: [
  ]
}, {tableName: 'organizations'});

export default Organization;
