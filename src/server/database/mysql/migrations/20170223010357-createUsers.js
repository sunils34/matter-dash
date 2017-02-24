'use strict';

const userTableName = 'users';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      userTableName,
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV1,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING(255),
        },
        emailConfirmed: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },

        picture: {
          type: Sequelize.STRING(255)
        },

        gender: {
          type: Sequelize.STRING(50)
        },

        location: {
          type: Sequelize.STRING(100)
        },

        profileId: {
          type: Sequelize.STRING(100)
        },
        profileType: {
          type: Sequelize.STRING(100)
        },
        website: {
          type: Sequelize.STRING(255)
        },
        passwordHash: Sequelize.STRING,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable(userTableName);
  }
};
