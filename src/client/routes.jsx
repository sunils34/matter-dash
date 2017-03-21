import { Route, IndexRedirect, Redirect } from 'react-router';
import React from 'react';
import App from './containers/App/App';
import OverviewSection from './components/OverviewSection/OverviewSection';
import ReportsPage from './components/ReportsPage/ReportsPage';
import ReportsPageStart from './components/ReportsPage/ReportsPageStart';

import Comparison from './components/Comparison/Comparison';

function refreshBugsnag() {
  // Bugsnag.refresh()
}

const Routes = (
  <Route path="/" component={App} onChange={refreshBugsnag}>
    <IndexRedirect to="/dashboard" />
    <Route path="/dashboard" component={OverviewSection} />
    <Route path="/reports" component={ReportsPageStart} />
    <Route path="/report/:id" component={ReportsPage} />
    <Route path="/comparison" component={Comparison} />
  </Route>
);

export default Routes;
