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
  sortMeasure: 'companyName',
  sortValue: null,
  sortOrder: 'asc',
  year: 'latest',
};

// TODO clean this up as it's a mess and hard to follow.
// Essentially this handles the logic for sorting based on various
// states of the display data
const sortResults = (state, measure, value, order) => {
  const nextState = {
    ...state,
    sortMeasure: measure,
    sortOrder: order,
    sortValue: value,
  };

  let data = _.filter(nextState.displayData, item => item[measure]);

  let sortField = measure;
  // if a field doesn't exist in the data, assume it's at 0%
  if (measure === 'ethnicity' || measure === 'gender') {
    data = _.map(
      data,
      item => ({
        ...item,
        [measure]: {
          ...item[measure],
          [value]: item[measure][value] || 0, // default to 0 if the element isn't included
        },
      }));
    sortField = `${measure}.${value}`;
  }
  debugger;

  nextState.displayData = _.concat(
    _.orderBy(data, [sortField], [order]),
    _.filter(nextState.displayData, item => !item[measure]),
  );

  return nextState;
};

export default function comparison(state = initialState, action) {
  switch (action.type) {
    case COMPARISON_DATA_FETCHED: {
      const displayData = _.map(action.gender.results, (item) => {
        const ethnicityItem = _.find(
          action.ethnicity.results,
          { companyKey: item.companyKey },
        ) || {};
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

      return sortResults(
        nextState,
        nextState.sortMeasure,
        nextState.sortValue,
        nextState.sortOrder,
      );
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
