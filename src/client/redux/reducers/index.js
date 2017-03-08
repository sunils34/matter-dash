import { combineReducers } from 'redux';
import app from './app';
import reports from './reports';

const reducers = {
  app,
  reports,
};


export default function getRootReducer(apollo) {
  return combineReducers({
    ...reducers,
    apollo: apollo.reducer(),
  });
}
