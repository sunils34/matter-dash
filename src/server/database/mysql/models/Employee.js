import shortid from 'shortid';

module.exports = function(sequelize, DataTypes) {
  var Employee = sequelize.define('employees', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: shortid.generate,
    },
    orgId: DataTypes.STRING,
    employeeId: DataTypes.STRING,
    positionStatus: DataTypes.STRING,
    hireDate: {
      type: DataTypes.DATE
    },
    flsaCode: DataTypes.STRING,
    jobTitle: DataTypes.STRING,
    payGradeCode: DataTypes.STRING,
    workerCategory: DataTypes.STRING,
    department: DataTypes.STRING,
    location: DataTypes.STRING,
    age: DataTypes.STRING,
    ageRange: DataTypes.STRING,
    eeoEthnicCode: DataTypes.STRING,
    eeoEthnicDescription: DataTypes.STRING,
    ethnicity: DataTypes.STRING,
    gender: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
    },
  });
  return Employee;
};
