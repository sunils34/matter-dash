'use strict';

const reportTableName = 'reports';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      reportTableName,
      {
        id: {
          type: Sequelize.STRING,
          defaultValue: Sequelize.UUIDV1,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
        },
        extraData: {
          type: Sequelize.STRING,
          defaultValue: '{}',
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        userId: {
          type: Sequelize.STRING,
        },
      });

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(reportTableName);
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
