import React from 'react';
import './OverviewSection.css';
import MatterPieChart from '../Charts/MatterPieChart/MatterPieChart.jsx';
import * as appActions from '../../redux/actions/app';
import { connect } from 'react-redux';

class OverviewSectionSubNav extends React.Component {
  constructor(props) {
    super(props);
  }
  onDepartmentClick(department) {
    this.props.dispatch(appActions.changeDepartment(department));
  }

  render() {
    var className = 'sub-nav';
    if(this.props.active) {
      className += ' active';
    }
    return (
      <a
      href='#'
      onClick={() => this.onDepartmentClick(this.props.text)}
      className={className}>{this.props.text}
      </a>
    )
  };
}

const OverviewSectionDepartments =  ({departments, currentDepartment, dispatch}) => {

  var depts = ['All'].concat(departments);

  return (
    <div className='col-md-8'>
      {depts.map( (dept) => {

        return (<OverviewSectionSubNav
                key={dept}
                text = {dept}
                active = {dept == currentDepartment}
                dispatch={dispatch}
                  />);
      })}
    </div>
  );
};


OverviewSectionSubNav.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  text: React.PropTypes.string.isRequired
}


class OverviewSectionHeader extends React.Component {
  render() {
    return (
      <div className='row'>
        <div className='col-lg-1'>
          <div className='company-logo'>CL</div>
        </div>
        <div className='col-lg-11'>
          <div className='row sub-heading'>
            <div className='col-md-5'>
              <div className='large-text company-name'>{this.props.organization.name}</div>
            </div>
            <div className='col-md-1 pull-right'>
              <div className='large-text employee-total'>{this.props.employee_count}</div>
            </div>
            <div className='col-md-1 pull-right'>
              <div className='total-description'>Employee Total</div>
            </div>
          </div>
          <div className='row'>
              <OverviewSectionDepartments currentDepartment={this.props.department} dispatch={this.props.dispatch} departments={this.props.organization.departments}/>
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

class OverviewCharts extends React.Component {


  render() {
    var query = {
      department: this.props.department,
      period: this.props.period,
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
      <div className='row'>
        <div className='col-lg-6'>
          <MatterPieChart
            componentWillUpdate={onPieChartUpdate}
            legendAlign='left' title="Gender" query={_.extend({}, query, {type: 'gender'})} />
        </div>
        <div className='col-lg-6'>
          <MatterPieChart legendAlign='right' title="Ethnicity" query={_.extend({}, query, {type: 'ethnicity'})}/>
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
      <div className='container overview-section'>
        <OverviewSectionHeader
          dispatch={this.props.dispatch}
          user={this.props.user}
          organization={this.props.organization}
          department={this.props.department}
          period={this.props.period}
          employee_count={this.props.employee_count}
            />
        <OverviewCharts dispatch={this.props.dispatch} department={this.props.department} period={this.props.period} />
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
