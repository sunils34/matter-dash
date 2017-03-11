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

export function setOrganization(organization) {
  return {
    type: types.SET_ORGANIZATION,
    user,
  }
}

export function setUser(user, organization) {
  return {
    type: types.SET_USER,
    user,
    organization,
  }
}
