import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import * as reportActions from '../../redux/actions/reports';
import { Row, Column } from '../Grid';
import './ReportsPageDialogs.css';
import '../../css/global-components.css';

class ReportsPageSaveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      reportName: props.report.name || 'New Report',
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.submit();
    }
  }

  handleNameChange(event) {
    this.setState({ reportName: event.target.value });
  }

  submit() {
    this.props.mutate({
      variables: {
        name: this.state.reportName,
        id: this.props.report.id,
        objects: this.props.report.objects,
        details: this.props.report.details || {},
      }
    }).then(({ data }) => {
        this.props.dispatch(reportActions.reportDialogToggle('save', false));
        if (this.props.report.id === 'new') {
          this.props.router.push(`/report/${data.createOrUpdateReport.id}`);
        } else {
          this.props.dispatch(reportActions.updateReport(data.createOrUpdateReport));
        }
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
  }
  render() {
    return (
      <div className="dialog-container">
        <Row middle extraClass="dialog-header">
          <i className="material-icons">content_paste</i>
          <span className="dialog-title">Save Report</span>
        </Row>
        <Row extraClass="dialog-body" middle>
          <Column>
            <Row center extraClass="dialog-description">Report Name</Row>
            <Row center extraClass="dialog-input">
              <input className="matter-component" autoFocus
                maxLength="100"
                type="text"
                value={this.state.reportName}
                onKeyPress={this.handleKeyPress}
                onChange={this.handleNameChange} 
              />
            </Row>
            <Row center><button className="btn-primary" onClick={this.submit}>Save Report</button></Row>
          </Column>
        </Row>
      </div>
    );
  }
}


const AddToReportMutation = gql`
mutation createOrupdateReport($id: String!, $details: JSON, $name: String, $objects: [JSON]) {
  createOrUpdateReport(id:$id, details: $details, name: $name, objects:$objects)
  {
    id,
    name,
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

const mapStateToProps = state => ({
  report: state.reports.report,
});

export default connect(mapStateToProps)(
  graphql(AddToReportMutation)(ReportsPageSaveDialog),
);
