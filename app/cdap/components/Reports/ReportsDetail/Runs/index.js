/*
 * Copyright © 2018 Cask Data, Inc.
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GLOBALS } from 'services/global-constants';
import { humanReadableDate, humanReadableDuration } from 'services/helpers';
import { DefaultSelection } from 'components/Reports/store/ActionCreator';
import difference from 'lodash/difference';
import capitalize from 'lodash/capitalize';
import StatusMapper from 'services/StatusMapper';
import T from 'i18n-react';

const PREFIX = 'features.Reports.Customizer.Options';

require('./Runs.scss');

const PIPELINES = [GLOBALS.etlDataPipeline, GLOBALS.etlDataStreams];

function getName(run) {
  if (!run.applicationName) {
    return '--';
  }

  let name = run.applicationName;

  if (PIPELINES.indexOf(run.artifactName) === -1) {
    name = `${name} - ${run.program}`;
  }

  return name;
}

function getType(run) {
  switch (run.artifactName) {
    case GLOBALS.etlDataPipeline:
      return T.translate('features.Reports.ReportsDetail.batch');
    case GLOBALS.etlDataStreams:
      return T.translate('features.Reports.ReportsDetail.realtime');
    default:
      return run.programType;
  }
}

function renderHeader(headers) {
  const nameLabel = T.translate('commons.nameLabel');
  const typeLabel = T.translate('commons.typeLabel');

  return (
    <div className="grid-header">
      <div className="grid-row">
        <div title={nameLabel}>{nameLabel}</div>

        <div title={typeLabel}>{typeLabel}</div>

        {headers.map((head) => {
          const headerLabel = T.translate(`${PREFIX}.${head}`);

          return (
            <div key={`key-${headerLabel}`} title={headerLabel}>
              {headerLabel}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderBody(runs, headers) {
  return (
    <div className="grid-body">
      {runs.map((run, i) => {
        const name = getName(run);
        const type = getType(run);
        return (
          <div key={i} className="grid-row">
            <div title={name}>{name}</div>

            <div title={type}>{type}</div>

            {headers.map((head) => {
              let value = run[head];

              if (['start', 'end'].indexOf(head) !== -1) {
                value = humanReadableDate(value);
              } else if (head === 'duration') {
                value = humanReadableDuration(value);
              } else if (head === 'status') {
                value = StatusMapper.lookupDisplayStatus(value);
              } else if (head === 'startMethod') {
                value = capitalize(value);
              } else if (head === 'runtimeArgs') {
                const keyValuePairs = Object.entries(value).map(
                  (keyValuePair) => {
                    return `${keyValuePair[0]} = ${keyValuePair[1]}`;
                  }
                );

                value = keyValuePairs.join(', ');

                return (
                  <div>
                    <pre title={value} className="runtime-args-row">
                      {value}
                    </pre>
                  </div>
                );
              }

              return (
                <div key={`key-${value}`} title={value || '--'}>
                  {value || '--'}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function getHeaders(request) {
  if (!request.fields) {
    return [];
  }

  const headers = difference(request.fields, DefaultSelection);

  return headers;
}

class RunsView extends Component {
  static propTypes = {
    runs: PropTypes.array,
    request: PropTypes.object,
  };

  componentDidUpdate() {
    this.adjustGridColumnsWidth(this.props.request);
  }

  adjustGridColumnsWidth(request) {
    const headers = getHeaders(request);

    if (!headers.length) {
      return;
    }

    const runtimeArgsIndex = headers.indexOf('runtimeArgs');

    if (runtimeArgsIndex === -1) {
      return;
    }

    /*
      This is to make the width of the 'runtimeArgs' column constant, while
      making the others dynamic. We have to do this in Javascript since we don't
      know in advance what index the 'runtimeArgs' column will be at. For example,
      if the 'runtimeArgs' column is the fifth one (index 4), and there are 7
      columns in total, then the css of the grid-row element would be:
      grid-template-columns: repeat(4, minmax(10px, 1fr)) 300px repeat(2, minmax(10px, 1fr))
    */
    const reportRunsGridRowClass =
      '.reports-runs-container .grid.grid-container .grid-row';
    const reportRunsGridRowElements = document.querySelectorAll(
      reportRunsGridRowClass
    );
    const dynamicColWidth = 'minmax(10px, 1fr)';
    const runtimeArgsColWidth = '300px';
    const numColsAfterRuntimeArgsCol = headers.length - runtimeArgsIndex - 1;
    const gridTemplateColumnsStyle = `repeat(${runtimeArgsIndex +
      2}, ${dynamicColWidth})
       ${runtimeArgsColWidth}
       repeat(${numColsAfterRuntimeArgsCol}, ${dynamicColWidth})
      `;

    reportRunsGridRowElements.forEach((gridRow) => {
      gridRow.style.gridTemplateColumns = gridTemplateColumnsStyle;
    });
  }

  render() {
    const { runs, request } = this.props;
    const headers = getHeaders(request);

    return (
      <div className="reports-runs-container">
        <div className="grid-wrapper">
          <div className="grid grid-container">
            {renderHeader(headers)}
            {renderBody(runs, headers)}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    runs: state.details.runs,
    request: state.details.request,
  };
};

const Runs = connect(mapStateToProps)(RunsView);

export default Runs;
