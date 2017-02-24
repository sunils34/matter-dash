import {
  CHANGE_DEPARTMENT,
  CHANGE_PERIOD,
  CHANGE_EMPLOYEES_COUNT
} from '../actionTypes/app';
import _ from 'lodash';

const initialState = {
  department: 'All',
  period: 'Snapshot',
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
    case CHANGE_PERIOD:
      return {
        ...state,
        period: action.period
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
