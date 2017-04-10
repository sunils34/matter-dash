import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Select from 'react-select';
import { connect } from 'react-redux';
import _ from 'lodash';
import './ReportsPageAddChartDialog.css';
import { Row, Column } from '../Grid';
import MatterBarChart from '../Charts/MatterBarChart/MatterBarChart';
import MatterLineChart from '../Charts/MatterLineChart/MatterLineChart';
import MatterPieChart from '../Charts/MatterPieChart/MatterPieChart';
import * as reportActions from '../../redux/actions/reports';

let ButtonAddToReport = ({ disabled, onClick, isSubmitting, isEditing }) => {
  let c = 'add-button';
  if (disabled) {
    c += ' disabled';
  }
  let text = 'Add to Report';
  if (isSubmitting) {
    onClick = null;
    text = 'Adding to Report';
  }

  if (isEditing) {
    text = 'Update Report';
  }

  return (
    <button onClick={onClick} className={c} >{text}</button>
  );
};

ButtonAddToReport.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  isEditing: React.PropTypes.bool.isRequired,
  disabled: React.PropTypes.bool.isRequired,
  isSubmitting: React.PropTypes.bool.isRequired,
};

ButtonAddToReport = connect(state => ({
  isEditing: state.reports.editingObjIdx >= 0,
}))(ButtonAddToReport);

const UnselectedBody = ({ text }) => (
  <Row middle center extraClass="empty-state large-12">
    <div>{text || 'Add options to show visualization'}</div>
  </Row>
);

UnselectedBody.defaultProps = {
  text: null,
};

UnselectedBody.proptypes = {
  text: React.PropTypes.string.isRequired,
};

const DataViewIcon = ({ type, active, onClick }) => {
  let icon = `${type}_unselected`;
  let c = 'data-view-icon';
  if (active) {
    icon = `${type}_selected`;
  }
  return (
    <a className={c} onClick={() => (onClick({ value: type }))}>
      <img alt={type} src={`/images/icons/reports/${icon}.svg`} />
    </a>);
};

DataViewIcon.propTypes = {
  onClick: React.PropTypes.func.isRequired,
  type: React.PropTypes.string.isRequired,
  active: React.PropTypes.bool,
};

class ReportsPageAddChartDialog extends React.Component {

  constructor(props) {
    super(props);
    this.handleChangeDepartment = this.handleChange.bind(this, 'department');
    this.handleChangeFocus = this.handleChange.bind(this, 'focus');
    this.handleChangeMeasure = this.handleChange.bind(this, 'measure');
    this.handleChangeChart = this.handleChange.bind(this, 'chart');
    this.handleChangeTimeframe = this.handleChange.bind(this, 'timeframe');
    this.submit = this.submit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(!this.props.isSubmitting && newProps.isSubmitting) {

      this.props.mutate({ variables: { id: this.props.report.id, objects } })
        .then(({ data }) => {
          this.props.dispatch(reportActions.updateReport(data.updateReport));
        }).catch((error) => {
          console.log('there was an error sending the query', error);
        });
    }
  }

  handleChange(type, chosenItem) {
    this.props.dispatch(reportActions.changeReport({ type, value: chosenItem.value }));
  }

  submit() {
    if(this.props.disabled || this.props.isSubmitting) return false;

    const newObject = {
      type: this.props.chart,
      details: {
        department: this.props.department,
        focus: this.props.focus,
        measure: this.props.measure,
        timeframe: this.props.timeframe,
      },
    };

    this.props.dispatch(reportActions.addOrSaveObject());
    this.props.dispatch(reportActions.reportDialogToggle('addobject', false));
    return false;
  }


  render() {
    const { department, focus, measure, chart, timeframe, dispatch, isSubmitting } = this.props;
    const { departments, focuses, measures, timeframes } = this.props;

    let body = <UnselectedBody />;
    let disabled = true;

    let timeframeVal = timeframe;
    let timeframePlaceholder = 'Choose a Timescale';

    if (department && measure && focus) {
      const query = { department, focus, measure, timeframe };
      const height = 345;

      if (chart === 'bar') {
        body = (_.lowerCase(query.focus) === 'attrition') ?
          (
            <MatterBarChart
              type="stackedOverallPercentage"
              height={height}
              legendAlign="right"
              query={query}
              focusType="Attrition"
              stacked={false}
            />
          ) :
          (
            <MatterBarChart
              type="stackedPercentage"
              height={height}
              legendAlign="right"
              query={query}
              focusType={query.focus || 'Overall'}
              stacked
            />
          );
        disabled = false;
      } else if (chart === 'line') {
        body = (
          <MatterLineChart
            height={height}
            legendAlign="right" query={query}
            focusType={query.focus || 'Overall'}
          />
        );
        disabled = false;
      } else if (chart === 'donut') {
        body = (<MatterPieChart showTotal height={height} legendAlign="right" query={query} />);
        disabled = false;
        timeframeVal = null;
        timeframePlaceholder = 'As of Today';
      } else {
        body = <UnselectedBody text="Sorry, this view isn't supported yet" />;
      }
    }

    return (
      <Row extraClass="reports-page-chart">
        <Column>
          <Row extraClass="large-12 header header-row">
            <div className="filter-icon">
              <i className="material-icons">filter_list</i>
              <div>Filter</div>
            </div>
            <Column>
              <Row><Column extraClass="description">Department</Column></Row>
              <Row>
                <Column>
                  <Select
                    onChange={this.handleChangeDepartment}
                    placeholder="Department"
                    name="select-departments"
                    clearable={false}
                    value={department}
                    options={departments}
                  />
                </Column>
              </Row>
            </Column>
            <Column>
              <Row><Column extraClass="description">Focus</Column></Row>
              <Row>
                <Column>
                  <Select
                    onChange={this.handleChangeFocus}
                    searchable={false}
                    placeholder="Focus"
                    name="select-focus"
                    clearable={false}
                    value={focus}
                    options={focuses}
                  />
                </Column>
              </Row>
            </Column>
            <Column>
              <Row><Column extraClass="description">Diversity Measure</Column></Row>
              <Row>
                <Column>
                  <Select
                    onChange={this.handleChangeMeasure}
                    searchable={false}
                    placeholder="Measure"
                    name="select-type"
                    clearable={false}
                    value={measure}
                    options={measures}
                  />
                </Column>
              </Row>
            </Column>
            <Column>
              <Row><Column extraClass="description">Data View</Column></Row>
              <Row>
                <Column>
                  <div className="data-view-wrap">
                    <DataViewIcon type="bar" onClick={this.handleChangeChart} active={chart === 'bar'} />
                    <DataViewIcon type="line" onClick={this.handleChangeChart} active={chart === 'line'} />
                    <DataViewIcon type="donut" onClick={this.handleChangeChart} active={chart === 'donut'} />
                    <DataViewIcon type="table" onClick={this.handleChangeChart} active={chart === 'table'} />
                  </div>
                </Column>
              </Row>
            </Column>
            <Column>
              <Row><Column extraClass="description">Time</Column></Row>
              <Row>
                <Column>
                  <Select
                    disabled={chart === "donut"}
                    searchable={false}
                    onChange={this.handleChangeTimeframe}
                    placeholder={timeframePlaceholder}
                    name="select-timeframes"
                    clearable={false}
                    value={timeframeVal}
                    options={timeframes}
                  />
                </Column>
              </Row>
            </Column>
          </Row>
          <Row>
            <Column>
              <Row center>
                {body}
              </Row>
              <Row right>
                <ButtonAddToReport isSubmitting={isSubmitting}
                onClick={this.submit}
                disabled={disabled} />
              </Row>
            </Column>
          </Row>
        </Column>
      </Row>
    );
  }
}


ReportsPageAddChartDialog.propTypes = {
  department: React.PropTypes.string,
  focus: React.PropTypes.string,
  measure: React.PropTypes.string,
  chart: React.PropTypes.string,
  timeframe: React.PropTypes.string,
  dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => (
  {
    department: state.reports.dialog.department,
    focus: state.reports.dialog.focus,
    measure: state.reports.dialog.measure,
    chart: state.reports.dialog.chart,
    timeframe: state.reports.dialog.timeframe,

    isSubmitting: state.reports.dialog.submitting,

    report: state.reports.report,
    measures: state.reports.measures,
    timeframes: state.reports.timeframes,
    departments: state.reports.departments,
    focuses: state.reports.focuses,
  }
);

const AddToReportMutation = gql`
mutation updateReport($id: String!, $objects: [JSON]) {
  updateReport(id:$id, objects:$objects)
  {
    id,
    name,
    details,
    objects {
      id,
      orderNumber,
      type,
      details,
    }
  }
}
`;

export default connect(mapStateToProps)(
  graphql(AddToReportMutation)(ReportsPageAddChartDialog),
);
