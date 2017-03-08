import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import MatterLoadingIndicator from '../../LoadingIndicator';


const MatterLineChart = ({ height, data, animationDuration }) => {

  if (data.loading) {
    var style = {
      height,
      width: '100%'
    };
    return (
      <div style={style}>
        <MatterLoadingIndicator />
      </div>
    );
  }
  const dataPoints = data.bardatapoints.results;
  const fields = data.bardatapoints.fields;

  return (
    <ResponsiveContainer height={height} width="100%">
      <LineChart data={dataPoints} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip animationDuration={0} />
        <Legend iconType="circle" />
        {
          fields.map(field => <Line animationDuration={animationDuration} type="monotone" key={`bar-${field.name}`} dataKey={field.name} strokeWidth={2} stroke={field.color} />)
        }
      </LineChart>
    </ResponsiveContainer>
  );
};

MatterLineChart.defaultProps = {
  animationDuration: 1500,
  data: {},
  height: 300,
};

MatterLineChart.propTypes = {
  animationDuration: React.PropTypes.number,
  data: React.PropTypes.object,
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
})(MatterLineChart);
