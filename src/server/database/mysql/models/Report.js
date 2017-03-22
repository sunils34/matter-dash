import shortid from 'shortid';

export default (Model, DataTypes) => {
  const Report = Model.define('reports', {
    id: {
      type: DataTypes.STRING,
      defaultValue: function gen() {
        return `r_${shortid.generate()}`;
      },
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    extraData: {
      type: DataTypes.STRING,
      defaultValue: '{}',
    },
    details: {
      type: DataTypes.VIRTUAL,
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
    classMethods: {
      associate: (models) => {
        // Associate the organization and user
        Report.hasMany(models.ReportObject, { as: 'ReportObjects', foreignKey: 'reportId' });
        Report.belongsTo(models.User, { as: 'Owner', foreignKey: 'userId' });
      },
    },
    indexes: [
    ],
  }, { tableName: 'reports' });

  return Report;
};
