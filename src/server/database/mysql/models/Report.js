import Sequelize from 'sequelize';
import shortid from 'shortid';
import Model from '../sequelize';

const Report = Model.define('reports', {
  id: {
    type: Sequelize.STRING,
    defaultValue: function gen() {
      return `r_${shortid.generate()}`;
    },
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  extraData: {
    type: Sequelize.STRING,
    defaultValue: '{}',
  },
  details: {
    type: Sequelize.VIRTUAL,
    set: function set(val) {
      this.setDataValue('details', val); // need to do this to validate
      this.setDataValue('extraData', JSON.stringify(val));
    },
    get: function get() {
      return JSON.parse(this.get('extraData'));
    },
    validate: {
      isObject: (val) => {
        if (typeof val !== 'object') {
          throw new Error('Report must be of type data');
        }
      },
    },
  },
}, {
  indexes: [
  ],
}, { tableName: 'reports' });

export default Report;
