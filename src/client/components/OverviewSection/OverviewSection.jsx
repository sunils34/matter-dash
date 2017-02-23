import React from 'react';
import './OverviewSection.css';
import MatterPieChart from '../Charts/MatterPieChart/MatterPieChart.jsx';

window.Period = 'All';
window.Department = 'All';

const onDepartmentClick = (department) => {
  console.log('clicked');
  window.Department = department;
}

const OverviewSectionSubNav =  ({text, active}) => {

  var className = 'sub-nav';
  if(active) {
    className += ' active';
  }
  return (
    <a
    href='#'
    onClick={() => onDepartmentClick(text)}
    className={className}>{text}
    </a>
  );
};

const OverviewSectionDepartments =  ({departments}) => {

  var depts = ['All'].concat(departments);

  return (
    <div className='col-md-8'>
      {depts.map( (dept) => {

        return (<OverviewSectionSubNav
                key={dept}
                text = {dept}
                active = {dept == Department}
                  />);
      })};
    </div>
  );
};


OverviewSectionSubNav.propTypes = {
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
              <div className='large-text employee-total'>{this.props.organization.employee_count}</div>
            </div>
            <div className='col-md-1 pull-right'>
              <div className='total-description'>Employee Total</div>
            </div>
          </div>
          <div className='row'>
              <OverviewSectionDepartments departments={this.props.organization.departments}/>
          </div>
        </div>
      </div>
    );
  }
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
      department: window.Department,
      period: window.Period,
    };
    return (
      <div className='row'>
        <div className='col-lg-6'>
          <MatterPieChart legendAlign='left' title="Gender" query={_.extend({}, query, {type: 'gender'})} />
        </div>
        <div className='col-lg-6'>
          <MatterPieChart legendAlign='right' title="Ethnicity" query={_.extend({}, query, {type: 'ethnicity'})}/>
        </div>
      </div>
    );
  }

}



class OverviewSection extends React.Component {

  render () {
    return (
      <div className='container overview-section'>
        <OverviewSectionHeader user={this.props.user} organization={this.props.organization}/>
        <OverviewCharts />
      </div>
    )
  }
}

module.exports = OverviewSection;
