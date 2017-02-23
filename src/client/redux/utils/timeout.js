const ADD_TIMEOUT = '@@reduxTimeout/ADD_TIMEOUT'
const REMOVE_TIMEOUT = '@@reduxTimeout/REMOVE_TIMEOUT'
const WATCH_ALL = '@@reduxTimeout/WATCH_ALL'

const addTimeout = (timeout, action, toCall) => {
    return {
        type: ADD_TIMEOUT,
        payload: {
            timeout,
            action,
            toCall
        }
    }
}

const removeTimeout = (action) => {
    return {
        type: REMOVE_TIMEOUT,
        payload: {
            action
        }
    }
}

/**
 * dispatches an action if an action has not been dispatched within the specified threshold
 * @param  {Number} threshold The time in ms to allow before dispatching an action
 * @param {String | [String]} action The action, or array of actions, to monitor
 * @param {Function} toCall An action creator, lib agnostic (redux-thunk, redux-promise etc.)
 */
const reduxTimeout = () => {
    let watch = {}

    return store => next => action => {
        const update = (action) => {
            // check if object is being monitored at the moment
            let monitor = watch[action]

            if (monitor) {
                clearTimeout(monitor.timeoutId)
                monitor.timeoutId = setTimeout(monitor.toCall, monitor.timeout)
            }
        }

        const add = ({ timeout, action, toCall }) => {
            if (typeof timeout !== 'number') {
                return new Error('Expected timeout to be a number')
            }
            if (typeof action !== 'string' && !(action instanceof Array)) {
                return new Error('Expected action to be a string or an array')
            }
            if (typeof toCall !== 'object' && typeof toCall !== 'function') {
                return new Error('Expected toCall to be an object or a function that would return an object')
            }

            // ensures all objects are watching the same object
            const monitor = {
                timeout,
                toCall
            }

            monitor.timeoutId = setTimeout(monitor.toCall, monitor.timeout)

            const addAction = (action) => {
                if (typeof action !== 'string') {
                    return new Error('Expected action to be a string')
                }
                watch[action] = monitor
            }

            if (action instanceof Array) {
                action.forEach((a) => {
                    addAction(a)
                })
            } else {
                addAction(action)
            }
        }

        const remove = (action) => {
            let monitor = watch[action]
            if (monitor) {
                clearTimeout(monitor.timeoutId)
                delete watch[action]
            }
        }

        if (action.type === REMOVE_TIMEOUT && action.payload.action) {
            if (action.payload.action instanceof Array) {
                action.payload.action.forEach((a) => {
                    remove(a)
                })
            } else {
                remove(action.payload.action)
            }
        }

        if (action.type === ADD_TIMEOUT && action.payload.action) {
            let { payload } = action
            add(action.payload)
        }

        update(action.type)
        update(WATCH_ALL)

        return next(action)
    }
}

module.exports = {
    reduxTimeout,
    addTimeout,
    removeTimeout,
    WATCH_ALL
}
