import React from 'react';
import _ from 'lodash';
import './MatterChartLegend.css';


const MatterChartLegend = ({payload}) => {

  return (
    <div className="matter-chart-legend">
      <div className="legend-wrap">
        {
          _.map(payload, item => (
            <div key={item.value} className="item-wrap">
              <div className="circle" style={{ background: item.color }} />
              <div className="item-value">{item.value}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

MatterChartLegend.propTypes = {
  payload: React.PropTypes.array,
};

export default MatterChartLegend;
