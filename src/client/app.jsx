import './app.css';
import React from 'react'
import { render } from 'react-dom'
//import { Provider } from 'react-redux'
//import { createStore } from 'redux'
//import todoApp from './reducers'

//let store = createStore(todoApp)
//
import App from './components/App/App'

render(
  <App />,
  document.getElementById('react')
)
