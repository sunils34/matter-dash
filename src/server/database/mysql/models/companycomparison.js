'use strict';
module.exports = function(sequelize, DataTypes) {
  var companyComparison = sequelize.define('companyComparison', {
    companyName: DataTypes.STRING,
    year: DataTypes.STRING,
    department: DataTypes.TEXT,
    gender: DataTypes.STRING,
    ethnicity: DataTypes.STRING,
    pct: DataTypes.FLOAT,
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
  return companyComparison;
};