import React from 'react';
import { render } from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import './app.css';
import store from './redux/store/store';

import App from './components/App/App';

const reduxStore = store({});

// TODO ADD CSRF TOKEN
const nInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
    headers: {
      'X-CSRF-Token': 'xyz',
      token: 'supersecret',
    },
  },
});

const client = new ApolloClient({
  networkInterface: nInterface,
});

render(
  <ApolloProvider client={client} store={reduxStore}>
    <App />
  </ApolloProvider>,
  document.getElementById('react'),
);
