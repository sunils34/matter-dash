import React from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router';
import DropdownMenu from 'react-dd-menu';
import gql from 'graphql-tag';
import MatterLoadingIndicator from '../LoadingIndicator';
import { Row, Column } from '../Grid';
import './ReportsPageStart.css';
import '../../css/dropdown.css';
import dateformat from 'dateformat';


class _ReportPageListItemOptionsMenu extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.deleteReport = this.deleteReport.bind(this);
  }

  toggleMenu() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  closeMenu() {
    this.setState({ isMenuOpen: false });
  }

  deleteReport() {
    const refetch = this.props.refetch;
    const answer = confirm("Double Checking... Are you sure you want to delete this report?");
    if (answer) {
      this.props.mutate({ reportId: { reportId: this.props.reportId } })
        .then(({ data }) => {
          refetch();
        }).catch((error) => {
          console.log('there was an error sending the query', error);
        });
    }
  }

  render() {

    const menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.closeMenu.bind(this),
      align: 'right',
      toggle: <i className="material-icons" onClick={this.toggleMenu}>more_vert</i>
    };

    return (
      <div className="dd-wrap">
        <DropdownMenu {...menuOptions}>
          <div className='caret'></div>
          <li onClick={this.deleteReport}><i className="material-icons">cancel</i><span>Delete Report</span></li>
        </DropdownMenu>
      </div>
    );
  }
}

const DeleteReportMutation = gql`
mutation deleteReport($reportId: String!) {
  deleteReport(reportId: $reportId)
  {
    success,
    error
  }
}
`;

const ReportPageListItemOptionsMenu = graphql(DeleteReportMutation, {
  options: ({ reportId }) => {
    return { variables: { reportId }};
  },
})(_ReportPageListItemOptionsMenu);


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

    const { data, router } = this.props;
    const refetch = data.refetch;


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

    const reportList = _.map(reports, report => {
      const onClick = () => { router.push(`/report/${report.id}`); };
      return (
        <Row key={report.id} className="report-list-item">
          <Column onClick={onClick}><Row>{report.name}</Row></Column>
          <Column extraClass="large-1 medium-2 small-3">
            <Row>{dateformat(report.updatedAt, 'mmmm d, yyyy')}</Row>
          </Column>
          <Column extraClass="large-1 medium-1 small-1">
            <Row right>
              <ReportPageListItemOptionsMenu refetch={refetch} reportId={report.id} />
            </Row>
          </Column>
        </Row>
      );
    });

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
