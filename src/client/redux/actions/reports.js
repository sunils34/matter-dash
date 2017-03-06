import * as types from '../actionTypes/reports';

export function changeReport({ type, value }, activeView) {
  switch (type) {
    case 'department':
      return {
        type: types.REPORT_DIALOG_CHANGE_DEPARTMENT,
        department: value,
      };
    case 'measure':
      return {
        type: types.REPORT_DIALOG_CHANGE_MEASURE,
        measure: value,
      };
    case 'chart':
      return {
        type: types.REPORT_DIALOG_CHANGE_CHART,
        chart: value,
      };
    case 'timeframe':
      return {
        type: types.REPORT_DIALOG_CHANGE_TIMEFRAME,
        timeframe: value,
      };
    default:
      return null;
  }
}

export function addToReport({ details }, activeView) {
  return {
    type: types.REPORT_DIALOG_ADD_TO_REPORT,
  }
}

