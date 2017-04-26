import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import * as appActions from '../../redux/actions/app';
import './App.css';

window.Period = 'All';
window.Department = 'All';

let ImpersonationHeader = ({impersonating, name, email}) => {
  if (!impersonating) return null;

  return (
    <div className="impersonation-header">
      <div>You're Impersonating <b>{name}</b> <b>({email})</b></div>
      <a href="/admin/sudo/logout" className="impersonation-stop">Stop Impersonating</a>
    </div>
  );
}

ImpersonationHeader = connect(state => (
  {
    impersonating: state.app.user.impersonating,
    email: state.app.user.email,
    name: state.app.user.name,
  }
))(ImpersonationHeader);



class App extends React.Component {
  componentWillReceiveProps(newProps) {
    if (this.props.loading && !newProps.loading) {
      this.props.dispatch(appActions.setUser(newProps.me, newProps.organization));
    }
  }

  render() {
    if (!this.props.children ||
        this.props.loading) {
      return null;
    }

    const user = this.props.me;
    const organization = this.props.organization;

    return (
      <div>
        <ImpersonationHeader />
        <HeaderBar location={this.props.location}/>
        {React.cloneElement(this.props.children, { user, organization })}
      </div>
    );
  }
}

const CurrentUserAndOrganization = gql`
query query {
  me {
    id,
    email
    name,
    impersonating,
  }
  organization {
    id,
    name,
    users {
      id
    }
  }
}`;

export default compose(
  connect(
    // stateToProps
    (state) => ({ })),
  graphql(CurrentUserAndOrganization, {
    props: ({ data: { loading, me, organization } }) => ({
      loading,
      me,
      organization,
    }),
  }),
)(App);
