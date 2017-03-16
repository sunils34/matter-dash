import {
  COMPARISON_DATA_FETCHED,
  COMPARISON_SORT,
} from '../actionTypes/comparison';

import _ from 'lodash';

const initialState = {
  department: 'All',
  data: null,
  gender: null,
  ethnicity: null,
  sort: 'name',
  order: 'desc',
  year: '2016',
};

const sortResults = (state, measure, value, order) => {
  const nextState = {
    ...state,
    order,
  };

  nextState.data = _.orderBy(
    nextState.data,
    [`${measure}.${value}`],
    [order],
  );

  return nextState;
};

export default function comparison(state = initialState, action) {
  switch (action.type) {
    case COMPARISON_DATA_FETCHED:
      return {
        ...state,
        gender: action.gender,
        ethnicity: action.ethnicity,
        data: _.map(action.gender.results, (item) => {
          const ethnicityItem = _.find(action.ethnicity.results, { companyKey: item.companyKey });
          return {
            ...item,
            ethnicityRaw: ethnicityItem.ethnicityRaw,
            ethnicity: ethnicityItem.ethnicity,
          };
        }),
      };
    case COMPARISON_SORT: {
      const order = state.order === 'desc' ? 'asc' : 'desc';
      return sortResults(state, action.measure, action.value, order);
    }
    default:
      return state;
  }
}
