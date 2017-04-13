import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createTracker } from 'redux-segment';
import rootReducer from '../reducers/index';
import promiseMiddleware from '../middleware/promiseMiddleware';
import { reduxTimeout } from '../utils/timeout';

const tracker = createTracker();

const finalCreateStore = compose(
    applyMiddleware(thunk, promiseMiddleware, tracker, reduxTimeout()),
)(createStore);

export default function configureStore(initialState, apollo) {
  return finalCreateStore(rootReducer(apollo), initialState);
};
