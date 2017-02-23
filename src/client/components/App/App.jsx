import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar.jsx';
import OverviewSection from '../OverviewSection/OverviewSection.jsx';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class App extends React.Component {
  render() {
    if(this.props.data.loading) {
      return null;
    }
    else {
      return (
        <div>
        <OverviewSection data={this.props.data.me}/>
        <HeaderBar />
        </div>
      );
    }
  }
} 

const Query = gql`query CurrentUser { me { name, company_name, company_total_employees } }`;

module.exports = graphql(Query)(App);
