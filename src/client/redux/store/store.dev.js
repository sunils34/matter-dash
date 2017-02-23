import {createStore, applyMiddleware, compose} from 'redux';
import promiseMiddleware from '../middleware/promiseMiddleware';
import DevTools from '../../containers/devTools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { reduxTimeout } from '../utils/timeout';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const finalCreateStore = composeEnhancers(
    applyMiddleware(thunk, promiseMiddleware, reduxTimeout())
)(createStore);

export default function configureStore(initialState) {
    const store = finalCreateStore(rootReducer, initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
