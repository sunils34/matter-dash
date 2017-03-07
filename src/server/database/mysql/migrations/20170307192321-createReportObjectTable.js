'use strict';

const reportObjectTableName = 'reportobjects';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      reportObjectTableName,
      {
        id: {
          type: Sequelize.STRING,
          defaultValue: Sequelize.UUIDV1,
          primaryKey: true
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
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        reportId: {
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
    return queryInterface.dropTable(reportObjectTableName);
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  }
};
