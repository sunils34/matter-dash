import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';

const COLORS = {
  Male: '#DEDEDE',
  Female:'#72D5C6',
};

let h = 0;
const CustomizedLabel = (props) => {
  const { x, y, dx, stroke, index, value, labelFill } = props;

  let val = _.round(Math.abs(value[0] - value[1]));
  // if (val < 5) val = _.round(Math.abs(value[0] - value[1]), 1);
  let xPos = -1 * Math.min(20, x / 2);
  let fill = 'white';

  // only adjust labels for ethnicity
  if(val < 5 || x < 30) {
    fill = "#ABABAB";
    xPos = 5;
  }

  if (labelFill) {
    fill = labelFill;
  }

  return (
    <text x={x} y={y} dx={xPos} fill={fill} fontSize={12} textAnchor="middle">{val}</text>
  )
};


const MatterHorizontalBarChart = ({ fields, data, yDataKey, labelFill, xDataKey, includeZeroFields, stackedPercentage, height, complete }) => {
  const d = _.cloneDeep(data);
  let completeBar = null;

  if (!d[0][xDataKey]) {
    return <div className="no-data">No Data Available</div>;
  }

  if (includeZeroFields && !d[0][xDataKey][fields[0].name]) {
    d[0][xDataKey][fields[0].name] = 0;
  }

  if (complete) {
    d[0].complete = 100 - d[0][xDataKey][fields[0].name];
    completeBar = (
      <Bar
        width={100}
        isAnimationActive={false}
        key="bar-fill"
        dataKey="complete"
        data={ [{ num:d[0][xDataKey][fields[0].name] }] }
        stackId="a"
        fill="#ECECEC" />
    );
  }

  return (
    <ResponsiveContainer height={height} width="100%">
      <BarChart layout="vertical" data={d}>
        <YAxis hide type="category" dataKey="companyKey" />
        <XAxis hide type="number" unit="%" domain={[0, 100]} />
        {completeBar}
        {
          fields.map((field) => {
            if (!includeZeroFields && !Math.round(d[0][xDataKey][field.name])) {
              return null;
            }
            return (
              <Bar
                label={<CustomizedLabel labelFill={labelFill} />}
                width={100}
                isAnimationActive={false}
                unit="%"
                key={`bar-${field.name}`}
                dataKey={`${xDataKey}.${field.name}`}
                stackId="a"
                fill={field.color}
              />
            );
          })
        }
      </BarChart>
    </ResponsiveContainer>
  );
};

MatterHorizontalBarChart.defaultProps = {
  includeZeroFields: false,
};

MatterHorizontalBarChart.propTypes = {
  includeZeroFields: React.PropTypes.bool,
};

export default MatterHorizontalBarChart;
