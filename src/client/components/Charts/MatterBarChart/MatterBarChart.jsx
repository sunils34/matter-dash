import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import './MatterBarChart.css';

import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

const COLORS = ['#6E6EE2', '#72D5C6', '#3DBAEF', '#E96DA4', "#E28D6E", "#F1BA00", '#3481A5' ];



const MatterBarChart = React.createClass({
  render () {
    var props = this.props;
    if(this.props.data.loading) return null;
    var data = this.props.data.bardatapoints.results;
    var fields = this.props.data.bardatapoints.fields;
    return (
      <ResponsiveContainer height={300} width="100%">
        <BarChart  data={data}
        margin={{top: 20, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          {
            fields.map((entry, index) => <Bar key={`bar-${index}`} dataKey={entry} stackId="a" fill={COLORS[index % COLORS.length]}/>)
          }
        </BarChart>
      </ResponsiveContainer>
    );
  }
});

const GetBarDataPoints = gql`query GetBarDataPoints($query: JSON!) { bardatapoints(query: $query) { results, fields } }`;
module.exports = graphql(GetBarDataPoints, {
  options: ({ query }) => ({ variables: { query } }),
})(MatterBarChart);

