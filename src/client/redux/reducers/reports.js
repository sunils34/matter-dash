import _ from 'lodash';
import {
  REPORT_DIALOG_TOGGLE,
  REPORT_DIALOG_CHANGE_DEPARTMENT,
  REPORT_DIALOG_CHANGE_FOCUS,
  REPORT_DIALOG_CHANGE_MEASURE,
  REPORT_DIALOG_CHANGE_CHART,
  REPORT_DIALOG_CHANGE_TIMEFRAME,
  REPORT_DIALOG_MODIFY_OBJECT_OPEN,
  REPORT_ADD_OR_SAVE_OBJECT,
  REPORT_DELETE_OBJECT,
  REPORT_UPDATE,
  REPORT_RESET,
  REPORT_PAGE_DATA_FETCHED,
  REPORT_CHANGE_VIEW_TYPE,
} from '../actionTypes/reports';

const dialogDefaults = {
  submitting: false,
  department: 'All',
  focus: 'Overall',
  measure: 'Gender',
  chart: 'bar',
  timeframe: 'Quarterly',
};

const initialState = {
  dialog: _.clone(dialogDefaults),
  dialogOpenStates: {
    addobject: true,
    save: false,
  },
  report: null,
  lastSavedReport: null,
  unsaved: false,
  editingObjIdx: -1,
  saveDialogOpen: false,
  start: {
    sort: 'DESC',
  },
};

export default function reports(state = initialState, action) {
  let newState;
  switch (action.type) {
    case REPORT_PAGE_DATA_FETCHED:

      return {
        ...state,
        dialogOpenStates: {
          ...state.dialogOpenStates,
          // by default open the dialog for new reports
          addobject: action.data.report.id === 'new',
        },
        report: action.data.report,
        // TODO do we need to do a clone deep here?
        lastSavedReport: _.cloneDeep(action.data.report),
        measures: action.data.measures,
        departments: action.data.departments,
        focuses: action.data.focuses,
        timeframes: action.data.timeframes,
        unsaved: false,
      };

    case REPORT_DIALOG_MODIFY_OBJECT_OPEN:

      return {
        ...state,
        dialogOpenStates: {
          ...state.dialogOpenStates,
          addobject: true,
        },
        dialog: {
          ...state.dialog,
          chart: state.report.objects[action.objectIdx].type,
          department: state.report.objects[action.objectIdx].details.department,
          focus: state.report.objects[action.objectIdx].details.focus,
          measure: state.report.objects[action.objectIdx].details.measure,
          timeframe: state.report.objects[action.objectIdx].details.timeframe,
        },
        editingObjIdx: action.objectIdx,
      };
    case REPORT_DIALOG_TOGGLE: {
      let editingObjIdx = state.editingObjIdx;
      // reset back to not editing an object
      if (action.dialog === 'addobject' && !action.openState) {
        editingObjIdx = -1;
      }
      return {
        ...state,
        dialogOpenStates: {
          ...state.dialogOpenStates,
          [action.dialog]: action.openState,
        },
        editingObjIdx,
      };
    }
    case REPORT_DIALOG_CHANGE_MEASURE:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          measure: action.measure,
        },
      };
    case REPORT_DIALOG_CHANGE_DEPARTMENT:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          department: action.department,
        },
      };
    case REPORT_DIALOG_CHANGE_FOCUS:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          focus: action.focus,
        },
      };
    case REPORT_DIALOG_CHANGE_CHART:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          chart: action.chart,
        },
      };
    case REPORT_DIALOG_CHANGE_TIMEFRAME:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          timeframe: action.timeframe,
        },
      };
    case REPORT_ADD_OR_SAVE_OBJECT: {
      newState = _.cloneDeep(state);
      const newObject = {
        type: state.dialog.chart,
        details: {
          department: state.dialog.department,
          focus: state.dialog.focus,
          measure: state.dialog.measure,
          timeframe: state.dialog.timeframe,
        },
      };

      // save new object
      if (state.editingObjIdx >= 0) {
        newState.report.objects[state.editingObjIdx] = {
          ...newState.report.objects[state.editingObjIdx],
          ...newObject,
        };
      } else {
        // add new object
        newState.report.objects.push(newObject);
      }
      newState.editingObjIdx = -1;
      newState.unsaved = true;
      return newState;
    }
    case REPORT_DELETE_OBJECT: {
      const objects = _.cloneDeep(state.report.objects);
      objects[action.objectIdx].deleted = true;
      return {
        ...state,
        report: {
          ...state.report,
          objects,
        },
        unsaved: true,
      };
    }
    case REPORT_RESET:
      return {
        ...state,
        unsaved: false,
        report: _.cloneDeep(state.lastSavedReport), // TODO should this be cloned?
      };
    case REPORT_UPDATE:
      return {
        ...state,
        dialog: _.clone(dialogDefaults),
        report: action.report,
        lastSavedReport: _.cloneDeep(action.report),
        unsaved: false,
        dialogOpenstates: {
          addobject: false,
          save: false,
        },
      };
    case REPORT_CHANGE_VIEW_TYPE:
      newState = {
        ...state,
        report: {
          ...state.report,
          details: {
            ...state.report.details,
            viewType: action.viewType,
          },
        },
      };
      return {
        ...newState,
        unsaved: !_.isEqual(newState.lastSavedReport, newState.report),
      };
    default:
      return state;
  }
}
