import _ from 'lodash';
import {
  COMPARISON_DATA_FETCHED,
  COMPARISON_SORT,
} from '../actionTypes/comparison';


const initialState = {
  department: 'All',
  data: null,
  gender: null,
  ethnicity: null,
  sortMeasure: 'name',
  sortValue: null,
  sortOrder: 'desc',
  year: '2016',
};

const sortResults = (state, measure, value, order) => {
  const nextState = {
    ...state,
    sortMeasure: measure,
    sortOrder: order,
    sortValue: value,
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
      return sortResults(state, action.measure, action.value, action.order);
    }
    default:
      return state;
  }
}
