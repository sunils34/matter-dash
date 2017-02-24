import {
  CHANGE_DEPARTMENT,
  CHANGE_EMPLOYEES_COUNT
} from '../actionTypes/app';
import _ from 'lodash';

const initialState = {
  department: 'All',
  period: 'All',
  employee_count: 100,
  loaded: false,
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DEPARTMENT:
      return {
        ...state,
        department: action.department
      }
    case CHANGE_EMPLOYEES_COUNT:
      return {
        ...state,
        employee_count: action.count
      }
    default:
      return state;
  }
}
