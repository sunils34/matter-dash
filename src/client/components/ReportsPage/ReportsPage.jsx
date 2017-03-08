import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Select from 'react-select';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import 'react-select/dist/react-select.css';
import ReportsPageChart from './ReportsPageChart';
import ReportsPageSaveDialog from './ReportsPageSaveDialog';
import './ReportsPage.css';
import { Row, Column } from '../Grid';
import * as reportActions from '../../redux/actions/reports';

import MatterBarChart from '../Charts/MatterBarChart/MatterBarChart';
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

const ReportChartTitle = ({title, measure, department, timeframe}) => {

  if(!title) {
    //default title
    let periodStmt = null;
    if(_.lowerCase(timeframe) === 'monthly') {
      periodStmt = 'Month over Month';
    }
    else if(_.lowerCase(timeframe) === 'yearly') {
      periodStmt = 'Year over Year';
    }
    title = `${department} Change by ${measure} ${periodStmt}`;
  }

  return (
    <Row center>
      <div className='report-chart-title'>{title}</div>
    </Row>
  )
}

ReportChartTitle.defaultProps = {
  title: null,
  measure: null,
  department: null,
  timeframe: null,
};

ReportChartTitle.propTypes = {
  title: React.PropTypes.string,
  measure : React.PropTypes.string,
  department: React.PropTypes.string,
  timeframe: React.PropTypes.string,
};



class ReportsPage extends React.Component {

  constructor(props) {
    super(props);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.saveModalToggle = this.saveModalToggle.bind(this);
    this.openSaveModal = this.saveModalToggle.bind(this, true);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.data.loading && !newProps.data.loading) {
      this.props.dispatch(reportActions.dataFetched(newProps.data.reportsPageInit));
    }
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


  render() {
    let body = null;
    const { unsaved, dialogIsOpen, data, report } = this.props;
    let isEmpty = !report || !report.objects;

    if (data.loading) {
      return null;
    }

    if (isEmpty) {
      return null;
    }
    else {
      body = _.map(report.objects, (object, idx) => {
        const { department, measure, timeframe } = object.details;
        const query = { department, measure, timeframe };
        const key = object.id || idx;

        const title = (
          <ReportChartTitle
            department={department}
            measure={measure}
            timeframe={timeframe}
          />);

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
              {title}
              <Row>
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
          <a href="#" className="reports-options">Reset</a>
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
    measures: state.reports.measures,
    departments: state.reports.departments,
    timeframes: state.reports.timeframes,
  }
);

export default
connect(mapStateToProps)(
  graphql(GetReportsPageInit, {
    options: ({ params }) => {
      return { variables: { id: params.id } , forceFetch: true };
    },
  })(ReportsPage),
);
