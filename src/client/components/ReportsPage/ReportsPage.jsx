import React from 'react';
import { graphql, compose } from 'react-apollo';
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
      <Column extraClass="reports-name">
        <span>{name}</span>
      </Column>
      {viewTypeSelect}
    </Row>
  );
};

const ReportsEmptyView = ({onClick}) => (
  <div className="container reports-empty">
    <button onClick={onClick} className="get-started-button row align-center">
      <div className="visibility-off-icon" />
      <div className='empty-text'>You don't have any reports! Let's create a new graph in order to get started.</div>
    </button>
  </div>
);

ReportsEmptyView.propTypes = {
  onClick: React.PropTypes.func.isRequired,
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
    this.state = {
      showNewModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onReportCreate = this.onReportCreate.bind(this);
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

  onReportCreate() {
    this.props.mutate({ variables: { name: 'New Report' } })
      .then(({ data }) => {
        this.props.router.push(`/report/${data.createReport.id}`);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
  }

  render() {
    let body = null;
    const { dialogIsOpen, data, report } = this.props;
    let isEmpty = !report || !report.objects;

    if (data.loading) {
      return null;
    }

    if (isEmpty) {
      return <ReportsEmptyView onClick={this.onReportCreate}/>;
    }
    else {
      body = _.map(report.objects, (object) => {
        const { department, measure, timeframe } = object.details;
        const query = { department, measure, timeframe };
        const key = object.id;

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

const CreateReportMutation = gql`
mutation createReport($name: String!) {
  createReport(name: $name)
  {
    id,
    name,
    createdAt,
    details,
    objects {
      id,
      orderNumber,
      type,
      details,
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

export default compose(
  connect(mapStateToProps),
  graphql(GetReportsPageInit, {
    options: ({ params }) => {
      return { variables: { id: params.id } };
    },
  }),
  graphql(CreateReportMutation),
)(ReportsPage);
