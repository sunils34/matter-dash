import { Route, IndexRedirect, Redirect } from 'react-router';
import React from 'react';
import App from './containers/App/App';
import OverviewSection from './components/OverviewSection/OverviewSection';
import ReportsPage from './components/ReportsPage/ReportsPage';

function refreshBugsnag() {
  // Bugsnag.refresh()
}

const Routes = (
  <Route path="/" component={App} onChange={refreshBugsnag}>
    <IndexRedirect to="/dashboard" />
    <Route path="/dashboard" component={OverviewSection} />
    <Route path="/reports" component={ReportsPage} />
    <Route path="/reports/:id" component={ReportsPage} />
  </Route>
);

export default Routes;
