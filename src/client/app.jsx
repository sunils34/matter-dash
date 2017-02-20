import './app.css';
import React from 'react';
import { render } from 'react-dom';
//import { Provider } from 'react-redux'
//import { createStore } from 'redux'
//import todoApp from './reducers'

//let store = createStore(todoApp)
//
import App from './components/App/App';

const data = {
  company_name: 'XO Group2',
  total_employees: 400
};

render(
  <App data={data} />,
  document.getElementById('react')
)
