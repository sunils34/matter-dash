import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import './ReportsPageChart.css';
import { Row, Column } from '../Grid';
import * as reportActions from '../../redux/actions/reports';
import MatterBarChart from '../Charts/MatterBarChart/MatterBarChart.jsx';

const ButtonAddToReport = ({ onClick, disabled }) => {

  let c = 'add-button';
  if (disabled) {
    c += ' disabled';
  }
  return (
    <Row right>
      <button className={c} onClick={onClick} >Add to Report</button>
    </Row>);
};

const UnselectedBody = () => (
  <Row middle center extraClass="empty-state large-12">
    <div>Add options to show visualization</div>
  </Row>
);

class ReportsPageChart extends React.Component {

  constructor(props) {
    super(props);
    this.handleChangeDepartment = this.handleChange.bind(this, 'department');
    this.handleChangeMeasure = this.handleChange.bind(this, 'measure');
    this.handleChangeChart = this.handleChange.bind(this, 'chart');
    this.handleChangeTimeframe = this.handleChange.bind(this, 'timeframe');
  }

  handleChange(type, chosenItem) {
    this.props.dispatch(reportActions.changeReport({ type, value: chosenItem.value }));
  }


  render() {
    const { initData, department, measure, timeframe } = this.props;

    let body = <UnselectedBody />;
    if (department && measure) {
      const query = { department, measure, timeframe };
      body = (<MatterBarChart height={345} legendAlign="right" query={query} />);
    }


    return (
      <Row extraClass="reports-page-chart">
        <Row extraClass="large-12 header header-row">
          <div className="filter-icon">
            <i className="material-icons">filter_list</i>
            <div>Filter</div>
          </div>
          <Column>
            <Row><Column extraClass="description">Department</Column></Row>
            <Row>
              <Column>
                <Select
                  onChange={this.handleChangeDepartment}
                  placeholder="Choose a Department"
                  name="select-departments"
                  clearable={false}
                  value={this.props.department}
                  options={initData.departments}
                />
              </Column>
            </Row>
          </Column>
          <Column>
            <Row><Column extraClass="description">Diversity Measure</Column></Row>
            <Row>
              <Column>
                <Select
                  onChange={this.handleChangeMeasure}
                  placeholder="Choose Measure"
                  name="select-type"
                  clearable={false}
                  value={this.props.measure}
                  options={initData.measures}
                />
              </Column>
            </Row>
          </Column>
          <Column>
            <Row><Column extraClass="description">Time</Column></Row>
            <Row>
              <Column>
                <Select
                  onChange={this.handleChangeTimeframe}
                  placeholder="Choose Time Scale"
                  name="select-timeframes"
                  clearable={false}
                  value={this.props.timeframe}
                  options={initData.timeframes}
                />
              </Column>
            </Row>
          </Column>
        </Row>
        <Column>
          {body}
          <ButtonAddToReport disabled/>
        </Column>
      </Row>
    );
  }
}


ReportsPageChart.propTypes = {
  initData: React.PropTypes.object,
  department: React.PropTypes.string,
  measure: React.PropTypes.string,
  chart: React.PropTypes.string,
  timeframe: React.PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    department: state.reports.department,
    measure: state.reports.measure,
    chart: state.reports.chart,
    timeframe: state.reports.timeframe,
  };
};

export default connect(mapStateToProps)(ReportsPageChart);
