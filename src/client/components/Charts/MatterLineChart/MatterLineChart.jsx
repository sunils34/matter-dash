import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import MatterLineChartTooltip from './MatterLineChartTooltip';
import MatterChartLegend from '../MatterChartLegend';
import MatterLoadingIndicator from '../../LoadingIndicator';

class MatterLineChart extends React.Component {

  shouldComponentUpdate(nextProps) {
    // TODO for some reason, the report is rerendering even though props are the same
    return !_.isEqual(this.props, nextProps);
  }

  render() {

    const { height, loading, bardatapoints, animationDuration, query } = this.props;

    if (loading) {
      const style = {
        height,
        width: '100%'
      };
      return (
        <div style={style}>
          <MatterLoadingIndicator />
        </div>
      );
    }
    const dataPoints = bardatapoints.results;
    const fields = bardatapoints.fields;
    const focus = query.focus || 'Overall';

    return (
      <ResponsiveContainer height={height} width="100%">
        <LineChart data={dataPoints} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <Tooltip
            isAnimationActive={false}
            labelDescription={focus}
            data={dataPoints}
            content={MatterLineChartTooltip}
          />
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Legend iconType="circle" content={MatterChartLegend} />
          {
            fields.map(field => <Line animationDuration={animationDuration} type="monotone" key={`bar-${field.name}`} dataKey={field.name} strokeWidth={2} stroke={field.color} />)
          }
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

MatterLineChart.defaultProps = {
  animationDuration: 1500,
  bardatapoints: {},
  height: 300,
};

MatterLineChart.propTypes = {
  animationDuration: React.PropTypes.number,
  loading: React.PropTypes.bool.isRequired,
  bardatapoints: React.PropTypes.object,
  height: React.PropTypes.number,
  query: React.PropTypes.object.isRequired,
};


const GetLineDataPoints = gql`query GetLineDataPoints($query: JSON!) {
  bardatapoints(query: $query) {
    results,
    fields {
      name
      color
    }
  }
}`;

export default graphql(GetLineDataPoints, {
  options: ({ query }) => ({ variables: { query } }),
  props: ({ data: { loading, bardatapoints } }) => ({
    loading,
    bardatapoints,
  }),
})(MatterLineChart);
