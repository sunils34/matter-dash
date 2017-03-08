import React from 'react';
import './OverviewSection.css';
import MatterPieChart from '../Charts/MatterPieChart/MatterPieChart.jsx';
import MatterBarChart from '../Charts/MatterBarChart/MatterBarChart.jsx';
import * as appActions from '../../redux/actions/app';
import { connect } from 'react-redux';
import _ from 'lodash';

class OverviewSectionSubNav extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    //add classes
    var className = 'sub-nav';
    className += (this.props.active) ? " active" : "";
    className += (this.props.right) ? " pull-right" : " pull-left"

    return (
      <a
      href='#'
      onClick={(e) => { e.preventDefault(); return this.props.onClick(this.props.text)}}
      className={className}>{this.props.text}
      </a>
    )
  };
}

class OverviewSectionDepartments extends  React.Component {
  render() {
    var depts = ['All'].concat(this.props.departments);

    var dispatch = this.props.dispatch;
    const onDepartmentClick = (department) => {
      dispatch(appActions.changeDepartment(department));
    }

    return (
      <div className='col-md-7 department-subnav'>
      {depts.map( (dept) => {

        return (<OverviewSectionSubNav
                key={dept}
                text = {dept}
                active = {dept == this.props.currentDepartment}
                onClick={onDepartmentClick}
                  />);
      })}
      </div>
    );
  }
}

class OverviewSectionPeriod extends  React.Component {
  render() {
    const {dispatch} = this.props;
    var periods = ['Snapshot', 'Last Quarter', 'Last 6 Months', 'Last Year']
    periods = _.reverse(periods);

    const onPeriodClick = (period) => {
      dispatch(appActions.changePeriod(period));
    }

    return (
      <div className='period-subnav col-md-5'>
      {periods.map( (period) => {

        return (<OverviewSectionSubNav
                key={period}
                text = {period}
                right = {true}
                active = {period == this.props.currentPeriod}
                onClick={onPeriodClick}
                  />);
      })}
      </div>
    );
  }
}



OverviewSectionSubNav.propTypes = {
  text: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired
}


class OverviewSectionHeader extends React.Component {
  render() {
    return (
      <div className='row heading'>
        <div className='col-lg-12'>
          <div className='row sub-heading'>
          <div className='pull-left organization-name'>{this.props.organization.name}</div>
          <div className='row pull-right'>
                <div className='pull-right employee-total'>{this.props.organization.employee_count}</div>
                <div className='pull-right employee-total-description'>Employee total</div>
          </div>
          </div>
          <div className='row overview-subnav'>
              <OverviewSectionDepartments
                currentDepartment={this.props.department}
                dispatch={this.props.dispatch}
                departments={this.props.organization.departments}/>
              <OverviewSectionPeriod
                currentPeriod={this.props.period}
                dispatch={this.props.dispatch}/>
          </div>
        </div>
      </div>
    );
  }
}

OverviewSectionHeader.propTypes = {
  dispatch: React.PropTypes.func.isRequired
}



const data = [{name: 'Male', value: 70}, {name: 'Female', value: 10},
                    {name: 'Prefer not to disclose', value: 2}, {name: 'Non-Binary', value: 8}];

const ethData = [
  {name: 'White', value: 57},
  {name: 'Native American/Alaskan Native', value: 2},
  {name: 'Native Hawaiian/Pacific Islander', value: 2},
  {name: 'Hispanic', value: 8},
  {name: 'Black/African American', value: 9},
  {name: 'Asian', value: 18}
];

const OverviewChartsTitle = ({title, department, period}) => {

  if(!title) {
    //default title
    var periodStmt = 'Over the ' + period;
    if(period == 'Snapshot') {
      periodStmt = 'as of Today';
    }
    title = department + ' Employees ' + periodStmt;
  }

  return (
    <div className='row align-center'>
      <div className='overview-chart-title'>{title}</div>
    </div>
  )
}


const OverviewChartsSubTitle = ({ text }) => {

  return (
    <div className='row align-center'>
      <div className='overview-chart-subtitle'>{text}</div>
    </div>
  );
};


class OverviewChartsPie extends React.Component {

  render() {
    var query = {
      department: this.props.department,
      period: this.props.period,
    };

    const dispatch = this.props.dispatch;
    const onPieChartUpdate = (nextProps, nextState)  => {
      if(nextProps.data.piedatapoints) {
        let total = 0;
        nextProps.data.piedatapoints.results.forEach((point) => {
          total += point.value;
        });
        dispatch(appActions.changeEmployeesCount(total));
      }
    };


    return (
      <div className='overview-charts'>
        <OverviewChartsTitle department={this.props.department} period={this.props.period} />
        <OverviewChartsSubTitle text={`${this.props.employee_count} employees`} />
        <div className='row align-center'>
          <div className='large-5 columns'>
            <MatterPieChart
              componentWillUpdate={onPieChartUpdate}
              legendAlign='left' title="Gender" query={_.extend({}, query, {type: 'gender'})} />
          </div>
          <div className='large-5 columns'>
            <MatterPieChart legendAlign='right' title="Ethnicity" query={_.extend({}, query, {type: 'ethnicity'})}/>
          </div>
        </div>
      </div>
    )
  }
}

class OverviewChartsBar extends React.Component {


  render() {
    var query = {
      department: this.props.department
    };
    var dispatch = this.props.dispatch;

    const onPieChartUpdate = (nextProps, nextState)  => {
      if(nextProps.data.piedatapoints) {
        var total = 0;
        nextProps.data.piedatapoints.forEach((point) => {
          total += point.value;
        })
        dispatch(appActions.changeEmployeesCount(total));
      }
    }


    return (
      <div className='overview-charts'>
        <OverviewChartsTitle title={`${this.props.department} Employees Over Time`} />
        <OverviewChartsSubTitle text={`${this.props.employee_count} employees`} />
        <div className='row align-center'>
          <div className='large-5 columns'>
            <MatterBarChart
              type="stackedPercentage"
              componentWillUpdate={onPieChartUpdate}
              legendAlign='left' title="Gender" query={_.extend({}, query, {measure: 'gender'})} />
          </div>
          <div className='large-5 columns'>
            <MatterBarChart type="stackedPercentage" height={345} legendAlign='right' title="Ethnicity" query={_.extend({}, query, {measure: 'ethnicity'})}/>
          </div>
        </div>
      </div>
    )
  }
}

class OverviewSection extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      department: 'All',
      period: 'All'
    }
  }

  render () {
    return (
      <div className='container'>
        <div className='overview-section'>
          <OverviewChartsPie dispatch={this.props.dispatch}
            employee_count={this.props.employee_count}
            department={this.props.department}
            period={this.props.period} />
        </div>
        <div className='overview-section'>
          <OverviewChartsBar dispatch={this.props.dispatch}
            employee_count={this.props.employee_count}
            department={this.props.department}
            period={this.props.period} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    department: state.app.department,
    period: state.app.period,
    employee_count: state.app.employee_count
  }
}

export default connect(mapStateToProps)(OverviewSection);
