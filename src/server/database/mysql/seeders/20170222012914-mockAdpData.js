'use strict';
var faker = require('faker');
var rwc = require('random-weighted-choice');

const adpTableName = 'adp';

module.exports = {
  up: function (queryInterface, Sequelize) {
        /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
      name: 'John Doe',
      isBetaMember: false
      }], {});
    */

    //TODO bias and skew data to more real-world companies
    var data = [];
    var positionStatusValues = ['Active', 'Terminated'];

    var limit = faker.random.number({min:500, max:3000});

    for(var i =0; i < limit; i++) {
      var row = {
        id: i,
        orgId: "testOrg",
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        positionStatus: rwc([
          {id:'Active', weight:100},
          {id:'Terminated', weight:20}
        ]),
        hireDate: faker.date.between('2005-01-01', new Date()),
        jobFunction: rwc([
          {id:'Leadership',weight:5},
          {id:'Engineering',weight:40},
          {id:'Customer Support',weight:20},
          {id:'Product',weight:20},
          {id:'Sales', weight:30}
        ]),
        payGradeCode: rwc([
          {id:'A',weight:5},
          {id:'B',weight:40},
          {id:'C',weight:30},
          {id:'D',weight:20}
        ]),
        location: faker.address.city(),
        age: 6,
        eeoEthnicDescription: rwc([
          {id:'Hispanic or Latino',weight:2},
          {id:'White',weight:60},
          {id:'Black or African American',weight:5},
          {id:'Native Hawaiian',weight:1},
          {id:'Asian',weight:30},
          {id:'American Indian or Alaska Native',weight:1},
          {id:'Two or more races',weight:6}
        ]),
        gender: rwc([
          {id:'Male',weight:70},
          {id:'Female',weight:20}
          //hope to add more categories soon
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      data.push(row);
    }
    return queryInterface.bulkInsert(adpTableName, data, {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete(adpTableName, null, {});
  }
};
