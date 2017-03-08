import Sequelize from 'sequelize';
import shortid from 'shortid';
import Model from '../sequelize';

const ReportObject = Model.define('reportobjects', {
  id: {
    type: Sequelize.STRING,
    defaultValue: function gen() {
      return `ro_${shortid.generate()}`;
    },
    primaryKey: true,
  },
  orderNumber: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  type: {
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
          throw new Error('ReportObject details must be of type object');
        }
      },
    },
  },
}, {
  indexes: [
  ],
}, { tableName: 'ReportObjects' });

export default ReportObject;
