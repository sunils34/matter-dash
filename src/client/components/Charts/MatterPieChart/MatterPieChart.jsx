import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import _ from 'lodash';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import './MatterPieChart.css';


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

  componentWillUpdate(nextProps, nextState) {
    if(this.props.componentWillUpdate) {
      this.props.componentWillUpdate(nextProps, nextState);
    }
  }

  render () {

    var props = this.props;
    if(this.props.data.loading) return null;

    const dataPoints = props.data.piedatapoints.results;
    const fields = props.data.piedatapoints.fields;

    var total = 0;
    _.map(dataPoints, (element) => {
      total += element.value;
    });

    var data = _.map(dataPoints, function(element, index) {
      return _.extend({}, element, {
        value: Math.round(element.value/total*100),
        title: props.title,
        color: _.result(_.find(fields, (field) => (field.name === element.name)), 'color'),
      });
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
                  //isAnimationActive={false}
                >
                {
                  data.map(entry => <Cell key={`cell-${entry.name}`} fill={entry.color} />)
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


const GetPieDataPoints = gql`query GetPieDataPoints($query: JSON!) {
  piedatapoints(query: $query) {
    results {
      name
      value
    }, fields {
      name
      color
    }
  }
}`;

module.exports = graphql(GetPieDataPoints, {
  options: ({ query }) => ({ variables: { query } }),
})(MatterPieChart);
