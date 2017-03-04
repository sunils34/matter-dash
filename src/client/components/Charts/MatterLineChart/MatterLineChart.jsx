import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import MatterLoadingIndicator from '../../LoadingIndicator';


const MatterLineChart = ({ height, data }) => {

  if (data.loading) {
    return (
      <ResponsiveContainer height={height} width="100%">
        <MatterLoadingIndicator />
      </ResponsiveContainer>
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
          fields.map(field => <Line type="monotone" key={`bar-${field.name}`} dataKey={field.name} strokeWidth={2} stroke={field.color} />)
        }
      </LineChart>
    </ResponsiveContainer>
  );
};

MatterLineChart.defaultProps = {
  height: 300,
  data: {},
};

MatterLineChart.propTypes = {
  height: React.PropTypes.number,
  data: React.PropTypes.object,
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
