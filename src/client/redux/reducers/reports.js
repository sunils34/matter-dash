import _ from 'lodash';
import {
  REPORT_DIALOG_OPEN,
  REPORT_DIALOG_CLOSE,
  REPORT_DIALOG_CHANGE_DEPARTMENT,
  REPORT_DIALOG_CHANGE_MEASURE,
  REPORT_DIALOG_CHANGE_CHART,
  REPORT_DIALOG_CHANGE_TIMEFRAME,
  REPORT_DIALOG_ADD_TO_REPORT_SUBMIT,
  REPORT_UPDATE,
  REPORT_PAGE_DATA_FETCHED,
} from '../actionTypes/reports';

const dialogDefaults = {
  open: false,
  submitting: false,
  department: 'All',
  measure: 'Age',
  chart: 'bar',
  timeframe: 'Yearly',
};

const initialState = {
  dialog: _.clone(dialogDefaults),
  report: null,
  start: {
    sort: 'DESC',
  },
};

export default function reports(state = initialState, action) {
  const newState = _.clone(state);
  switch (action.type) {
    case REPORT_PAGE_DATA_FETCHED:
      newState.report = action.data.report;
      newState.measures = action.data.measures;
      newState.departments = action.data.departments;
      newState.timeframes = action.data.timeframes;
      return newState;
    case REPORT_DIALOG_OPEN:
      newState.dialog.open = true;
      return newState;
    case REPORT_DIALOG_CLOSE:
      newState.dialog.open = false;
      return newState;
    case REPORT_DIALOG_CHANGE_MEASURE:
      newState.dialog.measure = action.measure;
      return newState;
    case REPORT_DIALOG_CHANGE_DEPARTMENT:
      newState.dialog.department = action.department;
      return newState;
    case REPORT_DIALOG_CHANGE_MEASURE:
      newState.dialog.measure = action.measure;
      return newState;
    case REPORT_DIALOG_CHANGE_CHART:
      newState.dialog.chart = action.chart;
      return newState;
    case REPORT_DIALOG_CHANGE_TIMEFRAME:
      newState.dialog.timeframe = action.timeframe;
      return newState;
    case REPORT_DIALOG_ADD_TO_REPORT_SUBMIT:
      newState.dialog.submitting = true;
      return newState;
    case REPORT_UPDATE:
      newState.dialog = _.clone(dialogDefaults);
      newState.report = action.report;
      return newState;
    default:
      return state;
  }
}
