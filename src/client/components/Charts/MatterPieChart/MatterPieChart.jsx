import React from 'react';
import { PieChart, Pie, Sector, Cell, Legend, ResponsiveContainer } from 'recharts';
import './MatterPieChart.css';
import _ from 'lodash';

const COLORS = ['#6E6EE2', '#72D5C6', '#3DBAEF', '#E96DA4'];

const RADIAN = Math.PI / 180;


const renderLegend = (props) => {
  const { payload } = props;

  return (
    <ul>
    {
      payload.map((entry, index) => {
        const style = {
          color: entry.color
        }
        return (
          <li key={`item-${index}`}>
            <div className='legend-value' style={style}>
              {entry.payload.value}%
            </div>
            <div className='legend-name'>
              {entry.value}
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
  console.log(payload);
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
    var data = _.map(props.data, function(element) {
      return _.extend({}, element, {title: props.title});
    });

    this.state = { data: data };
  }

  render () {
    return (
       <ResponsiveContainer height={300} width="100%">
        <PieChart onMouseEnter={this.onPieEnter}>
          <Legend content={renderLegend} iconType='line' verticalAlign='middle' layout='vertical' align="left" />
          <Pie
            data={this.state.data}
            cx="70%"
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
    );
  }
}

module.exports = MatterPieChart;
