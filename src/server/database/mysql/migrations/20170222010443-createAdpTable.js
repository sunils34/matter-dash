'use strict';

const adpTableName = 'adp';

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
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        orgId: Sequelize.STRING,
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        positionStatus: Sequelize.STRING,
        hireDate: {
          type: Sequelize.DATE
        },
        jobFunction: Sequelize.STRING,
        payGradeCode: Sequelize.STRING,
        location: Sequelize.STRING,
        age: Sequelize.STRING,
        eeoEthnicDescription: Sequelize.STRING,
        gender: Sequelize.STRING,
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
