import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import './MatterBarChart.css';

import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

const COLORS = ['#6E6EE2', '#72D5C6', '#3DBAEF', '#E96DA4', "#E28D6E", "#F1BA00", '#3481A5' ];
const convertToPercentageData = (data, fields) => {
  var data = _.map(data, function(element, index) {
    var total = 0;
    var elt = _.extend({}, element);
    fields.forEach(function(f) {
      if(elt[f]) {
        total += elt[f];
      }
    });
    fields.forEach(function(f) {
      if(elt[f]) {
        elt[f] = _.round((elt[f] / total) * 100, 1);
      }
    });
    return elt;
  });
  return data;
}

const MatterBarChart = React.createClass({
  render () {
    var props = this.props;
    if(this.props.data.loading) return null;
    var data = this.props.data.bardatapoints.results;
    var fields = this.props.data.bardatapoints.fields;
    data = convertToPercentageData(data, fields);
    var height = props.height ? props.height : 300;

    return (
      <ResponsiveContainer height={height} width="100%">
        <BarChart height={300} data={data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey='name'/>
          <YAxis type="number" domain={[0, 'dataMax']} unit='%' />
          <CartesianGrid strokeDasharray="3" vertical={false}/>
          <Tooltip animationDuration={0}/>
          {
            fields.map((entry, index) => <Bar unit='%' key={`bar-${index}`} dataKey={entry} stackId="a" fill={COLORS[index % COLORS.length]}/>)
          }
        <Legend iconType='circle' />
        </BarChart>
      </ResponsiveContainer>
    );
  }
});

const GetBarDataPoints = gql`query GetBarDataPoints($query: JSON!) { bardatapoints(query: $query) { results, fields } }`;
module.exports = graphql(GetBarDataPoints, {
  options: ({ query }) => ({ variables: { query } }),
})(MatterBarChart);

