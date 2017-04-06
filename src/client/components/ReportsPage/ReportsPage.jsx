import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Select from 'react-select';
import ReactModal from 'react-modal';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import DropdownMenu from 'react-dd-menu';
import ReactTooltip from 'react-tooltip';
import DocumentTitle from 'react-document-title';
import '../../css/select.css';
import '../../css/dropdown.css';
import ReportsPageAddChartDialog from './ReportsPageAddChartDialog';
import ReportsPageSaveDialog from './ReportsPageSaveDialog';
import './ReportsPage.css';
import { Row, Column } from '../Grid';
import * as reportActions from '../../redux/actions/reports';
import MatterLoadingIndicator from '../LoadingIndicator';

import MatterBarChart from '../Charts/MatterBarChart/MatterBarChart';
import MatterPieChart from '../Charts/MatterPieChart/MatterPieChart';
import MatterLineChart from '../Charts/MatterLineChart/MatterLineChart';


const ReportsAddNewGraphButton = ({ onNewClick, unsaved }) => {

  let c = 'reports-add';
  if (unsaved) c += ' unsaved';

  return (
    <div onClick={onNewClick} className={c}>
      <div className="tip">
        <div className="caret downward" />
        <span>New Graph</span></div>
      <span>+</span>
    </div>
  );
};


const ReportsPageHeader = ({ report, isempty, organization, children, dispatch }) => {

  const onChange = (chosenItem) => {
    dispatch(reportActions.switchReportViewType(chosenItem.value));
  };

  const viewTypeModel = [
    {
      label: 'Stacked View',
      value: 'stacked',
    },
    {
      label: 'Grid View',
      value: 'grid',
    },
  ];

  let name = 'New Report';
  let viewTypeSelect = null;
  if (report && report.name) {
    name = report.name;
    let viewType = 'grid';
    if (report.details && report.details.viewType && report.details.viewType === 'stacked') {
      viewType = 'stacked';
    }

    viewTypeSelect = (
      <Column className="hide-for-small-only">
        <Row right>
          <Select
            searchable={false}
            onChange={onChange}
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

const ReportChartTitle = ({ title, type, measure, department, timeframe, focus }) => {
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
        titleText = `${department} ${focus || 'Overall'} by ${measure} ${periodStmt}`;
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
  focus: null,
  timeframe: null,
};

ReportChartTitle.propTypes = {
  title: React.PropTypes.string,
  type: React.PropTypes.string,
  measure: React.PropTypes.string,
  department: React.PropTypes.string,
  focus: React.PropTypes.string,
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

class _ReportsPageSaveFooter extends React.Component {

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  save() {
    this.props.dispatch(reportActions.reportDialogToggle('save', true));
  }

  render() {
    const { isUnsaved, reportName } = this.props;
    let title = reportName;
    if (isUnsaved) title = '* ' + title;
    title += ' | Matter';

    if (!this.props.isUnsaved) {
      return (
        <DocumentTitle title={title} />
      );
    }

    return (
      <DocumentTitle title={title}>
        <Row middle className="report-save-footer">
          <Column><span /></Column>
          <Column><Row center> Unsaved changes to '{this.props.reportName}' </Row></Column>
          <Column><Row right><button onClick={this.save} className="btn-primary">Save Changes</button></Row></Column>
        </Row>
      </DocumentTitle>
    );
  }
}

_ReportsPageSaveFooter.propTypes = {
  reportName: React.PropTypes.string.isRequired,
  isUnsaved: React.PropTypes.bool.isRequired,
};

const ReportsPageSaveFooter = connect(state => ({
  reportName: state.reports.report.name,
  isUnsaved: state.reports.unsaved,
}))(_ReportsPageSaveFooter);


let ReportsAddNewGraphContainer = ({ dispatch, unsaved, dialogIsOpen }) => {
  const handleOpenModal = () => {
    dispatch(reportActions.reportDialogToggle('addobject', true));
  };

  const handleCloseModal = () => {
    dispatch(reportActions.reportDialogToggle('addobject', false));
  };

  return (
    <div>
      <ReportsAddNewGraphButton onNewClick={handleOpenModal} unsaved={unsaved} />
      <ReactModal
        isOpen={dialogIsOpen}
        contentLabel="Add New Graph"
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick
        role="dialog"
        className="new-report-modal"
      >
        <ReportsPageAddChartDialog />
      </ReactModal>
    </div>
  );
};


ReportsAddNewGraphContainer.propTypes = {
  unsaved: React.PropTypes.bool.isRequired,
  dialogIsOpen: React.PropTypes.bool.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

ReportsAddNewGraphContainer = connect(state => ({
  unsaved: state.reports.unsaved,
  dialogIsOpen: state.reports.dialogOpenStates.addobject,
}))(ReportsAddNewGraphContainer);


let ReportsSaveReportDialogContainer = ({ dispatch, dialogIsOpen, router }) => {
  const saveModalToggle = (state, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    dispatch(reportActions.reportDialogToggle('save', state));
    return false;
  }
  const openSaveModal = saveModalToggle.bind(this, true);
  return (
    <ReactModal
      isOpen={dialogIsOpen}
      contentLabel="Add New Graph"
      onRequestClose={() => { saveModalToggle(false); }}
      shouldCloseOnOverlayClick
      role="dialog"
      className="save-modal"
    >
      <ReportsPageSaveDialog router={router} dispatch={dispatch} />
    </ReactModal>
  )
}

ReportsSaveReportDialogContainer.propTypes = {
  dialogIsOpen: React.PropTypes.bool.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  router: React.PropTypes.object.isRequired,
}

ReportsSaveReportDialogContainer = connect(state => ({
  dialogIsOpen: state.reports.dialogOpenStates.save,
}))(ReportsSaveReportDialogContainer)


class ReportsPage extends React.Component {

  constructor(props) {
    super(props);
    this.resetReport = this.resetReport.bind(this);
    this.openSaveModal = this.openSaveModal.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.loading && !newProps.loading) {
      this.props.dispatch(reportActions.dataFetched(newProps.reportsPageInit));
    }
  }


  resetReport(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    this.props.dispatch(reportActions.resetReport());
  }

  openSaveModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    this.props.dispatch(reportActions.reportDialogToggle('save', true));
    return false;
  }

  render() {
    let body = null;
    const { loading, data, report, dispatch } = this.props;
    let isEmpty = !report || !report.objects;

    let containerClass = 'report-object large-6 medium-12 small-12';
    let pieWidth = 200;
    let pieHeight = 400;

    if (report && report.details && report.details.viewType === 'stacked') {
      pieWidth = 360;
      pieHeight = 400;
      containerClass = 'report-object large-12 medium-12 small-12';
    }

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
        const { department, measure, timeframe, focus } = object.details;
        const query = { department, measure, timeframe, focus };
        const key = object.id || idx;

        let objectElt = null;

        switch (object.type) {
          case 'line':
            objectElt = (
              <MatterLineChart
                height={400}
                query={query}
              />);
            break;
          case 'bar':
            objectElt = (
              <MatterBarChart
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
                height={pieHeight}
                width={pieWidth}
                query={query}
              />);
            break;
          default:
            return null;
        }

        return (
          <div key={key} className={containerClass}>
            <div className="align-center align-middle report-object-wrap">
              <Column extraClass="large-12">
                <Row center extraClass="dd-wrap report-title-wrap">
                  <ReportChartTitle
                    type={object.type}
                    department={department}
                    focus={focus}
                    measure={measure}
                    timeframe={timeframe}
                  />
                  <ReportChartMenu dispatch={dispatch} objectIdx={idx} />
                </Row>
                <Row center>
                  {objectElt}
                </Row>
              </Column>
            </div>
          </div>
        );
      });
    }

    return (
        <div className="container reports-page">
          <ReportsPageHeader report={report} isempty={isEmpty} dispatch={dispatch}>
            <a href="#" onClick={this.openSaveModal} className="reports-options">Save</a>
            <Link to="/report/new" className="reports-options">New Report</Link>
            <Link to="/reports" className="reports-options">Open</Link>
            <a href="#" onClick={this.resetReport} className="reports-options">Reset</a>
          </ReportsPageHeader>
          <Row className='report-objects'>
            {body}
          </Row>
          <ReportsAddNewGraphContainer />
          <ReportsSaveReportDialogContainer router={this.props.router} />
          <ReportsPageSaveFooter />
          <ReactTooltip />
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
      details,
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
    focuses {
      label,
      value
    }
  }
}
`;


const mapStateToProps = state => (
  {
    report: state.reports.report,
  }
);

export default
connect(mapStateToProps)(
  graphql(GetReportsPageInit, {
    options: ({ params }) => (
      { variables: { id: params.id }, fetchPolicy: 'network-only' }
    ),
    props: ({ data: { loading, reportsPageInit } }) => ({
      loading,
      reportsPageInit,
    }),
  })(ReportsPage),
);
