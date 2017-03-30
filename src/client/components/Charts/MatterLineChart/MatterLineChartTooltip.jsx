import React from 'react';
import _ from 'lodash';
import './MatterLineChartTooltip.css';

const getChangeDescription = (total, prevTotal, from) => {
  let change = total - prevTotal;
  let changeDescription = 'No change';
  if (change !== 0) {
    changeDescription = _.round((change / (prevTotal || 1)) * 100, 0);
    changeDescription += change >= 0 ? '% increase' : '% decrease';
  }
  changeDescription += ` from ${from}`;

  change = (change >= 0) ? `+${change}` : `-${Math.abs(change)}`;
  return { percentage: changeDescription, raw: change };
};

const MatterLineChartTooltipLabel = ({item, prevItem, total, small}) => {
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

MatterLineChartTooltipLabel.defaultProps = {
  small: false,
};

MatterLineChartTooltipLabel.propTypes = {
  small: React.PropTypes.bool,
};

const MatterLineChartTooltip = (props) => {
  const { payload, data, label } = props;

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
  ['value', 'name'], ['desc', 'asc']);

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
      <div className="name">{label}</div>
      <div>
        {
          _.map(firstElements, item => (
            // obtain the previous ts object to share relative change
            <MatterLineChartTooltipLabel key={item.name} item={item} prevItem={data[idx - 1]} total={total} />
          ))
        }
        {
          otherTotal > 0 &&
          <div className="label-wrap other">
            <div className="col-circle">
              <div className="circle" />
            </div>
            <div className="col-text">
              <div className="top-item">{otherTotal}&nbsp;Other&nbsp;<span>({otherChangeDescription.raw})</span></div>
              <div className="change-description">{otherChangeDescription.percentage}</div>
            </div>
          </div>
        }
        {
          otherTotal > 0 &&
          <div className="other-wrap">
          {
            _.map(rPayload, item => (
              item.value > 0 &&
                <MatterLineChartTooltipLabel key={item.name} item={item} prevItem={data[idx - 1]} total={total} small/>
            ))
          }
          </div>
        }
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

MatterLineChartTooltip.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default MatterLineChartTooltip;
