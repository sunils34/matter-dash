import {
  CHANGE_DEPARTMENT,
  CHANGE_PERIOD,
  CHANGE_EMPLOYEES_COUNT,
  SET_USER,
} from '../actionTypes/app';

const initialState = {
  department: 'All',
  period: 'Snapshot',
  employee_count: 0,
  loaded: false,
  user: {},
  organization: {},
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
        organization: action.organization,
        employee_count: action.organization.employee_count,
      };
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
