import _ from 'lodash';
import {
  COMPARISON_DATA_FETCHED,
  COMPARISON_SORT,
  COMPARISON_CHANGE_FILTER,
} from '../actionTypes/comparison';


const initialState = {
  department: 'All',
  displayData: null,
  gender: null,
  filters: {
    years: null,
    departments: null,
  },
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

  nextState.displayData = _.orderBy(
    nextState.displayData,
    [`${measure}.${value}`],
    [order],
  );

  return nextState;
};

export default function comparison(state = initialState, action) {
  switch (action.type) {
    case COMPARISON_DATA_FETCHED: {
      const displayData = _.map(action.gender.results, (item) => {
        const ethnicityItem = _.find(action.ethnicity.results, { companyKey: item.companyKey });
        return {
          ...item,
          ethnicityRaw: ethnicityItem.ethnicityRaw,
          ethnicity: ethnicityItem.ethnicity,
        };
      });

      const nextState = {
        ...state,
        filters: action.filters,
        gender: action.gender,
        ethnicity: action.ethnicity,
        displayData,
      };

      return sortResults(nextState, nextState.sortMeasure, nextState.sortValue, nextState.sortOrder);
    }
    case COMPARISON_SORT: {
      return sortResults(state, action.measure, action.value, action.order);
    }
    case COMPARISON_CHANGE_FILTER: {
      const filter = {};
      filter[action.filter] = action.value;
      return _.extend({}, state, filter);
    }
    default:
      return state;
  }
}
