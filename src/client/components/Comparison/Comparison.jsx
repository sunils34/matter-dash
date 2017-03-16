import React from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import MatterLoadingIndicator from '../LoadingIndicator';
import MatterHorizontalBarChart from '../Charts/MatterHorizontalBarChart/MatterHorizontalBarChart';
import { Row, Column } from '../Grid';
import * as comparisonActions from '../../redux/actions/comparison';
import './Comparison.css';


class Comparison extends React.Component {

  constructor(props) {
    super(props);
    this.sort = this.sort.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.data.loading && !newProps.data.loading) {
      newProps.dispatch(comparisonActions.dataFetched(newProps.data.gender, newProps.data.ethnicity));
    }
  }

  sort() {
    this.props.dispatch(comparisonActions.sort('gender', 'Female'));
  }

  render() {
    const { data, comparisonData, gender, ethnicity, department } = this.props;
    if (!comparisonData) {
       return (
         <div className="container">
          <MatterLoadingIndicator />
        </div>
      );
    }


    return (
      <Row className="comparison">
        <Column>
          <Row onClick={this.sort}>Sort</Row>
          <Row>
            <Column className="comparison-data">
            {
              _.map(comparisonData, dataPoint => (
                <Row key={dataPoint.companyKey} middle>
                  <Column className="small-1">
                    <div className="company-name">{dataPoint.companyName}</div>
                  </Column>
                  <Column className="small-2 ethnicity">
                      <MatterHorizontalBarChart stackedPercentage fields={gender.fields} data={[dataPoint]} yDataKey="companyKey" xDataKey="gender" height={50} />
                  </Column>
                  {
                    _.map(ethnicity.fields, field => (
                      <Column key={`${dataPoint.companyKey}-${field.name}`} className="small-1 ethnicity">
                      <div className="bar-container">
                        <MatterHorizontalBarChart complete stackedPercentage fields={[field]} data={[dataPoint]} yDataKey="companyKey" xDataKey="ethnicity" height={50} />
                        </div>
                      </Column>
                    ))
                  }
                </Row>
              ))
            }
              </Column>
            </Row>
        </Column>
      </Row>
    );
  }

}

const ComparisonQuery = gql`
query comparison($department: String) {
  gender: comparison (department: $department, measure: "gender")
  {
    results
    fields {
      name
      color
    }
  }
  ethnicity: comparison (department: $department, measure: "ethnicity")
  {
    results
    fields {
      name
      color
    }
  }
}
`;

const mapStateToProps = state => (
  {
    department: state.comparison.department,
    gender: state.comparison.gender,
    ethnicity: state.comparison.ethnicity,
    comparisonData: state.comparison.data,
  }
);


export default
connect(mapStateToProps)(
  graphql(ComparisonQuery, {
    options: ({ department }) => {
      return { variables: { department } };
    },
  })(Comparison),
);
