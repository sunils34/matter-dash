import React from 'react';
import { render } from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { browserHistory, Router } from 'react-router';
import store from './redux/store/store';
import Routes from './routes';
import './app.css';
import './css/foundation.css';


// TODO ADD CSRF TOKEN
const nInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    credentials: 'same-origin',
    headers: {
      'X-CSRF-Token': window.CSRF_TOKEN,
      token: 'supersecret',
    },
  },
});

const client = new ApolloClient({
  networkInterface: nInterface,
});

const reduxStore = store({}, client);

render(
  <ApolloProvider client={client} store={reduxStore}>
    <Router children={Routes} history={browserHistory} />
  </ApolloProvider>,
  document.getElementById('react'),
);
