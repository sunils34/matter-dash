import React from 'react';

class CompanyPage extends React.Component {
  render() {
    return (<div>{this.props.organization.name}</div>);
  }
}

export default CompanyPage;
