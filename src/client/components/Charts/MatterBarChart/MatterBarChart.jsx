import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import './MatterBarChart.css';
import MatterLoadingIndicator from '../../LoadingIndicator';
import MatterBarChartTooltip from './MatterBarChartTooltip';
import MatterChartLegend from '../MatterChartLegend';
import color from 'color';

const convertToPercentageData = (data, fields) => {
  const retData = _.map(data, (element) => {
    let total = 0;
    const elt = _.extend({}, element);
    _.forEach(fields, (f) => {
      if (elt[f.name]) {
        total += elt[f.name];
      }
    });
    _.forEach(fields, (f) => {
      if (elt[f.name]) {
        elt[f.name] = {
          name: f.name,
          value: _.round((elt[f.name] / total) * 100, 1),
          orig: elt[f.name],
        };
      }
    });
    return elt;
  });
  return retData;
};

const convertToOverallPercentageData = (data, fields, overall) => {
  const retData = _.map(data, (element) => {
    const elt = _.extend({}, element);
    const overallElt = _.find(overall, item => item.name === elt.name);
    _.forEach(fields, (f) => {
      if (!elt[f.name]) elt[f.name] = 0;
      if (overallElt[f.name]) {
        elt[f.name] = {
          name: f.name,
          value:_.round((elt[f.name] / (overallElt[f.name] + elt[f.name])) * 100, 1),
          total: elt[f.name],
        };
        elt[f.name].inverseValue = 100 - elt[f.name].value;
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
    const { animationDuration, height, bardatapoints, loading, query, stacked, focusType } = this.props;

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
    let overall = bardatapoints.overall;

    let unit = '';
    let domain = [0, 'auto'];
    // stacked percentage
    if (this.props.type === 'stackedPercentage') {
      data = convertToPercentageData(data, fields);
      unit = '%';
      domain = [0, 100];
    } else if (this.props.type === 'stackedOverallPercentage') {
      data = convertToOverallPercentageData(data, fields, overall);
      unit = '%';
      domain = [0, 100];
    }
    const stackId = stacked ? 'stack' : null;

    return (
      <ResponsiveContainer height={height} width="100%">
        <BarChart data={data} margin={{top: 5, right: 30, left: 30, bottom: 5}}>
          <XAxis dataKey='name' tickCount={6}/>
          <YAxis allowDataOverflow={true} scale="linear" type="number" unit={unit} allowDecimals={false} domain={domain} />
          <CartesianGrid strokeDasharray="3" vertical={false}/>
          <Tooltip animationDuration={0} labelDescription={focusType} content={MatterBarChartTooltip}/>
          {
            fields.map((field, index) => (
              <Bar isAnimationActive={false} unit="hidden" key={`total-fill-${field.name}`} dataKey={`${field.name}.inverseValue`} stackId={stackId || field.name} fill={color(field.color).alpha(0.2).rgb().string()} hiddenPoint />
              )
            )
          }
          {
            fields.map((field, index) => (
              <Bar animationDuration={animationDuration} unit={unit} key={`bar-${field.name}`} dataKey={`${field.name}.value`} name={field.name} stackId={stackId || field.name} fill={field.color}/>
              )
            )
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
    },
    overall
  }
}`;


MatterBarChart.defaultProps = {
  animationDuration: 1500,
  height: 300,
  bardatapoints: {},
  stacked: true,
};

MatterBarChart.propTypes = {
   /* eslint-disable react/forbid-prop-types */
  query: React.PropTypes.object.isRequired,
  bardatapoints: React.PropTypes.object,
   /* eslint-enable react/forbid-prop-types */

  loading: React.PropTypes.bool.isRequired,
  animationDuration: React.PropTypes.number,
  height: React.PropTypes.number,
  stacked: React.PropTypes.bool,
  focusType: React.PropTypes.string.isRequired,
};

module.exports = graphql(GetBarDataPoints, {
  options: ({ query }) => ({ variables: { query } }),
  props: ({ data: { loading, bardatapoints } }) => ({
    loading,
    bardatapoints,
  }),
})(MatterBarChart);

