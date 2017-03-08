import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as reportActions from '../../redux/actions/reports';
import { connect } from 'react-redux';

class ReportsPageSaveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit() {
    this.props.mutate({ variables: { name: this.props.report.name, id: this.props.report.id, objects:this.props.report.objects } })
      .then(({ data }) => {
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
    return (<button onClick={this.submit}>Save</button>);
  }
}


const AddToReportMutation = gql`
mutation createOrupdateReport($id: String!, $name: String, $objects: [JSON]) {
  createOrUpdateReport(id:$id, name: $name, objects:$objects)
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
