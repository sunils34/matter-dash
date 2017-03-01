import React from 'react';

class CompanyPageChart extends React.Component {
  render() {
    const { initData } = this.props;
    console.log(initData);
    return (
      <div class='row company-page-chart'>
        <div class='row header'>
          <div>COMPANY PAGE CHART</div>
        </div>
      </div>
    );
  }
}

export default CompanyPageChart;
