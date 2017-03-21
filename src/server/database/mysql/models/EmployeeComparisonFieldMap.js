'use strict';
module.exports = function(sequelize, DataTypes) {
  var EmployeeComparisonMap = sequelize.define('EmployeeComparisonMappings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    orgId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    employeeType: DataTypes.STRING,
    comparisonType: DataTypes.STRING,
    organizationObject: DataTypes.TEXT,
    comparisonObject: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
    },
  });
  return EmployeeComparisonMap;
};
