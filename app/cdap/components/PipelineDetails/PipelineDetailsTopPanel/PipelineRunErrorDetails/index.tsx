/*
 * Copyright © 2025 Cask Data, Inc.
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
import { useSelector, useDispatch } from 'react-redux';

import PipelineDetailStore, { ACTIONS } from '../../store';
import { MyPipelineApi } from 'api/pipeline';
import { getCurrentNamespace } from 'services/NamespaceStore';
import ProgramDataFetcher from 'components/LogViewer/DataFetcher/ProgramDataFetcher';
import { GLOBALS } from 'services/global-constants';
import { delay } from '@cdap-ui/utils/time';
import { IErrorEntry } from './types';
import { RETRY_DELAY_MS } from './constants';
import ErrorDetailsBanner from './ErrorDetailsBanner';

export function isErrorClassificationBannerDisplayed(pipelineDetailsState) {
  const { currentRun, runErrorDetailsLoading } = pipelineDetailsState;
  const runid = currentRun?.runid;
  const loading = runErrorDetailsLoading[runid] || false;
  return currentRun?.status === 'FAILED' && !loading;
}

export default function PipelineRunErrorDetails() {
  const appId = useSelector((state) => state.name);
  const artifactName = useSelector((state) => state.artifact.name);
  const currentRun = useSelector((state) => state.currentRun);
  const runid = currentRun?.runid;
  const loading = useSelector((state) => state.runErrorDetailsLoading[runid] || false);
  const errorDetails = useSelector((state) => state.runErrorDetails[runid]) as
    | IErrorEntry[]
    | undefined;

  const dispatch = useDispatch();
  function setLoading(value: boolean) {
    dispatch({
      type: ACTIONS.SET_RUN_ERROR_DETAILS_LOADING,
      payload: {
        runid,
        value,
      },
    });
  }

  function setErrorDetails(errors: IErrorEntry[]) {
    dispatch({
      type: ACTIONS.SET_RUN_ERROR_DETAILS,
      payload: {
        runid,
        errors,
      },
    });
  }

  const dataFetcher = new ProgramDataFetcher({
    namespace: getCurrentNamespace(),
    application: appId,
    programType: GLOBALS.programType[artifactName],
    programName: GLOBALS.programId[artifactName],
    runId: runid,
  });

  // TODO [CDAP-21109](https://cdap.atlassian.net/browse/CDAP-21109): add feature flag here
  const improvementSurveyEnabled = false;

  function fetchErrorDetails() {
    if (loading) {
      return;
    }

    setLoading(true);
    MyPipelineApi.getRunErrorDetails({
      namespace: getCurrentNamespace(),
      appId,
      programType: 'workflows',
      programName: 'DataPipelineWorkflow',
      runid,
    }).subscribe(
      (res: IErrorEntry[]) => {
        setErrorDetails(res);
        setLoading(false);
      },
      async (err) => {
        // In case of API error, wait 10s before retrying
        setErrorDetails(null);
        await delay(RETRY_DELAY_MS);
        setLoading(false);
      }
    );
  }

  useEffect(() => {
    if (!errorDetails && !loading && currentRun?.status === 'FAILED') {
      fetchErrorDetails();
    }
  }, [runid, currentRun?.status, errorDetails, loading]);

  if (currentRun?.status !== 'FAILED' || loading) {
    return null;
  }

  return (
    <ErrorDetailsBanner
      hasSurvey={improvementSurveyEnabled}
      dataFetcher={dataFetcher}
      errorDetails={errorDetails}
    />
  );
}
