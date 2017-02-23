'use strict';

const organizationTableName = 'organizations';
module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.bulkInsert(organizationTableName, [{
      id: 'testOrg',
      name: "Matter"
    }], {});

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(organizationTableName, null, {});
  }
};
