import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import * as appActions from '../../redux/actions/app';

window.Period = 'All';
window.Department = 'All';


class App extends React.Component {

  componentWillReceiveProps(newProps) {

    if(this.props.loading && !newProps.loading) {
      this.props.dispatch(appActions.setUser(newProps.user, newProps.organization));
    }
  }

  render() {
    console.log(this.props);
    if (!this.props.children ||
        this.props.loading) {
      return null;
    }

    const user = this.props.user;
    const organization = this.props.organization;

    return (
      <div>
        <HeaderBar location={this.props.location}/>
        {React.cloneElement(this.props.children, { user, organization })}
      </div>
    );
  }
};

const CurrentUserAndOrganization = gql`
query query {
  user {
    id,
    email
    name,
  }
  organization {
    id,
    departments,
    employee_count,
    name,
    updatedAt,
  }
}`;

export default compose(
  connect(
    // stateToProps
    (state) => ({ })),
  graphql(CurrentUserAndOrganization, {
    props: ({ data: { loading, user, organization } }) => ({
      loading,
      user,
      organization
    }),
  }),
)(App);
