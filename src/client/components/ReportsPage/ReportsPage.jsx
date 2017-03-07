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


const ReportsPageHeader = ({ report, isempty, organization }) => {
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
    const viewType = report.details && report.detals.viewType || 'stacked';

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
      <Column extraClass="reports-name">
        <span>{name}</span>
      </Column>
      {viewTypeSelect}
    </Row>
  );
};

const ReportsEmptyView = () => (
  <div className="column reports-empty">
    <div className="row align-center">
      <div className="visibility-off-icon" />
    </div>
    <div className="row align-center">
      <div className='empty-text'>You don't have any reports! Let's create a new graph in order to get started.</div>
    </div>
  </div>
);

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
    const { dialogIsOpen, data, report } = this.props;
    let isEmpty = !report || !report.objects || !report.objects.length;

    if (data.loading) {
      return null;
    }

    if (isEmpty) {
      body = <ReportsEmptyView />;
    }
    else {
      body = _.map(report.objects, (object) => {
        const { department, measure, timeframe } = object.details;
        const query = { department, measure, timeframe };
        const key = object.id;
        console.log(key);

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
        <ReportsPageHeader report={report} isempty={isEmpty} />
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
