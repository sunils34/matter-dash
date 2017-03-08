import _ from 'lodash';
import {
  REPORT_DIALOG_TOGGLE,
  REPORT_DIALOG_CHANGE_DEPARTMENT,
  REPORT_DIALOG_CHANGE_MEASURE,
  REPORT_DIALOG_CHANGE_CHART,
  REPORT_DIALOG_CHANGE_TIMEFRAME,
  REPORT_ADD_OBJECT,
  REPORT_UPDATE,
  REPORT_PAGE_DATA_FETCHED,
} from '../actionTypes/reports';

const dialogDefaults = {
  submitting: false,
  department: 'All',
  measure: 'Age',
  chart: 'bar',
  timeframe: 'Yearly',
};

const initialState = {
  dialog: _.clone(dialogDefaults),
  dialogOpenStates: {
    addobject: false,
    save: false,
  },
  report: null,
  unsaved: false,
  saveDialogOpen: false,
  start: {
    sort: 'DESC',
  },
};

export default function reports(state = initialState, action) {
  const newState = _.cloneDeep(state);
  switch (action.type) {
    case REPORT_PAGE_DATA_FETCHED:
      newState.report = action.data.report;
      newState.measures = action.data.measures;
      newState.departments = action.data.departments;
      newState.timeframes = action.data.timeframes;
      return newState;
    case REPORT_DIALOG_TOGGLE:
      newState.dialogOpenStates[action.dialog] = action.openState;
      return newState;
    case REPORT_DIALOG_CHANGE_MEASURE:
      newState.dialog.measure = action.measure;
      return newState;
    case REPORT_DIALOG_CHANGE_DEPARTMENT:
      newState.dialog.department = action.department;
      return newState;
    case REPORT_DIALOG_CHANGE_CHART:
      newState.dialog.chart = action.chart;
      return newState;
    case REPORT_DIALOG_CHANGE_TIMEFRAME:
      newState.dialog.timeframe = action.timeframe;
      return newState;
    case REPORT_ADD_OBJECT:
      newState.report.objects.push(action.object);
      newState.unsaved = true;
      return newState;
    case REPORT_UPDATE:
      newState.dialog = _.clone(dialogDefaults);
      newState.report = action.report;
      newState.unsaved = false;
      newState.dialogOpenStates = {
        addobject: false,
        save: false,
      };
      return newState;
    default:
      return state;
  }
}
