import * as types from '../actionTypes/comparison';

export function dataFetched(gender, ethnicity) {
  return {
    type: types.COMPARISON_DATA_FETCHED,
    gender,
    ethnicity,
  };
}

export function sort(measure, value) {
  return {
    type: types.COMPARISON_SORT,
    measure,
    value,
  };
}
