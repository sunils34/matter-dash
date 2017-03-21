'use strict';
var shortid = require('shortid');

const adpTableName = 'employees';

module.exports = {
  up: function (queryInterface, Sequelize) {


    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.createTable(
      adpTableName,
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          defaultValue: shortid.generate,
        },
        orgId: Sequelize.STRING,
        employeeId: Sequelize.STRING,
        positionStatus: Sequelize.STRING,
        hireDate: {
          type: Sequelize.DATE
        },
        flsaCode: Sequelize.STRING,
        jobTitle: Sequelize.STRING,
        payGradeCode: Sequelize.STRING,
        workerCategory: Sequelize.STRING,
        department: Sequelize.STRING,
        location: Sequelize.STRING,
        age: Sequelize.STRING,
        ageRange: Sequelize.STRING,
        eeoEthnicCode: Sequelize.STRING,
        eeoEthnicDescription: Sequelize.STRING,
        gender: Sequelize.STRING,
        ethnicity: Sequelize.STRING,
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable(adpTableName);
  }
};
