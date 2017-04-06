import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import './MatterBarChart.css';
import MatterLoadingIndicator from '../../LoadingIndicator';
import MatterBarChartTooltip from './MatterBarChartTooltip';
import MatterChartLegend from '../MatterChartLegend';

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

  shouldComponentUpdate(nextProps) {
    // TODO for some reason, the report is rerendering even though props are the same
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const { animationDuration, height, bardatapoints, loading, query } = this.props;

    if(loading) {
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

    let data = bardatapoints.results;
    let fields = bardatapoints.fields;
    const focus = query.focus || 'Overall';

    let unit = '';
    let domain = [0, 'auto'];
    let hide = false;
    // stacked percentage
    if (this.props.type === 'stackedPercentage') {
      data = convertToPercentageData(data, fields);
      unit = '%';
      domain = [0, 100];
      hide = true;
    }

    return (
      <ResponsiveContainer height={height} width="100%">
        <BarChart data={data} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
          <XAxis dataKey='name'/>
          <YAxis allowDataOverflow={true} scale="linear" type="number" unit={unit} allowDecimals={false} domain={domain} />
          <CartesianGrid strokeDasharray="3" vertical={false}/>
          <Tooltip animationDuration={0} labelDescription={focus} content={MatterBarChartTooltip}/>
          {
            fields.map((field, index) => <Bar animationDuration={animationDuration}unit={unit} key={`bar-${field.name}`} dataKey={field.name} stackId='a' fill={field.color}/>)
          }
          <Legend content={MatterChartLegend} iconType="circle" />
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
  bardatapoints: {},
};

MatterBarChart.propTypes = {
  query: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired,
  bardatapoints: React.PropTypes.object,
  animationDuration: React.PropTypes.number,
  height: React.PropTypes.number,
};

module.exports = graphql(GetBarDataPoints, {
  options: ({ query }) => ({ variables: { query } }),
  props: ({ data: { loading, bardatapoints } }) => ({
    loading,
    bardatapoints,
  }),
})(MatterBarChart);

