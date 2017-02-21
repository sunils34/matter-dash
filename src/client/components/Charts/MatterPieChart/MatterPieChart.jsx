import React from 'react';
import { PieChart, Pie, Sector, Cell, Legend } from 'recharts';
import './MatterPieChart.css';
const data = [{name: 'Male', value: 70}, {name: 'Female', value: 10},
                    {name: 'Prefer not to disclose', value: 2}, {name: 'Non-Binary', value: 8}];
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


const MatterPieChart = React.createClass({
  render () {
    const legendMargin = {left: 0, top: -50}
    return (
      <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
        <Legend content={renderLegend} margin={legendMargin} iconType='line' verticalAlign='middle' layout='vertical' align="left" />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={100}
          outerRadius={160}
          fill="#8884d8"
          label
          legend
        >
        {
          data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
        }
        </Pie>
      </PieChart>
    );
  }
})

module.exports = MatterPieChart;
