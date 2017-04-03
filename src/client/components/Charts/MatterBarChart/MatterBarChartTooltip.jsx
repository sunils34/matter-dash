import React from 'react';
import _ from 'lodash';
import './MatterBarChartTooltip.css';

const MatterBarChartTooltipLabel = ({item, prevItem, total, small}) => {
  const prevItemTotal = prevItem[item.name] || 0;
  const itemTotal = item.value || 0;
  const representationPercent = _.round((item.value / total) * 100) || 0;

  const changeDescription = getChangeDescription(
    itemTotal,
    prevItemTotal,
    prevItem.name);

  return (
    <div key={item.name} className="label-wrap">
      <div className="col-circle">
        <div className="circle" style={{ background: item.stroke }} />
      </div>
      <div className="col-text">
        <div className="top-item">{itemTotal}&nbsp;{item.name}&nbsp;<span>({changeDescription.raw})</span>
        </div>
        {!small &&
          <div className="change-description">{changeDescription.percentage}</div>
        }
      </div>
    </div>
  );
};

MatterBarChartTooltipLabel.defaultProps = {
  small: false,
};

MatterBarChartTooltipLabel.propTypes = {
  small: React.PropTypes.bool,
};

const MatterBarChartTooltip = (props) => {
  const { payload, data, label, unit } = props;

  if (!payload.length) {
    return null;
  }

  const idx = _.findIndex(data, { name: label });
  let body = null;

  if (!idx) {
    return null;
  }

  const rPayload = _.orderBy(_.map(_.cloneDeep(payload), item => (
    {
      ...item,
      value: item.value || 0,
    }
  )),
  ['value', 'name'], ['asc', 'asc']);

  return (
    <div className="barchart-tooltip">
      <div className="title">{label}</div>
      {
        _.map(rPayload, item => (
          <div key={item.name}>
            <div className="label-wrap">
              <div className="circle-wrap">
                <div className="circle" style={{ background: item.fill }} />
              </div>
              <div className="value" style={{ color: item.fill }}><span>{item.value}{item.unit}</span></div>
              <div className="label">{item.name}</div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

MatterBarChartTooltip.propTypes = {
};

export default MatterBarChartTooltip;
