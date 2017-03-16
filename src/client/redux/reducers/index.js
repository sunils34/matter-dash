import { combineReducers } from 'redux';
import app from './app';
import reports from './reports';
import comparison from './comparison';

const reducers = {
  app,
  reports,
  comparison,
};


export default function getRootReducer(apollo) {
  return combineReducers({
    ...reducers,
    apollo: apollo.reducer(),
  });
}
