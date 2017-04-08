import React from 'react';
import _ from 'lodash';
import './MatterChartLegend.css';


const MatterChartLegend = ({ payload }) => (
  <div className="matter-chart-legend">
    <div className="legend-wrap">
      {
        _.map(_.filter(payload, item => (!item.payload.hiddenPoint)),
          item => (
            <div key={item.payload.name || item.value} className="item-wrap">
              <div className="circle" style={{ background: item.color }} />
              <div className="item-value">{item.value}</div>
            </div>
          )
        )
      }
    </div>
  </div>
);

MatterChartLegend.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  payload: React.PropTypes.array.isRequired,
   /* eslint-enable react/forbid-prop-types */
};

export default MatterChartLegend;
