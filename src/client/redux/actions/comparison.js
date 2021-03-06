import { EventTypes } from 'redux-segment';
import * as types from '../actionTypes/comparison';

export function dataFetched(gender, ethnicity, filters) {
  return {
    type: types.COMPARISON_DATA_FETCHED,
    gender,
    ethnicity,
    filters,
  };
}

export function sort(measure, value, order = 'desc') {
  return {
    type: types.COMPARISON_SORT,
    measure,
    value,
    order,
    meta: {
      analytics: {
        eventType: EventTypes.track,
        eventPayload: {
          properties: {
            measure,
            value,
            order,
          },
        },
      },
    },
  };
}

export function changeFilter(filter, value) {
  return {
    type: types.COMPARISON_CHANGE_FILTER,
    filter,
    value,
    meta: {
      analytics: {
        eventType: EventTypes.track,
        eventPayload: {
          properties: {
            filter,
            value,
          },
        },
      },
    },
  };
}
