import {
  REPORT_DIALOG_CHANGE_DEPARTMENT,
  REPORT_DIALOG_CHANGE_MEASURE,
  REPORT_DIALOG_CHANGE_CHART,
  REPORT_DIALOG_CHANGE_TIMEFRAME,
} from '../actionTypes/reports';

const initialState = {
  department: 'All',
  measure: 'Age',
  chart: null,
  timeframe: 'Yearly',
};

export default function reports(state = initialState, action) {
  switch (action.type) {
    case REPORT_DIALOG_CHANGE_DEPARTMENT:
      return {
        ...state,
        department: action.department,
      };
    case REPORT_DIALOG_CHANGE_MEASURE:
      return {
        ...state,
        measure: action.measure,
      };
    case REPORT_DIALOG_CHANGE_CHART:
      return {
        ...state,
        chart: action.chart,
      };
    case REPORT_DIALOG_CHANGE_TIMEFRAME:
      return {
        ...state,
        timeframe: action.timeframe,
      };
    default:
      return state;
  }
}
