'use strict';
var shortid = require('shortid');

const organizationTableName = 'organizations';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      organizationTableName,
      {
        id: {
          type: Sequelize.STRING,
          defaultValue: shortid.generate,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
      });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(organizationTableName);
  }
};
