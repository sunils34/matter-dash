import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import OverviewSection from '../../components/OverviewSection/OverviewSection';

window.Period = 'All';
window.Department = 'All';


class App extends React.Component {
  render() {
    if (!this.props.children ||
        this.props.userReq.loading ||
        this.props.organizationReq.loading) {
      return null;
    }
    else {
      const user = this.props.userReq.user;
      const organization = this.props.organizationReq.organization;

      return (
        <div>
          <HeaderBar location={this.props.location}/>
          {React.cloneElement(this.props.children, { user, organization })}
        </div>
      );
    }
  }
} 

const CurrentUser = gql`query CurrentUser { user { id, name, email } }`;
const CurrentOrg = gql`query CurrentOrg { organization { name, employee_count, departments} }`;


export default compose(
  connect(
    // stateToProps
    (state) => ({ })),
  graphql(CurrentUser, { name: 'userReq' }),
  graphql(CurrentOrg, { name: 'organizationReq' }),
)(App)
