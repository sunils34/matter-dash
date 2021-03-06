 /* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import DocumentTitle from 'react-document-title';
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

  const yF = _.concat([{label:'Latest', value: 'latest'}], yearFilters);

  return (
    <Row right className="filter-row">
      <Column className="small-4 filter-col">
        <Row>
          <Select
            searchable={false}
            clearable={false}
            onChange={changeFilterDept}
            className="comparison-filter department"
            name="Department"
            value={selectedDepartment}
            options={departmentFilters}
          />
        </Row>
      </Column>
      <Column className="small-4 filter-col">
        <Row>
          <Select
            searchable={false}
            clearable={false}
            onChange={changeFilterYear}
            className="comparison-filter year"
            name="Year"
            value={selectedYear}
            options={yF}
          />
        </Row>
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

let ComparisonSortHeader = ({ dispatch, measure, value, sortMeasure, sortValue, sortOrder, textAsc, textDesc, inverse }) => {


  let c = 'sort-header align-bottom noselect';
  let sortArrow = 'keyboard_arrow_down';
  let text = value;

  if (textAsc && textDesc) {
    text = inverse ? textAsc : textDesc;
  }

  //set default sort order
  let newSortValue = inverse ? 'asc' : 'desc';

  if (sortMeasure === measure && (!value || sortValue === value)) {
    c += ' active';
    if (sortOrder === 'asc') {
      sortArrow = inverse ? 'keyboard_arrow_down' : 'keyboard_arrow_up';
      newSortValue = 'desc';
      if (textAsc) text = textAsc;
    } else {
      sortArrow = inverse ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
      newSortValue = 'asc';
      if (textDesc) text = textDesc;
    }
  }


  // dispatch a sort event
  const onClick = () => { dispatch(comparisonActions.sort(measure, value, newSortValue)); };

  return (
    <div className={c} onClick={onClick}>
      <span>{text}</span>
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

  render() {
    const { myOrgLogoUrl, data, comparisonData, gender, ethnicity, department, year } = this.props;
    if (!comparisonData) {
      return (
        <div className="container">
          <MatterLoadingIndicator />
        </div>
      );
    }


    return (
      <DocumentTitle title={`Comparison - ${department} ${year} | Matter`}>
        <Row className="comparison" center>
          <Column>
            <Row className="header-row">
              <Column>
                <Row className="page-header">Employee breakdown of key tech companies</Row>
              </Column>
              <Column>
                <ComparisonFilterHeader />
              </Column>
            </Row>
            <div className='line'></div>
            <Row center className="comparison-data">
              <Column>
                <Row>
                  <Column>
                    <Row className="sort-header-row" center>
                      <Column className="small-1">
                        <Row>
                          <ComparisonSortHeader measure="companyName" textAsc="A-Z" textDesc="Z-A" inverse/>
                        </Row>
                      </Column>
                      <Column className="bar-wrap gender align-self-bottom">
                        <Row>
                          <Column><Row bottom><ComparisonSortHeader measure="gender" value="Female" /></Row></Column>
                          <Column><Row center bottom><ComparisonSortHeader measure="gender" value="Other" /></Row></Column>
                          <Column><Row right bottom><ComparisonSortHeader measure="gender" value="Male" /></Row></Column>
                        </Row>
                      </Column>
                      {
                        _.map(ethnicity.fields, (field, idx) => (
                          <Column key={field.name} className="bar-wrap align-self-bottom">
                            <Row bottom>
                              <ComparisonSortHeader measure="ethnicity" value={field.name} />
                            </Row>
                          </Column>
                        ))
                      }
                    </Row>
                  </Column>
                </Row>
                <Row className="companies-wrap">
                  <Column>
                    {
                      _.map(comparisonData, (dataPoint) => {
                        let companyImgUrl = `/images/avatars/companies/${_.toLower(dataPoint.companyName)}_avatar.jpg`;

                        if (dataPoint.isMine) {
                          companyImgUrl = myOrgLogoUrl;
                        }

                        return (
                          <Row key={dataPoint.companyKey} className={dataPoint.isMine ? 'company-wrap mine' : 'company-wrap'} middle center>
                            <Column className="small-1">
                              <Row className="company-name" middle>
                                <Column className="small-1 img-col">
                                  <Row>
                                    <img
                                      className="img-circle"
                                      src={companyImgUrl}
                                      alt={dataPoint.companyName}
                                    />
                                  </Row>
                                </Column>
                                <Column>
                                  <Row>{dataPoint.companyName}</Row>
                                  <Row className="me">{dataPoint.isMine ? "(You)" : ""}</Row>
                                </Column>
                              </Row>
                            </Column>
                            <Column className="bar-wrap gender">
                              <Row>
                                <MatterHorizontalBarChart stackedPercentage fields={gender.fields} labelFill="#FFFFFF" data={[dataPoint]} yDataKey="companyKey" xDataKey="gender" height={50} />
                              </Row>
                            </Column>
                            {
                              _.map(ethnicity.fields, field => (
                                <Column key={`${dataPoint.companyKey}-${field.name}`} className="ethnicity bar-wrap">
                                  <Row className="bar-container" center middle>
                                    <MatterHorizontalBarChart complete includeZeroFields stackedPercentage fields={[field]} data={[dataPoint]} yDataKey="companyKey" xDataKey="ethnicity" height={50} />
                                  </Row>
                                </Column>
                              ))
                            }
                          </Row>
                      )})
                    }
                  </Column>
                </Row>
              </Column>
            </Row>
            <Row className="data-note" center middle>
              <Column>
                <p>Comparisons help you better understand where you’re at compared to other companies.</p>
                <p>Gender breakdown typically represents the world-wide workforce, whereas the ethnicity breakdown is typically US only.  We use public EEOC data in addition to data provided through company blog posts and diversity dashboards. Because we're reliant on self-reporting from individual companies, we unfortunately cannot guarantee accuracy 100%.  However we promise to keep the data as reliable and up-to-date as possible.</p>
                <p>Have a question? <a href='mailto:hello@matterapp.io'>get in touch!</a></p>
              </Column>
            </Row>
          </Column>
        </Row>
      </DocumentTitle>
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
    myOrgLogoUrl: state.app.organization.logoUrl,
  }
);


export default
connect(mapStateToProps)(
  graphql(ComparisonQuery, {
    options: ({ department, year }) => (
      { variables: { department, year } }
    ),
  })(Comparison),
);
/* eslint-enable jsx-a11y/no-static-element-interactions */
