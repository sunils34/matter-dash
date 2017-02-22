import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import './MatterPieChart.css';
import _ from 'lodash';

const COLORS = ['#6E6EE2', '#72D5C6', '#3DBAEF', '#E96DA4', "#F1BA00", '#3481A5'];

const RADIAN = Math.PI / 180;


const Legend = (props) => {
  const { payload } = props;

  return (
    <ul className='legend-list'>
    {
      payload.map((entry, index) => {
        const style = {
          color: entry.color
        };
        return (
          <li key={`item-${index}`}>
            <div className='legend-value' style={style}>
              {entry.value}%
            </div>
            <div className='legend-name'>
              {entry.name}
            </div>
          </li>
        )
      })
    }
    </ul>
  );
}

const renderTitle = (props) => {

  const {cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, title, payload} = props;
  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#979797">{payload.title}</text>
      <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
        />
    </g>
  );
}


class MatterPieChart extends React.Component {

  constructor(props) {

    super(props);
    var data = _.map(props.data, function(element, index) {
      return _.extend({}, element, {title: props.title, color: COLORS[index % COLORS.length] });
    });

    this.state = { data: data };
  }

  render () {
    var cx="60%"
    if(this.props.legendAlign == 'right') {
      cx="30%";
    }

    var leftLegend = (
      <div className='col-md-4 legend'>
        <Legend payload={this.state.data} />
      </div>
    )
    var rightLegend = null;

    if(this.props.legendAlign == 'right') {
      rightLegend = leftLegend;
      leftLegend=null;
    }

    return (
      <div className='row matter-pie-chart'>
          {leftLegend}
          <div className='col-md-8'>
            <ResponsiveContainer height={300} width="100%">
              <PieChart onMouseEnter={this.onPieEnter}>
                <Pie
                  data={this.state.data}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="90%"
                  activeShape={renderTitle}
                  activeIndex={0}
                  isAnimationActive={false}
                  fill="#8884d8"
                >
                {
                  this.state.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>)
                }
                </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {rightLegend}
      </div>
    );
  }
}

module.exports = MatterPieChart;
