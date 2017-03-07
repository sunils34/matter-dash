import React from 'react';
import './ReportsPageStart.css';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import gql from 'graphql-tag';

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
    return (
      <div className="container reports-empty">
        <button onClick={this.onReportCreate} className="get-started-button row align-center">
          <div className="visibility-off-icon" />
          <div className='empty-text'>You don't have any reports! Let's create a new graph in order to get started.</div>
        </button>
      </div>);
  }
};

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


const mapStateToProps = state => (
  {
  }
);


export default connect(mapStateToProps)(
  graphql(CreateReportMutation)(ReportsPageStart),
);
