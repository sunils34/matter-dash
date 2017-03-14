'use strict';
module.exports = function(sequelize, DataTypes) {
  var companyEeoRow = sequelize.define('companyEeoRow', {
    companyName: DataTypes.STRING,
    year: DataTypes.STRING,
    department: DataTypes.TEXT,
    gender: DataTypes.STRING,
    ethnicity: DataTypes.STRING,
    total: DataTypes.INTEGER,
    reportLink: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return companyEeoRow;
};