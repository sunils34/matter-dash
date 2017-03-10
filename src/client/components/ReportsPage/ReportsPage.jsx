import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Select from 'react-select';
import ReactModal from 'react-modal';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import DropdownMenu from 'react-dd-menu';
import 'react-select/dist/react-select.css';
import ReportsPageChart from './ReportsPageChart';
import ReportsPageSaveDialog from './ReportsPageSaveDialog';
import './ReportsPage.css';
import { Row, Column } from '../Grid';
import * as reportActions from '../../redux/actions/reports';
import MatterLoadingIndicator from '../LoadingIndicator';

import MatterBarChart from '../Charts/MatterBarChart/MatterBarChart';
import MatterPieChart from '../Charts/MatterPieChart/MatterPieChart';
import MatterLineChart from '../Charts/MatterLineChart/MatterLineChart';


const ReportsAddNewGraphButton = ({onNewClick}) => {

  return (
    <button onClick={onNewClick} className='row align-center reports-add'>
      <i>+</i><div>Add New Graph</div>
    </button>
  );
};


const ReportsPageHeader = ({ report, isempty, organization, children }) => {
  var viewTypeModel = [
    {
      label: "Stacked View",
      value: "stacked",
    },
    {
      label: "Grid View",
      value: "grid",
    }
  ];

  let name = 'New Report';
  let viewTypeSelect = null;
  if (report && report.name) {
    name = report.name;
    const viewType = report.details && report.details.viewType || 'stacked';

    viewTypeSelect = (
      <Column>
        <Row right>
          <Select
            clearable={false}
            className="select-layout"
            name="Dashboard View"
            value={viewType}
            options={viewTypeModel} />
        </Row>
      </Column>
    );
  }

  return (
    <Row extraClass="reports-page-header">
      <Column>
        <span className="reports-name">{name}</span>
        {children}
      </Column>
      {viewTypeSelect}
    </Row>
  );
};

const ReportChartTitle = ({ title, type, measure, department, timeframe }) => {
  let titleText = title;

  if (!titleText) {
    // default title
    let periodStmt = null;
    switch (type) {
      case 'bar':
      case 'line':
        if (_.lowerCase(timeframe) === 'monthly') {
          periodStmt = 'Month over Month';
        } else if (_.lowerCase(timeframe) === 'yearly') {
          periodStmt = 'Year over Year';
        }
        titleText = `${department} Growth by ${measure} ${periodStmt}`;
        break;
      case 'donut':
        titleText = `${measure} Breakdown in ${department}`;
        break;
      default:
        titleText = '';
    }
  }

  return (
    <div className="report-chart-title">{titleText}</div>
  );
};

ReportChartTitle.defaultProps = {
  type: null,
  title: null,
  measure: null,
  department: null,
  timeframe: null,
};

ReportChartTitle.propTypes = {
  title: React.PropTypes.string,
  type: React.PropTypes.string,
  measure: React.PropTypes.string,
  department: React.PropTypes.string,
  timeframe: React.PropTypes.string,
};

class ReportChartMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
    this.toggle = this.toggle.bind(this);
    this.deleteModule = this.deleteModule.bind(this);
    this.modifyModule = this.modifyModule.bind(this);
  }

  toggle() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  close() {
    this.setState({ isMenuOpen: false });
  }

  deleteModule() {
    const answer = confirm("Double Checking... Are you sure you want to delete this?");
    if (answer) {
      this.props.dispatch(reportActions.deleteObject(this.props.objectIdx));
    }
    this.setState({ isMenuOpen: false });
  }

  modifyModule() {
    this.props.dispatch(reportActions.modifyObjectDialogOpen(this.props.objectIdx));
    this.setState({ isMenuOpen: false });
  }

  render() {
    const menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close.bind(this),
      align: 'right',
      toggle: <i className="noselect settings material-icons" onClick={this.toggle}>settings</i>,
    };

    return (
      <DropdownMenu {...menuOptions}>
        <div className='caret'></div>
        <li onClick={this.modifyModule}><i className="material-icons">filter_list</i><span>Modify Module</span></li>
        <li onClick={this.deleteModule}><i className="material-icons">delete</i><span>Delete Module</span></li>
      </DropdownMenu>
    );
  }
}



class ReportsPage extends React.Component {

  constructor(props) {
    super(props);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.saveModalToggle = this.saveModalToggle.bind(this);
    this.openSaveModal = this.saveModalToggle.bind(this, true);
    this.resetReport = this.resetReport.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.loading && !newProps.loading) {
      this.props.dispatch(reportActions.dataFetched(newProps.reportsPageInit));
    }
  }

  shouldComponentUpdate(nextProps) {
    // TODO for some reason, the report is rerendering even though props are the same
    return !_.isEqual(this.props, nextProps);
  }

  handleOpenModal() {
    //dispatch
    this.props.dispatch(reportActions.reportDialogToggle('addobject', true));
  }

  handleCloseModal() {
    // dispatch
    this.props.dispatch(reportActions.reportDialogToggle('addobject', false));
  }

  saveModalToggle(state, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    this.props.dispatch(reportActions.reportDialogToggle('save', state));
    return false;
  }

  resetReport(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    this.props.dispatch(reportActions.resetReport());
  }


  render() {
    let body = null;
    const { loading, unsaved, dialogIsOpen, data, report, dispatch } = this.props;
    let isEmpty = !report || !report.objects;

    if (loading) {
      return (
        <div className="container">
          <MatterLoadingIndicator />
        </div>
      );
    }

    if (isEmpty) {
      return null;
    } else {
      body = _.map(report.objects, (object, idx) => {
        // don't render locally deleted objects
        if (object.deleted) return null;
        const { department, measure, timeframe } = object.details;
        const query = { department, measure, timeframe };
        const key = object.id || idx;

        let objectElt = null;

        switch (object.type) {
          case 'line':
            objectElt = (
              <MatterLineChart
                animationDuration={0}
                height={400}
                query={query}
              />);
            break;
          case 'bar':
            objectElt = (
              <MatterBarChart
                animationDuration={0}
                type="stackedPercentage"
                height={400}
                query={query}
              />);
            break;
          case 'donut':
          case 'pie':
            objectElt = (
              <MatterPieChart
                legendAlign="right"
                legendType="small"
                showTotal
                animationDuration={0}
                height={400}
                query={query}
              />);
            break;
          default:
            return null;
        }

        return (
          <Row key={key} extraClass="report-object-wrap">
            <Column>
              <Row center extraClass="report-title-wrap">
                <ReportChartTitle
                  type={object.type}
                  department={department}
                  measure={measure}
                  timeframe={timeframe}
                />
                <ReportChartMenu dispatch={dispatch} objectIdx={idx} />
              </Row>
              <Row center>
                {objectElt}
              </Row>
            </Column>
          </Row>);
      });
    }

    return (
      <div className="container reports-page">
        <ReportsPageHeader report={report} isempty={isEmpty}>
          <a href="#" onClick={this.openSaveModal} className="reports-options">Save</a>
          <Link to="/report/new" className="reports-options">New</Link>
          <a href="#" className="reports-options">Open</a>
          <a href="#" onClick={this.resetReport} className="reports-options">Reset</a>
        </ReportsPageHeader>
        {body}
        <ReportsAddNewGraphButton onNewClick={this.handleOpenModal} />
        <ReactModal
          isOpen={dialogIsOpen}
          contentLabel="Add New Graph"
          onRequestClose={this.handleCloseModal}
          shouldCloseOnOverlayClick
          role="dialog"
          className="new-report-modal"
        >
          <ReportsPageChart />
        </ReactModal>
        <ReactModal
          isOpen={this.props.saveDialogIsOpen}
          contentLabel="Add New Graph"
          onRequestClose={() => { this.saveModalToggle(false); }}
          shouldCloseOnOverlayClick
          role="dialog"
          className="save-modal"
        >
          <ReportsPageSaveDialog router={this.props.router} dispatch={this.props.dispatch} />
        </ReactModal>
      </div>
    );
  }
}

ReportsPage.propTypes = {
  unsaved: React.PropTypes.bool.isRequired,
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
        orderNumber,
        type,
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
    unsaved: state.reports.unsaved,
    dialogIsOpen: state.reports.dialogOpenStates.addobject,
    saveDialogIsOpen: state.reports.dialogOpenStates.save,
    report: state.reports.report,
  }
);

export default
connect(mapStateToProps)(
  graphql(GetReportsPageInit, {
    options: ({ params }) => {
      return { variables: { id: params.id }, forceFetch: true };
    },
    props: ({ data: { loading, reportsPageInit } }) => ({
      loading,
      reportsPageInit,
    }),
  })(ReportsPage),
);
