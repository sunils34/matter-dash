import * as types from '../actionTypes/reports';

export function dataFetched(data) {
  return {
    type: types.REPORT_PAGE_DATA_FETCHED,
    data,
  };
}

export function createNewReport() {
  return {
    type: types.REPORT_CREATE_NEW,
  };
}

export function reportDialogToggle(dialog, openState) {
  return {
    type: types.REPORT_DIALOG_TOGGLE,
    dialog,
    openState,
  };
}

export function changeReport({ type, value }) {
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

export function addOrSaveObject() {
  return {
    type: types.REPORT_ADD_OR_SAVE_OBJECT,
  };
}

export function resetReport() {
  return {
    type: types.REPORT_RESET,
  };
}

export function modifyObjectDialogOpen(objectIdx) {
  return {
    type: types.REPORT_DIALOG_MODIFY_OBJECT_OPEN,
    objectIdx,
  };
}

export function deleteObject(objectIdx) {
  return {
    type: types.REPORT_DELETE_OBJECT,
    objectIdx,
  };
}

export function updateReport(report) {
  return {
    report,
    type: types.REPORT_UPDATE,
  };
}

export function deleteReport(reportId) {
  return {
    reportId,
    type: types.REPORT_DELETE,
  };
}

export function switchReportViewType(viewType) {
  return {
    viewType,
    type: types.REPORT_CHANGE_VIEW_TYPE
  }
}
