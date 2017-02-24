import * as types from '../actionTypes/app';

export function changeDepartment(newDepartment, activeView) {
    return {
        type: types.CHANGE_DEPARTMENT,
        department: newDepartment,
        activeView,
    };
}

export function changePeriod(newPeriod, activeView) {
    return {
        type: types.CHANGE_PERIOD,
        period: newPeriod,
        activeView,
    };
}

export function changeEmployeesCount(newCount, activeView) {
    return {
        type: types.CHANGE_EMPLOYEES_COUNT,
        count: newCount,
        activeView,
    };
}
