import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import _ from 'lodash';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import MatterLoadingIndicator from '../../LoadingIndicator';
import './MatterPieChart.css';
import { Row, Column } from '../../Grid';


const Legend = (props) => {
  const { payload } = props;

  return (
    <div className='legend-list'>
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
    </div>
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

    const props = this.props;
    const { height, showTotal, title } = this.props;
    if (this.props.data.loading) {
      return (
        <ResponsiveContainer height={height} width="100%">
          <MatterLoadingIndicator />
        </ResponsiveContainer>);
    }

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
      <div className='legend'>
        <Legend payload={data} />
      </div>
    )
    var rightLegend = null;

    if(this.props.legendAlign == 'right') {
      rightLegend = leftLegend;
      leftLegend=null;
    }

    let totalText = null;
    if (showTotal && !title) {
      totalText = (
        <Row className="total-wrap">
          <Column>
            <Row center className="number">{total}</Row>
            <Row center className="description">Total</Row>
          </Column>
        </Row>);
    }

    return (
      <div className="matter-pie-chart">
          {leftLegend}
          <div className="column pie-wrap">
            {totalText}
            <ResponsiveContainer height={height} width="100%">
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

MatterPieChart.defaultProps = {
  height: 380,
  showTotal: false,
};

MatterPieChart.propTypes = {
  height: React.PropTypes.number,
  query: React.PropTypes.object.isRequired,
  showTotal: React.PropTypes.bool.isRequired,
};

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
