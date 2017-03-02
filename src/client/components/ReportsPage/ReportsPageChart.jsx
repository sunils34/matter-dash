import React from 'react';
import Select from 'react-select';
import './ReportsPageChart.css';
import { Row, Column } from '../Grid';

const ButtonAddToReport = ({ onClick, disabled }) => {

  let c = 'add-button';
  if (disabled) {
    c += ' disabled';
  }
  return (
    <Row right>
      <button className={c} onClick={onClick} >Add to Report</button>
    </Row>);
}

const UnselectedBody = () => (
  <Row middle center extraClass="empty-state large-12">
    <div>Add options to show visualization</div>
  </Row>
);

class ReportsPageChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { department: 'ENGINEERING', type: 'gender', timeframe: 'Monthly' };
  }
  render() {
    const { initData } = this.props;
    let body = <UnselectedBody />;

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
                  placeholder="Choose a Department"
                  name="select-departments"
                  clearable
                  value={this.state.department}
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
                  placeholder="Choose Measure"
                  name="select-type"
                  clearable
                  value={this.state.type}
                  options={initData.genders}
                />
              </Column>
            </Row>
          </Column>
          <Column>
            <Row><Column extraClass="description">Time</Column></Row>
            <Row>
              <Column>
                <Select
                  placeholder="Choose Time Scale"
                  name="select-timeframes"
                  clearable={false}
                  value={this.state.timeframe}
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
  gender: React.PropTypes.string,
};

export default ReportsPageChart;
