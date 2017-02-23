import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/index';
import thunk from 'redux-thunk';
import promiseMiddleware from '../middleware/promiseMiddleware';
import { reduxTimeout } from '../../utils/timeout';

const finalCreateStore = compose(
    applyMiddleware(thunk, promiseMiddleware, reduxTimeout())
)(createStore);

export default function configureStore(initialState) {
    return finalCreateStore(rootReducer, initialState);
};
