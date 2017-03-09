import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import './MatterBarChart.css';
import MatterLoadingIndicator from '../../LoadingIndicator';

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
    const { animationDuration, height } = this.props;

    if(this.props.data.loading) {
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

    let data = this.props.data.bardatapoints.results;
    let fields = this.props.data.bardatapoints.fields;

    let unit = '';
    let domain = [0, 'auto'];
    // stacked percentage
    if (this.props.type === 'stackedPercentage') {
      data = convertToPercentageData(data, fields);
      unit = '%';
      domain = [0, 'dataMax'];
    }


    return (
      <ResponsiveContainer height={height} width="100%">
        <BarChart data={data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey='name'/>
          <YAxis type="number" unit={unit} domain={domain} interval="preserveStart" />
          <CartesianGrid strokeDasharray="3" vertical={false}/>
          <Tooltip animationDuration={0}/>
          {
            fields.map((field, index) => <Bar animationDuration={animationDuration}unit={unit} key={`bar-${field.name}`} dataKey={field.name} stackId='a' fill={field.color}/>)
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


MatterBarChart.defaultProps = {
  animationDuration: 1500,
  height: 300,
};

MatterBarChart.propTypes = {
  query: React.PropTypes.object.isRequired,
  data: React.PropTypes.object,
  animationDuration: React.PropTypes.number,
  height: React.PropTypes.number,
};

module.exports = graphql(GetBarDataPoints, {
  options: ({ query }) => ({ variables: { query } }),
})(MatterBarChart);

