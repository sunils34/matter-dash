import _ from 'lodash';
import {
  REPORT_DIALOG_TOGGLE,
  REPORT_DIALOG_CHANGE_DEPARTMENT,
  REPORT_DIALOG_CHANGE_MEASURE,
  REPORT_DIALOG_CHANGE_CHART,
  REPORT_DIALOG_CHANGE_TIMEFRAME,
  REPORT_DIALOG_MODIFY_OBJECT_OPEN,
  REPORT_ADD_OR_SAVE_OBJECT,
  REPORT_DELETE_OBJECT,
  REPORT_UPDATE,
  REPORT_RESET,
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
  lastSavedReport: null,
  unsaved: false,
  editingObjIdx: -1,
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
      newState.lastSavedReport = _.cloneDeep(newState.report);
      newState.measures = action.data.measures;
      newState.departments = action.data.departments;
      newState.timeframes = action.data.timeframes;
      newState.unsaved = false;
      return newState;
    case REPORT_DIALOG_MODIFY_OBJECT_OPEN:
      newState.dialogOpenStates.addobject = true;

      newState.dialog.chart = newState.report.objects[action.objectIdx].type;
      newState.dialog.department = newState.report.objects[action.objectIdx].details.department;
      newState.dialog.measure = newState.report.objects[action.objectIdx].details.measure;
      newState.dialog.timeframe = newState.report.objects[action.objectIdx].details.timeframe;
      newState.editingObjIdx = action.objectIdx;

      return newState;

    case REPORT_DIALOG_TOGGLE:
      newState.dialogOpenStates[action.dialog] = action.openState;
      // reset back to not editing an object
      if (action.dialog === 'addobject' && !action.openState) {
        newState.editingObjIdx = -1;
      }
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
    case REPORT_ADD_OR_SAVE_OBJECT: {
      const newObject = {
        type: state.dialog.chart,
        details: {
          department: state.dialog.department,
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
    case REPORT_DELETE_OBJECT:
      newState.report.objects[action.objectIdx].deleted = true;
      newState.unsaved = true;
      return newState;
    case REPORT_RESET:
      newState.unsaved = false;
      newState.report = _.cloneDeep(newState.lastSavedReport);
      return newState;
    case REPORT_UPDATE:
      newState.dialog = _.clone(dialogDefaults);
      newState.report = action.report;
      newState.lastSavedReport = _.cloneDeep(newState.report);
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
