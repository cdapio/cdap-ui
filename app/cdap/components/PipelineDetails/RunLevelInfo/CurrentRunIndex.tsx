/*
 * Copyright © 2022 Cask Data, Inc.
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

import React from 'react';
import { connect } from 'react-redux';
import IconSVG from 'components/shared/IconSVG';
import { reverseArrayWithoutMutating, objectQuery } from 'services/helpers';
import findIndex from 'lodash/findIndex';
import { setCurrentRunId } from 'components/PipelineDetails/store/ActionCreator';
import T from 'i18n-react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';

const PREFIX = 'features.PipelineDetails.RunLevel';

const mapStateToProps = (state) => {
  return {
    pipelineName: state.name,
    runsCount: state.runsCount,
    runs: state.runs,
    currentRun: state.currentRun,
  };
};

interface ICurrentRunIndexProps {
  runs: any[];
  runsCount: number;
  currentRun: object;
  pipelineName: string;
}

const CurrentRunIndex = ({ runs, currentRun, runsCount, pipelineName }: ICurrentRunIndexProps) => {
  const reversedRuns = reverseArrayWithoutMutating(runs);
  const currentRunIndex = findIndex(reversedRuns, { runid: objectQuery(currentRun, 'runid') });
  // The currentRunIndex is the index in latest 100 runs
  // total runs count would be much higher for pipelines that ran more than 100 runs
  const runIndexInTotalRunsCount = Math.max(
    currentRunIndex,
    runsCount - (runs.length - currentRunIndex)
  );

  if (!reversedRuns || currentRunIndex === -1) {
    return (
      <div className="run-number-container run-info-container">
        <h4 className="run-number">{T.translate(`${PREFIX}.noRuns`)}</h4>
        <div className="run-number-switches">
          <button disabled>
            <IconSVG name="icon-caret-left" />
          </button>
          <button disabled>
            <IconSVG name="icon-caret-right" />
          </button>
        </div>
      </div>
    );
  }

  let previousRunId;
  let nextRunId;
  const previousRunIndex = currentRunIndex - 1;
  const nextRunIndex = currentRunIndex + 1;
  if (currentRunIndex > 0) {
    previousRunId = reversedRuns[previousRunIndex].runid;
  }
  if (currentRunIndex < reversedRuns.length - 1) {
    nextRunId = reversedRuns[nextRunIndex].runid;
  }

  const setRunIdAndNavigate = (runid, runIndex) => {
    setCurrentRunId(runid);
    const pipelineLink = getHydratorUrl({
      stateName: 'hydrator.detail',
      stateParams: {
        namespace: getCurrentNamespace(),
        pipelineId: pipelineName,
        runid,
      },
    });
    window.localStorage.setItem('pipelineHistoryVersion', reversedRuns[runIndex].version);
    window.location.href = pipelineLink;
  };

  return (
    <div className="run-number-container run-info-container">
      <h4 className="run-number">
        {T.translate(`${PREFIX}.currentRunIndex`, {
          currentRunIndex: runIndexInTotalRunsCount + 1,
          numRuns: runsCount,
        })}
      </h4>
      <div className="run-number-switches">
        <button
          disabled={!previousRunId}
          onClick={() => {
            setRunIdAndNavigate(previousRunId, previousRunIndex);
          }}
        >
          <IconSVG name="icon-caret-left" />
        </button>
        <button
          disabled={!nextRunId}
          onClick={() => {
            setRunIdAndNavigate(nextRunId, nextRunIndex);
          }}
        >
          <IconSVG name="icon-caret-right" />
        </button>
      </div>
    </div>
  );
};

const ConnectedCurrentRunIndex = connect(mapStateToProps)(CurrentRunIndex);
export default ConnectedCurrentRunIndex;
