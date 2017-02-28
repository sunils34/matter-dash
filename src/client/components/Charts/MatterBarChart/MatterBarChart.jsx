import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import './MatterBarChart.css';

const convertToPercentageData = (data, fields) => {
  const retData = _.map(data, (element) => {
    let total = 0;
    const elt = _.extend({}, element);
    fields.forEach((f) => {
      if (elt[f.name]) {
        total += elt[f.name];
      }
    });
    fields.forEach((f) => {
      if (elt[f.name]) {
        elt[f.name] = _.round((elt[f.name] / total) * 100, 1);
      }
    });
    return elt;
  });
  return retData;
};

class MatterBarChart extends React.Component {
  render() {
    let props = this.props;
    if(this.props.data.loading) return null;
    let data = this.props.data.bardatapoints.results;
    let fields = this.props.data.bardatapoints.fields;
    data = convertToPercentageData(data, fields);
    const height = props.height ? props.height : 300;

    return (
      <ResponsiveContainer height={height} width="100%">
        <BarChart height={300} data={data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey='name'/>
          <YAxis type="number" domain={[0, 'dataMax']} unit='%' />
          <CartesianGrid strokeDasharray="3" vertical={false}/>
          <Tooltip animationDuration={0}/>
          {
            fields.map((field, index) => <Bar unit='%' key={`bar-${field.name}`} dataKey={field.name} stackId='a' fill={field.color}/>)
          }
          <Legend iconType="circle" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

const GetBarDataPoints = gql`query GetBarDataPoints($query: JSON!){
  bardatapoints(query: $query) {
    results,
    fields {
      name
      color
    }
  }
}`;

module.exports = graphql(GetBarDataPoints, {
  options: ({ query }) => ({ variables: { query } }),
})(MatterBarChart);

