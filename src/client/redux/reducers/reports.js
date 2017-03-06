import _ from 'lodash';
import {
  REPORT_DIALOG_OPEN,
  REPORT_DIALOG_CLOSE,
  REPORT_DIALOG_CHANGE_DEPARTMENT,
  REPORT_DIALOG_CHANGE_MEASURE,
  REPORT_DIALOG_CHANGE_CHART,
  REPORT_DIALOG_CHANGE_TIMEFRAME,
  REPORT_DIALOG_ADD_TO_REPORT,
} from '../actionTypes/reports';

const initialState = {
  dialogIsOpen: false,
  dialog: {
    department: 'All',
    measure: 'Age',
    chart: 'bar',
    timeframe: 'Yearly',
  },
};

export default function reports(state = initialState, action) {
  const newState = _.clone(state);
  switch (action.type) {
    case REPORT_DIALOG_OPEN:
      newState.dialogOpen = true;
      return newState;
    case REPORT_DIALOG_CLOSE:
      newState.dialogOpen = false;
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
    default:
      return state;
  }
}
