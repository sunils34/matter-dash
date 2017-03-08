'use strict';

const reportObjectTableName = 'reportobjects';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex(reportObjectTableName, ['reportId']);

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex(reportObjectTableName, ['reportId']);
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  }
};
