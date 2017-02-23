import {
  CHANGE_DEPARTMENT,
} from '../actionTypes/app';
import _ from 'lodash';

const initialState = {
  department: 'All',
  period: 'All',
  loaded: false,
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case CHANGE_DEPARTMENT:
      return {
        ...state,
        department: action.department
      }
    default:
      return state;
  }
}
