import { EventTypes } from 'redux-segment';
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

export function setUser(user, organization) {
  return {
    type: types.SET_USER,
    user,
    organization,
    meta: {
      analytics: [
        {
          eventType: EventTypes.identify,
          eventPayload: {
            userId: `${organization.id}:${user.id}`,
            traits: {
              name: user.name,
              email: user.email,
            },
          },
        },
        {
          eventType: EventTypes.group,
          eventPayload: {
            groupId: organization.name,
            traits: {
              name: organization.name,
            },
          },
        },
      ],
    },
  };
}
