import React from 'react'
import { render } from 'react-dom'
//import { Provider } from 'react-redux'
//import { createStore } from 'redux'
//import todoApp from './reducers'

//let store = createStore(todoApp)
//
import Hello from './views/Partials/AppHeader'

render(
  <Hello />,
  document.getElementById('react')
)
