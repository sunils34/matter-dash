import * as types from '../actionTypes/reports';

export function dataFetched(data) {
  return {
    type: types.REPORT_PAGE_DATA_FETCHED,
    data,
  };
}

export function createNewReport() {
  return {
    type: types.REPORT_CREATE_NEW
  }
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

export function addToReportSubmit(activeView) {
  return {
    type: types.REPORT_DIALOG_ADD_TO_REPORT_SUBMIT,
  };
}

export function updateReport(report, activeView) {
  return {
    report,
    type: types.REPORT_UPDATE,
  };
}
