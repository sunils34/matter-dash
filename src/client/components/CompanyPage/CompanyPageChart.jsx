import React from 'react';
import Select from 'react-select';
import './CompanyPageChart.css';

class CompanyPageChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {department: props.department, gender: props.gender, timeframe: 'Monthly'};
  }
  render() {
    const { initData } = this.props;
    return (
      <div className='row company-page-chart'>
        <div className="header">
          <div className="filter-icon pull-left">
            <i className="material-icons">filter_list</i>
            <div>Filter</div>
          </div>
          <div className="col-lg-3">
            <Select
              placeholder="Choose a Department"
              name="select-departments"
              clearable={true}
              value={this.state.department}
              options={initData.departments}
            />
          </div>
          <div className="col-lg-3">
            <Select
              placeholder="Choose a Gender"
              name="select-genders"
              clearable={true}
              value={this.state.gender}
              options={initData.genders}
            />
          </div>
          <div className="col-lg-2">
            <Select
              name="select-timeframes"
              clearable={false}
              value={this.state.timeframe}
              options={initData.timeframes}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyPageChart;
