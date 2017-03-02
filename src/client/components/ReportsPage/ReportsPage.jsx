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
  let viewTypeSelect = null;
  if(!isempty)  {
    //TODO get real name
    name = "New Report";
    viewTypeSelect = (
      <div className="column large-2 right-align">
        <Select
        clearable={false}
        className="select-layout"
        name="dashboardLayout"
        value="1"
        options={aBasicItemModel} />
      </div>
    );
  }
  else {
    name = "New Report";
    viewTypeSelect = null;
  }

  return (
    <div className="row reports-page-header">
      <div className="reports-name column large-2">
        <span>{name}</span>
      </div>
      {viewTypeSelect}
    </div>
  );
};

const ReportsEmptyView = () => {
  return (
    <div className="column reports-empty">
      <div className="row align-center">
        <div className="visibility-off-icon"></div>
      </div>
      <div className="row align-center">
        <div className='empty-text'>You don't have any reports! Let's create a new graph in order to get started.</div>
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
