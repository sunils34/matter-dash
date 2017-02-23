import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import './MatterPieChart.css';
import _ from 'lodash';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

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
  }

  render () {

    var props = this.props;
    if(this.props.data.loading) return null;

    var total = 0;
    _.map(props.data.piedatapoints, function(element) {
      total += element.value;
    });

    var data = _.map(props.data.piedatapoints, function(element, index) {
      return _.extend({}, element, {value: Math.round(element.value/total*100), title: props.title, color: COLORS[index % COLORS.length] });
    });

    var cx="60%"
    if(this.props.legendAlign == 'right') {
      cx="30%";
    }

    var leftLegend = (
      <div className='col-md-4 legend'>
        <Legend payload={data} />
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
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="90%"
                  activeShape={renderTitle}
                  activeIndex={0}
                  fill="#8884d8"
                >
                {
                  data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>)
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


const GetPieDataPoints = gql`query GetPieDataPoints($query: JSON!) { piedatapoints(query: $query) { name, value } }`;

module.exports = graphql(GetPieDataPoints, {
  options: ({ query }) => ({ variables: { query } }),
})(MatterPieChart);
