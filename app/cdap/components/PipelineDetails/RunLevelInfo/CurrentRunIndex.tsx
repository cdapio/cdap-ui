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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconSVG from 'components/shared/IconSVG';
import { reverseArrayWithoutMutating, objectQuery } from 'services/helpers';
import findIndex from 'lodash/findIndex';
import {
  getAppVersion,
  getRunsForVersion,
  init,
  setCurrentRunId,
  getRunDetails,
  updateRunDetails,
} from 'components/PipelineDetails/store/ActionCreator';
import T from 'i18n-react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';
import Popover from 'components/shared/Popover';
import { GLOBALS, PROGRAM_ENDSTATES } from 'services/global-constants';
import { getDataTestid } from '@cdap-ui/testids/TestidsProvider';
import { IconButton } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { copyToClipBoard } from 'services/Clipboard';
import { getCdapConfig } from 'services/helpers';

const PREFIX = 'features.PipelineDetails.RunLevel';
const TESTID_PREFIX = 'features.pipelineDetails.runLevel';
const CONFIG_DEFAULT_POLL_RUNS_INTERVAL_MS = 'defaultPollIntervalMs';

const StyledNoRunsHeader = styled.div`
  display: flex;
  > * {
    padding-left: 5px;
  }
`;

const StyledPointerA = styled.a`
  cursor: pointer;
`;

const CopyButtonContainer = styled.span`
  height: 16px;
  margin-left: 8px;
  vertical-align: baseline;

  button,
  svg {
    height: 14px;
    width: 14px;
  }

  button {
    margin-top: -4px;
  }
`;

const mapStateToProps = (state) => {
  return {
    pipelineName: state.name,
    runsCount: state.runsCount,
    runs: state.runs,
    currentRun: state.currentRun,
    versionHasRun: state.versionHasRun,
    version: state.version,
    artifactName: state.artifact.name,
  };
};

interface ICurrentRun extends Object {
  runid: string;
  status: string;
}

interface ICurrentRunIndexProps {
  runs: any[];
  runsCount: number;
  currentRun: ICurrentRun;
  pipelineName: string;
  versionHasRun: boolean;
  version: string;
  artifactName: string;
}

const CurrentRunIndex = ({
  runs,
  currentRun,
  runsCount,
  pipelineName,
  versionHasRun,
  version,
  artifactName,
}: ICurrentRunIndexProps) => {
  const namespace = getCurrentNamespace();
  const reversedRuns = reverseArrayWithoutMutating(runs);
  const currentRunIndex = findIndex(reversedRuns, { runid: objectQuery(currentRun, 'runid') });
  // The currentRunIndex is the index in latest 100 runs
  // total runs count would be much higher for pipelines that ran more than 100 runs
  const runIndexInTotalRunsCount = Math.max(
    currentRunIndex,
    runsCount - (runs.length - currentRunIndex)
  );

  const runLimit = Number(window.CDAP_CONFIG.cdap.runRecordsTtl) || 0;

  const pipelineLink = getHydratorUrl({
    stateName: 'hydrator.detail',
    stateParams: {
      namespace,
      pipelineId: pipelineName,
    },
  });

  const navigateToLatestRunVersion = (latestRunVersion) => {
    window.localStorage.setItem('pipelineHistoryVersion', latestRunVersion);
    window.location.href = pipelineLink;
  };

  useEffect(() => {
    const params = {
      namespace,
      appId: pipelineName,
      versionId: version,
      programType: GLOBALS.programInfo[artifactName].programType,
      programName: GLOBALS.programInfo[artifactName].programName,
      limit: 1,
    };
    const interval = setInterval(() => {
      getRunsForVersion(params, clearPollInterval);
    }, getCdapConfig(CONFIG_DEFAULT_POLL_RUNS_INTERVAL_MS, 10000));

    function clearPollInterval() {
      if (interval) {
        clearInterval(interval);
      }
    }

    // Avoid the delay caused by the interval by calling the API early
    // if this succeeds, we clear the interval and avoid further polling
    getRunsForVersion(params, clearPollInterval);

    // if the version changes, clear the old interval before running this
    // effect again
    return clearPollInterval;
  }, [version]);

  // if the currentRun is not in a finished state, then poll the currentRun for
  // status changes
  useEffect(() => {
    if (!currentRun?.runid || PROGRAM_ENDSTATES.includes(currentRun.status)) {
      clearPollInterval();
      return;
    }

    const params = {
      namespace,
      appId: pipelineName,
      versionId: version,
      programType: GLOBALS.programInfo[artifactName].programType,
      programName: GLOBALS.programInfo[artifactName].programName,
      runid: currentRun.runid,
    };

    const interval = setInterval(() => {
      updateRunDetails(params, clearPollInterval);
    }, getCdapConfig(CONFIG_DEFAULT_POLL_RUNS_INTERVAL_MS, 10000));

    function clearPollInterval() {
      if (interval) {
        clearInterval(interval);
      }
    }

    // Avoid the delay caused by the interval by calling the API early
    // if this succeeds, we clear the interval and avoid further polling
    updateRunDetails(params, clearPollInterval);

    // if the current runid changes, clear the old interval before running this
    // effect again
    return clearPollInterval;
  }, [currentRun?.runid]);

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

  if (!versionHasRun) {
    return (
      <div className="run-number-container run-info-container">
        <StyledNoRunsHeader>
          <h4 className="run-number">{T.translate(`${PREFIX}.noRuns`)}</h4>
          <Popover
            target={() => <IconSVG name="icon-info-circle" />}
            showOn="Hover"
            placement="bottom"
          >
            {T.translate(`${PREFIX}.noRunsDesc`)}
          </Popover>
        </StyledNoRunsHeader>
        <div className="run-number-switches">
          <StyledPointerA
            onClick={() => {
              navigateToLatestRunVersion(reversedRuns[currentRunIndex].version);
            }}
          >
            {T.translate(`${PREFIX}.goToLatestRun`)}
          </StyledPointerA>
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
    if (reversedRuns[runIndex].version) {
      getAppVersion({
        namespace,
        appId: pipelineName,
        version: reversedRuns[runIndex].version,
      }).subscribe(
        (res) => {
          init(res);
        },
        (err) => {
          // tslint:disable-next-line:no-console
          console.log(err);
        },
        () => {
          setCurrentRunId(runid);
        }
      );
      return;
    }
    setCurrentRunId(runid);
  };

  function copyCurrentRunId() {
    copyToClipBoard(currentRun.runid);
  }

  return (
    <div className="run-number-container run-info-container">
      <h4
        className="run-number"
        title={
          runLimit > 0
            ? T.translate(`${PREFIX}.tooltipRunLimit`, {
                runLimit,
              }).toString()
            : ''
        }
        data-testid={getDataTestid(`${TESTID_PREFIX}.currentRunIndex`)}
      >
        {T.translate(`${PREFIX}.currentRunIndex`, {
          currentRunIndex: runIndexInTotalRunsCount + 1,
          numRuns: runsCount,
        })}
        {runsCount > 0 && (
          <CopyButtonContainer>
            <IconButton
              onClick={copyCurrentRunId}
              title="Copy current run ID to clipboard"
              size="small"
            >
              <FileCopyOutlinedIcon fontSize="small" />
            </IconButton>
          </CopyButtonContainer>
        )}
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
