import _ from 'lodash';
import {
  REPORT_DIALOG_CHANGE_DEPARTMENT,
  REPORT_DIALOG_CHANGE_MEASURE,
  REPORT_DIALOG_CHANGE_CHART,
  REPORT_DIALOG_CHANGE_TIMEFRAME,
} from '../actionTypes/reports';

const initialState = {
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
