import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Select from 'react-select';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';
import ReportsPageChart from './ReportsPageChart';
import { openReportDialog, closeReportDialog } from '../../redux/actions/reports';
import './ReportsPage.css';
import * as reportActions from '../../redux/actions/reports';


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

  componentWillReceiveProps(newProps) {
    if (this.props.data.loading && !newProps.data.loading) {
      this.props.dispatch(reportActions.dataFetched(newProps.data.reportsPageInit));
    }
  }

  handleOpenModal() {
    //dispatch
    this.props.dispatch(openReportDialog());
  }

  handleCloseModal() {
    //dispatch
    this.props.dispatch(closeReportDialog());
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
          isOpen={this.props.dialogIsOpen}
          contentLabel="Add New Graph"
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick
          role="dialog"
          className="new-report-modal"
        >
          <ReportsPageChart />
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
query GetReportsPageInit($id: String){
  reportsPageInit(id: $id) {
    report {
      id,
      name,
      objects {
        id,
        details
      }
    },
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

const mapStateToProps = state => (
  {
    dialogIsOpen: state.reports.dialog.open,
    report: state.reports.report,
    measures: state.reports.measures,
    departments: state.reports.departments,
    timeframes: state.reports.timeframes,
  }
);

export default connect(mapStateToProps)(graphql(GetReportsPageInit, {
  options: ({ params }) => {
    return { variables: { id: params.id } };
  },
})(ReportsPage));
