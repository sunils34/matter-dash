import React from 'react';
import './OverviewSection.css';
import MatterPieChart from '../Charts/MatterPieChart/MatterPieChart.jsx';

const OverviewSectionSubNav =  ({title, active}) => {

  var className = 'sub-nav';
  if(active) {
    className += ' active';
  }
  return (
    <div className={className}>{title}</div>
  );
};


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
              <div className='large-text company-name'>{this.props.data.company_name}</div>
            </div>
            <div className='col-md-1 pull-right'>
              <div className='large-text employee-total'>{this.props.data.total_employees}</div>
            </div>
            <div className='col-md-1 pull-right'>
              <div className='total-description'>Employee Total</div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-8'>
              <OverviewSectionSubNav title='All Employees' active={true}/>
              <OverviewSectionSubNav title='Leadership'/>
              <OverviewSectionSubNav title='Tech'/>
              <OverviewSectionSubNav title='Non-Tech'/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class OverviewCharts extends React.Component {

  render() {
    return (
      <div className='row'>
        <div className='col-lg-6'>
          <MatterPieChart />
        </div>
        <div className='col-lg-6'>

        </div>
      </div>
    );
  }

}



class OverviewSection extends React.Component {

  render () {
    return (
      <div className='container overview-section'>
        <OverviewSectionHeader data={this.props.data}/>
        <OverviewCharts />
      </div>
    )
  }
}

module.exports = OverviewSection;
