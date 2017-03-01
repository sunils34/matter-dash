import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './CompanyPage.css';
import CompanyPageChart from './CompanyPageChart';

const CompanyPageHeader = ({ organization }) => {
  var aBasicItemModel = [
    {
      label: "View: Stacked",
      value: "1"
    },
    {
      label: "View: ",
      value: "2"
    }
  ];

  return (
    <div className="row">
      <div className="pull-left company-name">
        <span>My Company</span>
      </div>
      <div className="pull-right">
        <Select
        clearable={false}
        className="select-layout"
        name="dashboardLayout"
        value="1"
        options={aBasicItemModel}

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
      label
      value
    }
    genders {
      label,
      value
    }
    timeframes {
      label,
      value
    }
  }
}
`;

export default graphql(GetCompanyPageInit)(CompanyPage);
