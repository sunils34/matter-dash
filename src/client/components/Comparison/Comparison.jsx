 /* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import Select from 'react-select';
import MatterLoadingIndicator from '../LoadingIndicator';
import MatterHorizontalBarChart from '../Charts/MatterHorizontalBarChart/MatterHorizontalBarChart';
import { Row, Column } from '../Grid';
import * as comparisonActions from '../../redux/actions/comparison';
import './Comparison.css';

let ComparisonFilterHeader = ({ dispatch, selectedYear, selectedDepartment, yearFilters, departmentFilters }) => {

  const changeFilter = (d, filter, chosen) => {
    d(comparisonActions.changeFilter(filter, chosen.value));
  };
  const changeFilterDept = changeFilter.bind(this, dispatch, 'department');
  const changeFilterYear = changeFilter.bind(this, dispatch, 'year');

  return (
    <Row right>
      <Column className="small-3">
        <Select
          searchable={false}
          clearable={false}
          onChange={changeFilterDept}
          className="comparison-filter"
          name="Dashboard View"
          value={selectedDepartment}
          options={departmentFilters}
        />
      </Column>
      <Column className="small-2">
        <Select
          searchable={false}
          clearable={false}
          onChange={changeFilterYear}
          className="comparison-filter"
          name="Dashboard View"
          value={selectedYear}
          options={yearFilters}
        />
      </Column>
    </Row>
  )
}

ComparisonFilterHeader = connect(state => ({
  selectedDepartment: state.comparison.department,
  selectedYear: state.comparison.year,
  yearFilters: state.comparison.filters.years,
  departmentFilters: state.comparison.filters.departments,
}))(ComparisonFilterHeader);

let ComparisonSortHeader = ({ dispatch, measure, value, sortMeasure, sortValue, sortOrder, }) => {


  let c = 'sort-header align-bottom noselect';
  let sortArrow = 'keyboard_arrow_down';
  let newSortValue = 'desc';
  if (sortMeasure === measure && sortValue === value) {
    c += ' active';
    if (sortOrder === 'asc') {
      sortArrow = 'keyboard_arrow_up';
    } else {
      newSortValue = 'asc';
    }
  }

  // dispatch a sort event
  const onClick = () => { dispatch(comparisonActions.sort(measure, value, newSortValue)); };

  return (
    <div className={c} onClick={onClick}>
      <span>{value}</span>
      <i className="material-icons">{sortArrow}</i>
    </div>
  );
};

ComparisonSortHeader = connect(state => (
  {
    sortOrder: state.comparison.sortOrder,
    sortValue: state.comparison.sortValue,
    sortMeasure: state.comparison.sortMeasure,
  }
))(ComparisonSortHeader);


class Comparison extends React.Component {

  constructor(props) {
    super(props);
    this.sort = this.sort.bind(this);
  }

  componentWillReceiveProps(newProps) {
    // only if this has finished loading and we've obtained new data with different variables
    // will we update the data
    if ((this.props.data.loading && !newProps.data.loading) ||
        (!newProps.data.loading && !_.isEqual(this.props.data.variables, newProps.data.variables))
       ) {

      const filters = {
        departments: newProps.data.departmentFilters.results,
        years: newProps.data.yearFilters.results,
      };

      newProps.dispatch(comparisonActions.dataFetched(newProps.data.gender, newProps.data.ethnicity, filters));
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
          <Row className="header-row">
            <Column>
              <Row className="page-header">Employee breakdown of key tech companies</Row>
            </Column>
            <Column>
              <ComparisonFilterHeader />
            </Column>
          </Row>
          <Row>
            <Column className="comparison-data">
              <Row className="sort-header-row">
                <Column className="small-offset-1 small-2 align-self-bottom">
                  <Row>
                    <Column><Row bottom><ComparisonSortHeader measure="gender" value="Female" /></Row></Column>
                    <Column><Row right bottom><ComparisonSortHeader measure="gender" value="Male" /></Row></Column>
                  </Row>
                </Column>
                {
                  _.map(ethnicity.fields, field => (
                    <Column key={field.name} className="small-1 align-self-bottom">
                      <Row bottom>
                        <ComparisonSortHeader measure="ethnicity" value={field.name} />
                      </Row>
                    </Column>
                  ))
                }
              </Row>
              {
                _.map(comparisonData, dataPoint => (
                  <Row key={dataPoint.companyKey} middle>
                    <Column className="small-1">
                      <Row className="company-name">{dataPoint.companyName}</Row>
                    </Column>
                    <Column className="small-2">
                      <Row>
                        <MatterHorizontalBarChart stackedPercentage fields={gender.fields} data={[dataPoint]} yDataKey="companyKey" xDataKey="gender" height={50} />
                      </Row>
                    </Column>
                    {
                      _.map(ethnicity.fields, field => (
                        <Column key={`${dataPoint.companyKey}-${field.name}`} className="small-1 ethnicity">
                          <Row className="bar-container" center middle>
                            <MatterHorizontalBarChart complete includeZeroFields stackedPercentage fields={[field]} data={[dataPoint]} yDataKey="companyKey" xDataKey="ethnicity" height={50} />
                          </Row>
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
query comparison($department: String, $year: String) {
  gender: comparisonCompanies (department: $department, year: $year, measure: "gender")
  {
    results
    fields {
      name
      color
    }
  }
  ethnicity: comparisonCompanies (department: $department, year: $year, measure: "ethnicity")
  {
    results
    fields {
      name
      color
    }
  }
  yearFilters: comparisonFilters(type: "year")
  {
    results {
      label
      value
    }
  }
  departmentFilters: comparisonFilters(type: "department")
  {
    results {
      label
      value
    }
  }
}
`;

const mapStateToProps = state => (
  {
    department: state.comparison.department,
    year: state.comparison.year,
    gender: state.comparison.gender,
    ethnicity: state.comparison.ethnicity,
    comparisonData: state.comparison.displayData,
  }
);


export default
connect(mapStateToProps)(
  graphql(ComparisonQuery, {
    options: ({ department, year }) => {
      return { variables: { department, year } };
    },
  })(Comparison),
);
/* eslint-enable jsx-a11y/no-static-element-interactions */
