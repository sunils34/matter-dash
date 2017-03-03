import { combineReducers } from 'redux';
import app from './app';
import reports from './reports';

const rootReducer = combineReducers({
  app,
  reports,
});

export default rootReducer;
