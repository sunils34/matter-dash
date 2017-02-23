import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar.jsx';
import OverviewSection from '../OverviewSection/OverviewSection.jsx';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class App extends React.Component {
  render() {
    if(this.props.userReq.loading || this.props.organizationReq.loading) {
      return null;
    }
    else {
      return (
        <div>
        <OverviewSection user={this.props.userReq.user} organization={this.props.organizationReq.organization}/>
        <HeaderBar />
        </div>
      );
    }
  }
} 

const CurrentUser = gql`query CurrentUser { user { id, name, email } }`;
const CurrentOrg = gql`query CurrentOrg { organization { name, employee_count, departments} }`;


export default compose(
  graphql(CurrentUser, { name: 'userReq' }),
  graphql(CurrentOrg, { name: 'organizationReq' }),
)(App)
