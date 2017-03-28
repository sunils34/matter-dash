import React from 'react';
import _ from 'lodash';
import { Row, Column } from '../Grid';
import './MatterChartTooltip.css';

const MatterChartTooltip = (props) => {
  const { payload, data, label } = props;

  if (!payload.length) {
    return null;
  }

  const idx = _.findIndex(data, { name: label });
  let body = null;
  if (idx > 0) {
    const rPayload = _.reverse(_.cloneDeep(payload));
    const firstElements = rPayload.splice(0, 2);

    body = (
      <div>
        <div className="name">{label} Hires</div>
        <div>
          {
            _.map(firstElements, (item) => {
              // obtain the previous ts object to share relative change
              const prevItem = data[idx - 1];
              const prevItemValue = data[idx - 1][item.name];
              const value = item.value - prevItem[item.name];

              let changeDescription = 'No change';
              if (value !== 0) {
                changeDescription = _.round((value / prevItemValue) * 100, 1);
                changeDescription += value >= 0 ? '% increase' : '% decrease';
              }
              changeDescription += ` from ${prevItem.name}`;

              return (
                <div key={item.name} className="top-item-wrap">
                  <div className="col-circle">
                    <div className="circle" style={{ background: item.stroke }} />
                  </div>
                  <div className="col-text">
                    <div className="top-item">{value}&nbsp;{item.name}</div>
                    <div className="change-description">{changeDescription}</div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  } else {
    body = null;
  }

  return (
    <div className="chart-tooltip">
      <div className="chart">
        {body}
      </div>
    </div>
  );
};

MatterChartTooltip.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default MatterChartTooltip;
