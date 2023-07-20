/*
 * Copyright © 2017 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { objectQuery, preventPropagation } from 'services/helpers';
import {
  XYPlot,
  makeVisFlexible,
  XAxis,
  YAxis,
  HorizontalGridLines,
  Hint,
  DiscreteColorLegend,
  VerticalBarSeries as BarSeries,
} from 'react-vis';
import moment from 'moment';
import { getLogViewerPageUrl } from 'components/LogViewer/LogViewerPage';
import classnames from 'classnames';
import T from 'i18n-react';
import IconSVG from 'components/shared/IconSVG';
import {
  getTicksTotal,
  xTickFormat,
  getXDomain,
} from 'components/PipelineSummary/RunsGraphHelpers';
import CopyableID from 'components/CopyableID';
import SortableStickyTable from 'components/shared/SortableStickyTable';
import { getYAxisProps } from 'components/PipelineSummary/RunsGraphHelpers';
import ee from 'event-emitter';
import EmptyMessageContainer from 'components/PipelineSummary/EmptyMessageContainer';
import colorVariables from 'styles/variables.scss';

// TODO: CDAP-17725
const WARNINGBARCOLOR = '#FDA639';
const ERRORBARCOLOR = colorVariables.red01;
const HOVER_STROKE_COLOR = 'black';
const STROKE_WIDTH = 2;
const PREFIX = 'features.PipelineSummary.logsMetricsGraph';
const GRAPHPREFIX = 'features.PipelineSummary.graphs';
const COLOR_LEGEND = [
  {
    title: T.translate(`${PREFIX}.legend1`),
    color: WARNINGBARCOLOR,
    strokeWidth: 20,
  },
  {
    title: T.translate(`${PREFIX}.legend2`),
    color: ERRORBARCOLOR,
    strokeWidth: 20,
  },
];
const tableHeaders = [
  {
    label: T.translate(`${PREFIX}.table.header.runCount`),
    property: 'index',
  },
  {
    label: T.translate(`${PREFIX}.table.header.errors`),
    property: 'errors',
  },
  {
    label: T.translate(`${PREFIX}.table.header.warnings`),
    property: 'warnings',
  },
  {
    label: '',
    property: '',
  },
  {
    label: T.translate(`${PREFIX}.table.header.startTime`),
    property: 'start',
  },
];
require('./LogsMetricsGraph.scss');
/*
   - Better name
   - Name says LogsMetricsGraph but we are passing in runs. Its logs metrics (warning, error, info etc.,) per run. but ugh..
*/
export default class LogsMetricsGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHoveredElement: null,
      viewState: 'chart',
      runsLimit: props.runsLimit,
    };
    this.eventEmitter = ee(ee);
    this.renderTableBody = this.renderTableBody.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentHoveredElement: null,
      runsLimit: nextProps.runsLimit,
    });
  }
  componentDidMount() {
    this.eventEmitter.on('CLOSE_HINT_TOOLTIP', this.closeTooltip);
  }
  componentWillUnmount() {
    this.eventEmitter.off('CLOSE_HINT_TOOLTIP', this.closeTooltip);
  }
  closeTooltip() {
    this.setState({
      currentHoveredElement: null,
    });
  }
  getDataClusters() {
    const warnings = [];
    const errors = [];
    // Clustering by runs. Stack warnings and errors by clusters.
    []
      .concat(this.props.runs)
      .reverse()
      .forEach((run, i) => {
        const { totalRunsCount, runsLimit, xDomainType } = this.props;
        let x;
        if (xDomainType === 'limit') {
          x = totalRunsCount > runsLimit ? totalRunsCount - runsLimit : 0;
          x = x + (i + 1);
        }
        if (xDomainType === 'time') {
          x = run.starting;
        }
        warnings.push({
          x,
          y: objectQuery(run, 'logsMetrics', 'system.app.log.warn') || 0,
          runid: run.runid,
          color: WARNINGBARCOLOR,
          fill: WARNINGBARCOLOR,
          stroke:
            objectQuery(this.state.currentHoveredElement, 'runid') === run.runid
              ? HOVER_STROKE_COLOR
              : WARNINGBARCOLOR,
        });
        errors.push({
          x,
          y: objectQuery(run, 'logsMetrics', 'system.app.log.error') || 0,
          runid: run.runid,
          color: ERRORBARCOLOR,
          fill: ERRORBARCOLOR,
          stroke:
            objectQuery(this.state.currentHoveredElement, 'runid') === run.runid
              ? HOVER_STROKE_COLOR
              : ERRORBARCOLOR,
        });
      });
    if (errors.length === 1 || warnings.length === 1) {
      // FIXME: This is a hack. Something is not right with VerticalBarSeries
      // if it has only one data point. The width of rect element is not scaled correctly
      const maxXValue = errors.length === 1 ? errors[0].x : warnings[0].x;
      errors.push({
        x: maxXValue + 1,
        y: 0,
      });
      warnings.push({
        x: maxXValue + 1,
        y: 0,
      });
    }
    return { errors, warnings };
  }
  renderEmptyMessage() {
    return (
      <EmptyMessageContainer
        xDomainType={this.props.xDomainType}
        label={this.props.activeFilterLabel}
      />
    );
  }
  renderChart() {
    const FPlot = makeVisFlexible(XYPlot);
    const { errors, warnings } = this.getDataClusters();
    let xDomain = [];
    if (errors.length > 0 || warnings.length > 0) {
      xDomain = getXDomain(this.props);
    }

    // since this is a stacked bar graph, the data has to be aggregated to calculate the yAxis properly
    const data = errors.map((errorData, i) => {
      return {
        ...errorData,
        y: errorData.y + warnings[i].y,
      };
    });

    const { tickTotals, yDomain, tickFormat } = getYAxisProps(data);
    let popOverData, logUrl;
    if (this.state.currentHoveredElement) {
      popOverData = this.props.runs.find(
        (run) => this.state.currentHoveredElement.runid === run.runid
      );
      const {
        namespaceId,
        appId,
        programType,
        programId,
      } = this.props.runContext;
      logUrl = getLogViewerPageUrl(
        namespaceId,
        appId,
        programType,
        programId,
        popOverData.runid
      );
    }
    return (
      <div className="graph-plot-container">
        <FPlot
          className="logs-metrics-fp-plot"
          xType="linear"
          xDomain={xDomain}
          yDomain={yDomain}
          stackBy="y"
        >
          <DiscreteColorLegend
            orientation="horizontal"
            items={COLOR_LEGEND}
            className="logs-metrics-legend-container"
          />
          <HorizontalGridLines />
          <XAxis
            tickTotal={getTicksTotal(this.props)}
            tickFormat={xTickFormat(this.props)}
          />
          <YAxis tickTotal={tickTotals} tickFormat={tickFormat} />
          {warnings.length > 0 ? (
            <BarSeries
              cluster="runs"
              colorType="literal"
              strokeType="literal"
              fillType="literal"
              style={{ strokeWidth: STROKE_WIDTH }}
              onValueMouseOver={(d) => {
                if (
                  objectQuery(this.state, 'currentHoveredElement', 'runid') ===
                  d.runid
                ) {
                  return;
                }
                this.setState({
                  currentHoveredElement: d,
                });
              }}
              onValueMouseOut={() => {
                this.setState({
                  currentHoveredElement: null,
                });
              }}
              data={warnings}
            />
          ) : null}
          {errors.length > 0 ? (
            <BarSeries
              cluster="runs"
              colorType="literal"
              strokeType="literal"
              fillType="literal"
              style={{ strokeWidth: STROKE_WIDTH }} // BarSeries currently doesn't have a way to customize strokeWidth
              onValueMouseOver={(d) => {
                if (
                  objectQuery(this.state, 'currentHoveredElement', 'runid') ===
                  d.runid
                ) {
                  return;
                }
                this.setState({
                  currentHoveredElement: d,
                });
              }}
              onValueMouseOut={() => {
                this.setState({
                  currentHoveredElement: null,
                });
              }}
              data={errors}
            />
          ) : null}
          {this.state.currentHoveredElement && popOverData ? (
            <Hint
              value={this.state.currentHoveredElement}
              align={{ vertical: 'bottom', horizontal: 'left' }}
            >
              <div className="title">
                <h4>{T.translate(`${PREFIX}.hint.title`)}</h4>
                <IconSVG
                  name="icon-close"
                  onClick={(e) => {
                    this.setState({
                      currentHoveredElement: null,
                    });
                    preventPropagation(e);
                    return false;
                  }}
                />
              </div>
              <div className="log-stats">
                <div>
                  <span>{T.translate(`${PREFIX}.hint.errors`)}</span>
                  <span className="text-danger">
                    {popOverData.logsMetrics['system.app.log.error'] || '0'}
                  </span>
                </div>
                <div>
                  <span>{T.translate(`${PREFIX}.hint.warnings`)}</span>
                  <span className="text-warning">
                    {popOverData.logsMetrics['system.app.log.warn'] || '0'}
                  </span>
                </div>
                <a href={logUrl} target="_blank" rel="noopener noreferrer">
                  {T.translate(`${PREFIX}.hint.viewLogs`)}
                </a>
              </div>
              {this.props.xDomainType === 'limit' ? (
                <div>
                  <strong>{T.translate(`${PREFIX}.hint.runNumber`)}: </strong>
                  <span>{this.state.currentHoveredElement.x}</span>
                </div>
              ) : null}
              <div>
                <strong>{T.translate(`${PREFIX}.hint.startTime`)}: </strong>
                <span>
                  {moment(popOverData.starting * 1000).format('llll')}
                </span>
              </div>
            </Hint>
          ) : null}
          {this.props.xDomainType === 'limit' ? (
            <div className="x-axis-title">
              {' '}
              {T.translate(`${PREFIX}.xAxisTitle`)}{' '}
            </div>
          ) : null}
          <div className="y-axis-title">
            {T.translate(`${PREFIX}.yAxisTitle`)}
          </div>
        </FPlot>
      </div>
    );
  }
  renderTableBody(runs) {
    const {
      namespaceId,
      appId,
      programType,
      programId,
    } = this.props.runContext;
    const runsLength = runs.length;

    return (
      <table className="table">
        <tbody>
          {runs.map((run) => {
            const runid = run.runid;
            const logUrl = getLogViewerPageUrl(
              namespaceId,
              appId,
              programType,
              programId,
              runid
            );

            return (
              <tr>
                <td>
                  <span>{runsLength - run.index + 1}</span>
                  <CopyableID id={runid} idprefix="logs-metrics" />
                </td>
                <td>
                  <span className="text-danger">{run.errors}</span>
                </td>
                <td>
                  <span className="text-warning">{run.warnings}</span>
                </td>
                <td>
                  <a href={logUrl} target="_blank" rel="noopener noreferrer">
                    {T.translate(`${PREFIX}.table.body.viewLog`)}{' '}
                  </a>
                </td>
                <td> {moment(run.starting * 1000).format('llll')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  renderTable() {
    const entities = this.props.runs.map((run, i) => {
      return Object.assign({}, run, {
        index: i + 1,
        warnings: objectQuery(run, 'logsMetrics', 'system.app.log.warn') || 0,
        errors: objectQuery(run, 'logsMetrics', 'system.app.log.error') || 0,
        start: run.starting,
      });
    });
    return (
      <SortableStickyTable
        entities={entities}
        tableHeaders={tableHeaders}
        renderTableBody={this.renderTableBody}
      />
    );
  }
  renderLoading() {
    return <EmptyMessageContainer loading={true} />;
  }
  renderContent() {
    if (this.props.isLoading) {
      return this.renderLoading();
    }
    if (!this.props.runs.length) {
      return this.renderEmptyMessage();
    }
    if (this.state.viewState === 'chart') {
      return this.renderChart();
    }
    if (this.state.viewState === 'table') {
      return this.renderTable();
    }
  }
  render() {
    return (
      <div
        className="logs-metrics-graph"
        ref={(ref) => (this.containerRef = ref)}
      >
        <div className="title-container">
          <div className="title">{T.translate(`${PREFIX}.title`)} </div>
          <div className="viz-switcher">
            <span
              className={classnames('chart', {
                active: this.state.viewState === 'chart',
              })}
              onClick={() => this.setState({ viewState: 'chart' })}
            >
              {T.translate(`${GRAPHPREFIX}.vizSwitcher.chart`)}
            </span>
            <span
              className={classnames({
                active: this.state.viewState === 'table',
              })}
              onClick={() => this.setState({ viewState: 'table' })}
            >
              {T.translate(`${GRAPHPREFIX}.vizSwitcher.table`)}
            </span>
          </div>
        </div>
        {this.renderContent()}
      </div>
    );
  }
}
LogsMetricsGraph.propTypes = {
  runs: PropTypes.arrayOf(PropTypes.object),
  totalRunsCount: PropTypes.number,
  runsLimit: PropTypes.number,
  xDomainType: PropTypes.oneOf(['limit', 'time']),
  runContext: PropTypes.object,
  isLoading: PropTypes.bool,
  start: PropTypes.number,
  end: PropTypes.number,
  activeFilterLabel: PropTypes.string,
};
