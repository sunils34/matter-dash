import * as types from '../actionTypes/reports';

export function dataFetched(data) {
  return {
    type: types.REPORT_PAGE_DATA_FETCHED,
    data,
  };
}

export function openReportDialog() {
  return {
    type: types.REPORT_DIALOG_OPEN
  }
}

export function closeReportDialog() {
  return {
    type: types.REPORT_DIALOG_CLOSE
  }
}

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

export function addToReport(activeView) {
  return {
    type: types.REPORT_DIALOG_ADD_TO_REPORT,
  };
}

