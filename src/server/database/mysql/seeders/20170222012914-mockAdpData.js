'use strict';
var faker = require('faker');
var rwc = require('random-weighted-choice');
var shortid = require('shortid');
var _ = require('lodash');

const adpTableName = 'employees';

const generateAgeDetails = function () {
    var age = faker.random.number({min:18, max:65});
    var ageRange = '';

    if(_.inRange(age, 20, 30)) {
      ageRange = '20-29';
    } else if(_.inRange(age, 30, 40)) {
      ageRange = '30-39';
    } else if(_.inRange(age, 40, 50)) {
      ageRange = '40-49';
    }
    else if(_.inRange(age, 50, 60)) {
      ageRange = '50-59';
    }
    else if (age < 20) {
      ageRange = '< 20';
    }
    else {
      ageRange = '60+';
    }
    return {age: age, ageRange: ageRange};
}

const generateEthnicityDetails = function() {
    var eeoEthnicDescription = rwc([
      {id:'Hispanic or Latino', weight:2},
      {id:'White', weight:60},
      {id:'Black or African American',weight:5},
      {id:'Native Hawaiian', weight:1},
      {id:'Asian', weight:30},
      {id:'American Indian or Alaska Native',weight:1},
      {id:'Two or more races',weight:6}
    ]);

    var eeoCode = 0;

    switch (eeoEthnicDescription) {
      case 'Hispanic or Latino':
        eeoCode = 3;
        break;
      case 'White':
        eeoCode = 1;
        break;
      case 'Black or African American':
        eeoCode = 2;
        break;
      case 'Native Hawaiian':
        eeoCode = 6;
        break;
      case 'Asian':
        eeoCode = 4;
        break;
      case 'American Indian or Alaska Native':
        eeoCode = 5;
        break;
      case 'Two or more races':
        eeoCode = 9;
        break;
      default:
        eeoCode = 1;
    }

    return {eeoEthnicDescription: eeoEthnicDescription, eeoCode: eeoCode}
}

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
      var ageDetails = generateAgeDetails();
      var ethnicityDetails = generateEthnicityDetails();
      var row = {
        id: shortid.generate(),
        orgId: "testOrg",
        employeeId: shortid.generate(),
        positionStatus: rwc([
          {id:'Active', weight:100},
          {id:'Leave', weight:20}
        ]),
        hireDate: faker.date.between('2005-01-01', new Date()),
        flsaCode: rwc([
          {id:'E', weight:100},
          {id:'N', weight:20}
        ]),
        jobTitle: faker.name.title(),
        payGradeCode: rwc([
          {id:'A', weight:100},
          {id:'C', weight:20},
          {id:'D', weight:100},
          {id:'E', weight:20},
          {id:'F', weight:20}
        ]),
        workerCategory: rwc([
          {id:'Regular Full-Time', weight:100},
          {id:'Regular Part-Time', weight:20},
          {id:'Salaried Non-Exempt', weight:20}
        ]),
        department: rwc([
          {id:'EXEC',weight:2},
          {id:'TECH',weight:40},
          {id:'PRODUCT', weight:30},
          {id:'HR',weight:5},
          {id:'FINANCE',weight:5},
          {id:'LEGAL',weight:5},
        ]),
        location: faker.address.city(),
        age: ageDetails.age,
        ageRange: ageDetails.ageRange,
        eeoEthnicCode: ethnicityDetails.eeoCode,
        eeoEthnicDescription: ethnicityDetails.eeoEthnicDescription,
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
