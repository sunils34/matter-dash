import { EventTypes } from 'redux-segment';
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
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
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
  const meta = {
    analytics: {
      eventType: EventTypes.track,
      eventPayload: {
        properties: {
          value,
        },
      },
    },
  };

  switch (type) {
    case 'department':
      return {
        type: types.REPORT_DIALOG_CHANGE_DEPARTMENT,
        department: value,
        meta,
      };
    case 'focus':
      return {
        type: types.REPORT_DIALOG_CHANGE_FOCUS,
        focus: value,
        meta,
      };
    case 'measure':
      return {
        type: types.REPORT_DIALOG_CHANGE_MEASURE,
        measure: value,
        meta,
      };
    case 'chart':
      return {
        type: types.REPORT_DIALOG_CHANGE_CHART,
        chart: value,
        meta,
      };
    case 'timeframe':
      return {
        type: types.REPORT_DIALOG_CHANGE_TIMEFRAME,
        timeframe: value,
        meta,
      };
    default:
      return null;
  }
}

export function addOrSaveObject() {
  return {
    type: types.REPORT_ADD_OR_SAVE_OBJECT,
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
  };
}

export function resetReport() {
  return {
    type: types.REPORT_RESET,
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
  };
}

export function modifyObjectDialogOpen(objectIdx) {
  return {
    type: types.REPORT_DIALOG_MODIFY_OBJECT_OPEN,
    objectIdx,
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
  };
}

export function deleteObject(objectIdx) {
  return {
    type: types.REPORT_DELETE_OBJECT,
    objectIdx,
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
  };
}

export function updateReport(report) {
  return {
    report,
    type: types.REPORT_UPDATE,
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
  };
}

export function deleteReport(reportId) {
  return {
    reportId,
    type: types.REPORT_DELETE,
    meta: {
      analytics: {
        eventType: EventTypes.track,
      },
    },
  };
}

export function switchReportViewType(viewType) {
  return {
    viewType,
    type: types.REPORT_CHANGE_VIEW_TYPE,
    meta: {
      analytics: {
        eventType: EventTypes.track,
        eventPayload: {
          properties: {
            viewType,
          },
        },
      },
    },
  };
}
