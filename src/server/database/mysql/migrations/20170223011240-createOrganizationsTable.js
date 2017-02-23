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
        }
      });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(organizationTableName);
  }
};
