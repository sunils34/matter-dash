import * as types from '../actionTypes/app';

export function changeDepartment(newDepartment, activeView) {
    return {
        type: types.CHANGE_DEPARTMENT,
        department: newDepartment,
        activeView,
    };
}
