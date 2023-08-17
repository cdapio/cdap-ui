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
import {
  XYPlot,
  makeVisFlexible,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
  DiscreteColorLegend,
  Hint,
} from 'react-vis';
import moment from 'moment';
import classnames from 'classnames';
import IconSVG from 'components/shared/IconSVG';
import T from 'i18n-react';
import {
  getTicksTotal,
  xTickFormat,
  getXDomain,
  ONE_MIN_SECONDS,
  getTimeResolution,
  getYAxisProps,
} from 'components/PipelineSummary/RunsGraphHelpers';
import {
  humanReadableDuration,
  preventPropagation,
  objectQuery,
} from 'services/helpers';
import CopyableID from 'components/CopyableID';
import SortableStickyTable from 'components/shared/SortableStickyTable';
import ee from 'event-emitter';
import EmptyMessageContainer from 'components/PipelineSummary/EmptyMessageContainer';
import isEqual from 'lodash/isEqual';
import StatusMapper from 'services/StatusMapper';
import colorVariables from 'styles/variables.scss';
import { PROGRAM_STATUSES } from 'services/global-constants';

require('./RunsHistoryGraph.scss');
// require('react-vis/dist/styles/plot.scss');

const MARKSERIESSTROKECOLOR = colorVariables.grey03;
const FAILEDRUNCOLOR = colorVariables.red01;
const SUCCESSRUNCOLOR = colorVariables.green02;
const PENDINGSTATUSFILLCOLOR = colorVariables.white01;
const PENDINGSTATUSSTROKECOLOR = colorVariables.blue02;
const RUNNINGSTATUSCOLOR = colorVariables.blue02;
const LINECOLOR = colorVariables.grey06;
const HOVERCOLOR = 'black';
const PREFIX = 'features.PipelineSummary.runsHistoryGraph';
const GRAPHPREFIX = 'features.PipelineSummary.graphs';
const COLORLEGENDS = [
  {
    title: StatusMapper.lookupDisplayStatus(PROGRAM_STATUSES.FAILED),
    color: FAILEDRUNCOLOR,
    strokeWidth: 20,
  },
  {
    title: StatusMapper.lookupDisplayStatus(PROGRAM_STATUSES.SUCCEEDED),
    color: SUCCESSRUNCOLOR,
    strokeWidth: 20,
  },
  {
    title: StatusMapper.lookupDisplayStatus(PROGRAM_STATUSES.PENDING),
    color: PENDINGSTATUSFILLCOLOR,
    strokeWidth: 20,
  },
  {
    title:
      StatusMapper.lookupDisplayStatus(PROGRAM_STATUSES.STARTING) +
      '/' +
      StatusMapper.lookupDisplayStatus(PROGRAM_STATUSES.RUNNING),
    color: RUNNINGSTATUSCOLOR,
    strokeWidth: 20,
  },
];
const tableHeaders = [
  {
    label: T.translate(`${PREFIX}.table.headers.runCount`),
    property: 'index',
  },
  {
    label: T.translate(`${PREFIX}.table.headers.status`),
    property: 'status',
  },
  {
    label: T.translate(`${PREFIX}.table.headers.startTime`),
    property: 'start',
  },
  {
    label: T.translate(`${PREFIX}.table.headers.duration`),
    property: 'duration',
  },
];

export default class RunsHistoryGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.constructData(),
      totalRunsCount: props.totalRunsCount,
      viewState: 'chart',
      currentHoveredElement: null,
      runsLimit: props.runsLimit,
    };
    this.renderChart = this.renderChart.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.eventEmitter = ee(ee);
    this.closeTooltip = this.closeTooltip.bind(this);
    this.renderTableBody = this.renderTableBody.bind(this);
  }
  componentDidMount() {
    this.eventEmitter.on('CLOSE_HINT_TOOLTIP', this.closeTooltip);
  }
  closeTooltip() {
    this.setState({
      currentHoveredElement: null,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (
      isEqual(nextProps.runs, this.props.runs) &&
      nextProps.totalRunsCount === this.props.totalRunsCount &&
      nextProps.runsLimit === this.props.runsLimit
    ) {
      return;
    }
    this.setState({
      data: this.constructData(nextProps),
      totalRunsCount: nextProps.totalRunsCount,
      currentHoveredElement: null,
      runsLimit: nextProps.runsLimit,
    });
  }
  componentWillUnmount() {
    this.eventEmitter.off('CLOSE_HINT_TOOLTIP', this.closeTooltip);
  }
  constructData(props = this.props) {
    const data = []
      .concat(props.runs)
      .reverse()
      .map((run, id) => {
        const { totalRunsCount, runsLimit, xDomainType } = this.props;
        let x;
        if (xDomainType === 'limit') {
          x = totalRunsCount > runsLimit ? totalRunsCount - runsLimit : 0;
          x = x + (id + 1);
        }
        if (xDomainType === 'time') {
          x = run.starting;
        }
        return {
          x,
          y: !run.duration ? 0 : run.duration,
          color: this.getRunStatusFillColor(run.status),
          stroke: this.getRunStatusStrokeColor(run.status),
          fill: this.getRunStatusFillColor(run.status),
          runid: run.runid,
          status: run.status,
        };
      });
    return data;
  }
  getRunStatusStrokeColor = (status) => {
    switch (status) {
      case PROGRAM_STATUSES.PENDING:
        return PENDINGSTATUSSTROKECOLOR;
      default:
        return MARKSERIESSTROKECOLOR;
    }
  };
  getRunStatusFillColor = (status) => {
    switch (status) {
      case PROGRAM_STATUSES.FAILED:
        return FAILEDRUNCOLOR;
      case PROGRAM_STATUSES.SUCCEEDED:
      case PROGRAM_STATUSES.COMPLETED:
        return SUCCESSRUNCOLOR;
      case PROGRAM_STATUSES.RUNNING:
      case PROGRAM_STATUSES.STARTING:
        return RUNNINGSTATUSCOLOR;
      case PROGRAM_STATUSES.PENDING:
        return PENDINGSTATUSFILLCOLOR;
      default:
        return MARKSERIESSTROKECOLOR;
    }
  };
  renderEmptyMessage() {
    return (
      <EmptyMessageContainer
        xDomainType={this.props.xDomainType}
        label={this.props.activeFilterLabel}
      />
    );
  }
  navigateToPipeline(runid) {
    const anchor = document.getElementById('placeholder-anchor-runs-history');
    const { namespaceId: namespace, appId: pipelineId } = this.props.runContext;
    const url = window.getHydratorUrl({
      stateName: 'hydrator.detail',
      stateParams: {
        namespace,
        pipelineId,
      },
    });
    anchor.href = `${url}?runid=${runid}`;
    anchor.click();
  }
  renderChart() {
    const FPlot = makeVisFlexible(XYPlot);
    const { tickTotals, yDomain, tickFormat } = getYAxisProps(this.state.data);
    const yAxisResolution = getTimeResolution(yDomain.y);
    let xDomain = [];
    if (this.state.data.length > 0) {
      xDomain = getXDomain(this.props);
    }
    let popOverData;
    if (this.state.currentHoveredElement) {
      popOverData = this.props.runs.find(
        (run) => this.state.currentHoveredElement.runid === run.runid
      );

      popOverData.duration = popOverData.duration ? popOverData.duration : 0;
    }
    if (this.props.isLoading) {
      return (
        <div className="empty-runs-container">
          <IconSVG name="icon-spinner" className="fa-spin" />
        </div>
      );
    }
    return (
      <div className="graph-plot-container">
        <FPlot
          xType="linear"
          yType="linear"
          xDomain={xDomain}
          yDomain={yDomain}
          className="run-history-fp-plot"
        >
          <DiscreteColorLegend
            orientation="horizontal"
            items={COLORLEGENDS}
            className="run-history-legend-container"
          />
          <XAxis
            tickTotal={getTicksTotal(this.props)}
            tickFormat={xTickFormat(this.props)}
          />
          <YAxis tickTotal={tickTotals} tickFormat={tickFormat} />
          <HorizontalGridLines />
          <LineSeries stroke={LINECOLOR} data={this.state.data} />
          <MarkSeries
            colorType="literal"
            strokeType="literal"
            fillType="literal"
            data={this.state.data}
            onValueMouseOver={(d) => {
              if (
                objectQuery(this.state.currentHoveredElement, 'runid') ===
                d.runid
              ) {
                return;
              }
              const newData = this.state.data.map((datum) => {
                if (datum.runid === d.runid) {
                  return {
                    ...datum,
                    fill: HOVERCOLOR,
                  };
                }
                return datum;
              });
              this.setState({
                currentHoveredElement: d,
                data: newData,
              });
            }}
            onValueMouseOut={() => {
              const newData = this.state.data.map((datum) => {
                return {
                  ...datum,
                  fill: this.getRunStatusFillColor(datum.status),
                };
              });
              this.setState({
                currentHoveredElement: null,
                data: newData,
              });
            }}
            onValueClick={(d) => {
              this.navigateToPipeline(d.runid);
            }}
          />

          {this.state.currentHoveredElement && popOverData ? (
            <Hint value={this.state.currentHoveredElement}>
              <div className="title">
                <h4>{T.translate(`${PREFIX}.hint.title`)}</h4>
                <IconSVG
                  name="icon-close"
                  onClick={(e) => {
                    const newData = this.state.data.map((datum) => {
                      return {
                        ...datum,
                        fill: this.getRunStatusFillColor(datum.status),
                      };
                    });
                    this.setState({
                      currentHoveredElement: null,
                      data: newData,
                    });
                    preventPropagation(e);
                  }}
                />
              </div>
              <div className="log-stats">
                <div>
                  <span>{T.translate(`${PREFIX}.hint.duration`)}</span>
                  <span>
                    {popOverData.duration < ONE_MIN_SECONDS
                      ? `${popOverData.duration} seconds`
                      : humanReadableDuration(popOverData.duration)}
                  </span>
                </div>
                <div>
                  <span>{T.translate(`${PREFIX}.hint.status`)}</span>
                  <span
                    className={classnames({
                      'text-danger':
                        ['FAILED', 'KILLED', 'RUN_FAILED'].indexOf(
                          popOverData.status
                        ) !== -1,
                      'text-success':
                        ['FAILED', 'KILLED', 'RUN_FAILED'].indexOf(
                          popOverData.status
                        ) === -1,
                    })}
                  >
                    {StatusMapper.lookupDisplayStatus(popOverData.status)}
                  </span>
                </div>
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
            {T.translate(`${PREFIX}.yAxisTitle`, {
              resolution: yAxisResolution,
            })}
          </div>
        </FPlot>
      </div>
    );
  }
  renderTableBody(runs) {
    const runsLength = runs.length;

    return (
      <table className="table">
        <tbody>
          {runs.map((run) => {
            const startTime = moment(run.starting * 1000).format('llll');
            const duration = humanReadableDuration(run.duration || 0);

            return (
              <tr>
                <td>
                  <span>{runsLength - run.index + 1}</span>
                  <CopyableID id={run.runid} idprefix="runs-history" />
                </td>
                <td>
                  <span
                    className={classnames({
                      'text-danger':
                        ['FAILED', 'KILLED', 'RUN_FAILED'].indexOf(
                          run.status
                        ) !== -1,
                      'text-success':
                        ['FAILED', 'KILLED', 'RUN_FAILED'].indexOf(
                          run.status
                        ) === -1,
                    })}
                  >
                    {StatusMapper.lookupDisplayStatus(run.status)}
                  </span>
                </td>
                <td> {startTime}</td>
                <td> {duration}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  renderTable() {
    return (
      <SortableStickyTable
        tableHeaders={tableHeaders}
        entities={this.props.runs.map((run, i) =>
          Object.assign({}, run, { index: i + 1 })
        )}
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
        className="runs-history-graph"
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
        <a id="placeholder-anchor-runs-history" />
      </div>
    );
  }
}
RunsHistoryGraph.propTypes = {
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
