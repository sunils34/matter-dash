import React from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router';
import gql from 'graphql-tag';
import MatterLoadingIndicator from '../LoadingIndicator';
import { Row, Column } from '../Grid';
import './ReportsPageStart.css';
import dateformat from 'dateformat';

class ReportsPageStart extends React.Component {

  constructor(props) {
    super(props);
    this.onReportCreate = this.onReportCreate.bind(this);
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
    if(this.props.data.loading) {
      return (
        <div className="container">
          <MatterLoadingIndicator />
        </div>
      );
    }

    const reports = this.props.data.reports.results;

    const getStartedButton = (
      <div className="container reports-empty-container">
        <Link to="/report/new" className="get-started-button row align-center">
          <div className="visibility-off-icon" />
          <div className='empty-text'>You don't have any reports! Let's create a new graph in order to get started.</div>
        </Link>
      </div>
    );

    if (!reports.length) {
      return getStartedButton;
    }

    const reportList = _.map(reports, report => (
      <Link key={report.id} className="row report-list-item" to={`/report/${report.id}`}>
        <Column><Row>{report.name}</Row></Column>
        <Column extraClass="large-1 medium-2 small-3">
          <Row>{dateformat(report.updatedAt, 'mmmm d, yyyy')}</Row>
        </Column>
        <Column extraClass="large-1 medium-1 small-1">
          <Row right>
            <i className="material-icons">more_vert</i>
          </Row>
        </Column>
      </Link>
    ));

    return (
      <div className="container reports-empty-container">
        <Row extraClass="report-list-container">
          <Column>
            <Row extraClass="reports-list-header">
              <Column><Row>Recent Reports</Row></Column>
              <Column extraClass="large-1 medium-2 small-3"><Row>Last Modified</Row></Column>
              <Column extraClass="large-1 medium-1 small-1">
                <Row right>
                  <i className="material-icons">list</i>
                </Row>
              </Column>
            </Row>
            <Row extraClass="report-list">
              <Column>
                {reportList}
              </Column>
            </Row>
          </Column>
        </Row>
        {getStartedButton}
      </div>);
  }
}

ReportsPageStart.propTypes = {
};

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

const GetReports = gql`
query reports($sort: String) {
  reports (sort: $sort) {
    results {
      id,
      name
      details
      updatedAt
      createdAt
    }
  }
}`;


const mapStateToProps = state => (
  {
    sort: state.reports.start.sort,
  }
);


export default compose(
  connect(mapStateToProps),
  graphql(CreateReportMutation),
  graphql(GetReports, {
    options: ({ sort }) => {
      return { variables: { sort }, forceFetch: true };
    },
  }),
)(ReportsPageStart);
