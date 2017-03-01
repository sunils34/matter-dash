import React from 'react';
import Dropdown from 'react-bootstrap-dropdown';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import './CompanyPage.css';
import CompanyPageChart from './CompanyPageChart'

const CompanyPageHeader = ({ organization }) => {
  var aBasicItemModel = [
    {
      text: "View: Stacked",
      value: "1"
    },
    {
      text: "View: ",
      value: "2"
    }
  ];

  return (
    <div className="row">
      <div className="pull-left company-name">
        <span>{organization.name}</span>
      </div>
      <div className="pull-right">
        <Dropdown
        title="MyDropdown"
        items={aBasicItemModel}
          />
      </div>
    </div>
  );
};


class CompanyPage extends React.Component {
  render() {

    let body = null;
    if (!this.props.data.loading) {
      body = (<CompanyPageChart initData={this.props.data.companyPageInit} />);
    }

    return (
      <div className="container company-page">
        <CompanyPageHeader organization={this.props.organization} />
        {body}
      </div>
    );
  }
}

CompanyPage.propTypes = {
  data: React.PropTypes.object,
  user: React.PropTypes.object,
  organization: React.PropTypes.object,
};


const GetCompanyPageInit = gql`
query GetCompanyPageInit{
  companyPageInit {
    departments {
      name
      value
    }
    genders {
      name,
      value
    }
    ethnicities {
      name,
      value
    }
  }
}
`;

export default graphql(GetCompanyPageInit)(CompanyPage);
