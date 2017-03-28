import React from 'react';
import _ from 'lodash';
import './MatterChartTooltip.css';

const getChangeDescription = (total, prevTotal, from) => {
  const change = total - prevTotal;
  let changeDescription = 'No change';
  if (change !== 0) {
    changeDescription = _.round((change / prevTotal) * 100, 0);
    changeDescription += change >= 0 ? '% increase' : '% decrease';
  }
  changeDescription += ` from ${from}`;
  return changeDescription;
};

const MatterChartTooltipLabel = ({item, prevItem, total, small}) => {
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
        <div className="top-item">{itemTotal - prevItemTotal}&nbsp;{item.name}&nbsp;({representationPercent}%)</div>
        {!small &&
          <div className="change-description">{changeDescription}</div>
        }
      </div>
    </div>
  );
};

MatterChartTooltipLabel.defaultProps = {
  small: false,
};

MatterChartTooltipLabel.propTypes = {
  small: React.PropTypes.bool,
};

const MatterChartTooltip = (props) => {
  const { payload, data, label } = props;

  if (!payload.length) {
    return null;
  }

  const idx = _.findIndex(data, { name: label });
  let body = null;

  if (!idx) {
    return null;
  }

  const rPayload = _.reverse(_.cloneDeep(payload));

  // total number of employees for this snapshot
  let total = 0;
  _.each(rPayload, (item) => {
    total += item.value || 0;
  });

  const firstElements = rPayload.splice(0, 2);

  let otherTotal = 0;
  let prevOtherTotal = 0;
  _.each(rPayload, (item) => {
    otherTotal += item.value || 0;
    prevOtherTotal += data[idx - 1][item.name] || 0;
  });
  const otherRepresentationPercent = _.round((otherTotal / total) * 100);

  const otherChangeDescription = getChangeDescription(
    otherTotal,
    prevOtherTotal,
    data[idx - 1].name);

  body = (
    <div>
      <div className="name">{label} Hires</div>
      <div>
        {
          _.map(firstElements, item => (
            // obtain the previous ts object to share relative change
            <MatterChartTooltipLabel key={item.name} item={item} prevItem={data[idx - 1]} total={total} />
          ))
        }
        <div className="label-wrap other">
          <div className="col-circle">
            <div className="circle" />
          </div>
          <div className="col-text">
            <div className="top-item">{otherTotal - prevOtherTotal}&nbsp;Other ({otherRepresentationPercent}%)</div>
            <div className="change-description">{otherChangeDescription}</div>
          </div>
        </div>
        <div className="other-wrap">
        {
          _.map(rPayload, item => (
            <MatterChartTooltipLabel key={item.name} item={item} prevItem={data[idx - 1]} total={total} small/>
        ))
        }
        </div>
      </div>
    </div>
  );

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
