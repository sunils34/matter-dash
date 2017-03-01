import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './ReportsPage.css';
import ReportsPageChart from './ReportsPageChart';

const ReportsPageHeader = ({ isempty, organization }) => {
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
  let name = null;
  if(isempty)  {
    name = "New Report";
  }

  return (
    <div className="row">
      <div className="pull-left reports-name">
        <span>{name}</span>
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

const ReportsEmptyView = () => {
  return (
    <div className="row reports-page-chart empty">
      <div className='center-block'>
        <span>You don't have any reports! Let's create a new graph in order to get started.</span>
      </div>
    </div>
  );
};


class ReportsPage extends React.Component {
  render() {
    let body = null;
    let isEmpty = true;
    if (!this.props.data.loading) {
      isEmpty = true;
      body = <ReportsEmptyView />
    }

    return (
      <div className="container reports-page">
        <ReportsPageHeader isempty={isEmpty} organization={this.props.organization} />
        {body}
      </div>
    );
  }
}

ReportsPage.propTypes = {
  data: React.PropTypes.object,
  user: React.PropTypes.object,
  organization: React.PropTypes.object,
};


const GetReportsPageInit = gql`
query GetReportsPageInit{
  reportsPageInit {
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

export default graphql(GetReportsPageInit)(ReportsPage);
