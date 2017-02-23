import './app.css';
import React from 'react';
import { render } from 'react-dom';
import ApolloClient , { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

//import { Provider } from 'react-redux'
//import { createStore } from 'redux'
//import todoApp from './reducers'

//let store = createStore(todoApp)
//
import App from './components/App/App';

//TODO ADD CSRF TOKEN
const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
    headers: {
      'X-CSRF-Token': "xyz",
      token: 'supersecret'
    }
  }
});
const client = new ApolloClient({networkInterface: networkInterface});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider> ,
  document.getElementById('react')
)
