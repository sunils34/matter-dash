import shortid from 'shortid';

export default (Model, DataTypes) => {
  const ReportObject = Model.define('reportobjects', {
    id: {
      type: DataTypes.STRING,
      defaultValue: function gen() {
        return `ro_${shortid.generate()}`;
      },
      primaryKey: true,
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    type: {
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
            throw new Error('ReportObject details must be of type object');
          }
        },
      },
    },
  }, {
    classMethods: {
      associate: (models) => {
        // Associate the organization and user
        ReportObject.belongsTo(models.Report, {
          as: 'Report',
          foreignKey: 'reportId',
          onDelete: 'CASCADE',
        });
      },
    },
    indexes: [
    ],
  }, { tableName: 'ReportObjects' });

  return ReportObject;
};
