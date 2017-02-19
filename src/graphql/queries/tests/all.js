
import {GraphQLID as ID,GraphQLNonNull as NonNull,GraphQLList as List} from 'graphql';
import TestType from '../../types/TestType';
import _ from 'lodash';

export var TestList = [
  {
    "id": 1446412739541,
    "title": "Group 1",
  },
  {
    "id": 1446412740882,
    "title": "Group 2",
  },
  {
    "id": 1446412740883,
    "title": "Group 3",
  },
  {
    "id": 1446412740884,
    "title": "Group 4",
  },
  {
    "id": 1446412740885,
    "title": "Group 5",
  },
  {
    "id": 1446412740886,
    "title": "Group 6",
  },
  {
    "id": 1446412740887,
    "title": "Group 7",
  },
  {
    "id": 1446412740888,
    "title": "Group 8",
  },
  {
    "id": 1446412740889,
    "title": "Group 9",
  }
];



const tests = {
  type: new List(TestType),
  resolve: function () {
    return TestList;
  }
};


export default tests;
