import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from '../middleware/promiseMiddleware';
import rootReducer from '../reducers';
import { reduxTimeout } from '../utils/timeout';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const finalCreateStore = composeEnhancers(
    applyMiddleware(thunk, promiseMiddleware, reduxTimeout()),
)(createStore);

export default function configureStore(initialState, apollo) {
    const store = finalCreateStore(rootReducer(apollo), initialState);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers');
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
