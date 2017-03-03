import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Select from 'react-select';
import ReactModal from 'react-modal';
import { push } from 'react-router-redux';
import 'react-select/dist/react-select.css';
import ReportsPageChart from './ReportsPageChart';
import './ReportsPage.css';


const ReportsAddNewGraphButton = ({onNewClick}) => {

  return (
    <button onClick={onNewClick} className='row align-center reports-add'>
      <i>+</i><div>Add New Graph</div>
    </button>
  );
};


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

const ReportsEmptyView = ({onNewClick}) => {
  return (
    <div className="column reports-empty">
      <div className="row align-center">
        <div className="visibility-off-icon"></div>
      </div>
      <div className="row align-center">
        <div className='empty-text'>You don't have any reports! Let's create a new graph in order to get started.</div>
      </div>
      <ReportsAddNewGraphButton onNewClick={onNewClick} />
    </div>
  );
};


class ReportsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showNewModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showNewModal: true });
  }

  handleCloseModal() {
    this.setState({ showNewModal: false });
  }

  render() {
    let body = null;
    let isEmpty = true;

    if (!this.props.data.loading) {
      isEmpty = true;
      body = <ReportsEmptyView onNewClick={this.handleOpenModal} />;
    }

    return (
      <div className="container reports-page">
        <ReportsPageHeader isempty={isEmpty} organization={this.props.organization} />
        {body}
        <ReactModal
          isOpen={this.state.showNewModal}
          contentLabel="Add New Graph"
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick
          role="dialog"
          className="new-report-modal"
        >
          <ReportsPageChart
            initData={this.props.data.reportsPageInit}
            />
        </ReactModal>
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
    measures {
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
