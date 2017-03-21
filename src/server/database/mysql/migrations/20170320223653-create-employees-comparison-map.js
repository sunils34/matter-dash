'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('EmployeeComparisonMappings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      orgId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      employeeField: {
        type: Sequelize.STRING
      },
      comparisonField: {
        type: Sequelize.STRING
      },
      organizationObject: {
        type: Sequelize.TEXT
      },
      comparisonObject: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('EmployeeComparisonMappings');
  }
};
