/*
 * Copyright © 2024 Cask Data, Inc.
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

import React, { useEffect, useState } from 'react';
import T from 'i18n-react';
import { useSelector, Provider, useDispatch } from 'react-redux';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import GetAppIcon from '@material-ui/icons/GetApp';
import styled from 'styled-components';
import PipelineMetricsStore from 'services/PipelineMetricsStore';
import PipelineLogViewer from '../RunLevelInfo/PipelineLogViewer';
import ThemeWrapper from 'components/ThemeWrapper';
import { ACTIONS } from '../store';
import { MyPipelineApi } from 'api/pipeline';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { getDataTestid } from '@cdap-ui/testids/TestidsProvider';
import ProgramDataFetcher from 'components/LogViewer/DataFetcher/ProgramDataFetcher';
import { GLOBALS } from 'services/global-constants';
import { getDownloadLogsUrl } from 'components/LogViewer/LogsUrlUtils';
import { delay } from '@cdap-ui/utils/time';

const PREFIX = 'features.PipelineDetails.ErrorDetails';
const TEST_PREFIX = 'features.pipelineDetails.errorDetails';
const RETRY_DELAY_MS = 10 * 1000;

const PipelineRunErrorDetailsWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.palette.red[100]};
  position: relative;
  color: ${({ theme }) => theme.palette.white[50]};
`;

const ShortErrorMessage = styled.div`
  width: 100%;
  display: flex;
  padding: 0 20px;
  gap: 40px;
  align-items: center;
  justify-content: space-between;

  p {
    margin: 0;
  }
`;

const ErrorDetailsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.palette.red[600]};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
  color: ${({ theme }) => theme.palette.grey[50]};

  p {
    margin: 0;
  }

  .LogViewerContainer-logsContainer-60 {
    top: 140px;
  }

  a[target='_blank'] > svg {
    font-size: 10px;
  }

  .alt-color-column {
    background: ${({ theme }) => theme.palette.grey[600]};
  }

  pre {
    width: 40vw;
    border: none;
    background: transparent;
    min-height: 40px;
    max-height: 120px;
    overflow: auto;
    white-space: pre-wrap;
  }
`;

const ErrorImprovementMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
`;

const LogsButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
`;

const TdClassesOverride = {
  root: 'alt-color-column',
};

const PipelineErrorCountMessage = ({ classifiedErrorCount }) => {
  return (
    <p data-testid={getDataTestid(`${TEST_PREFIX}.errorCountMessage`)}>
      {T.translate(`${PREFIX}.errorCountMessage`, {
        context: classifiedErrorCount || 0,
      })}
    </p>
  );
};

interface IErrorEntry {
  errorCategory: string;
  errorMessage: string;
  errorReason: string;
  stageName: string;
  supportedDocumentationUrl?: string;
}

export default function PipelineRunErrorDetails() {
  const [detailsExpanded, setDetailsExpanded] = useState<boolean>(false);
  const [logsOpened, setLogsOpened] = useState<boolean>(false);

  const appId = useSelector((state) => state.name);
  const artifactName = useSelector((state) => state.artifact.name);
  const currentRun = useSelector((state) => state.currentRun);
  const runid = currentRun?.runid;
  const loading = useSelector((state) => state.runErrorDetailsLoading[runid] || false);
  const errorDetails = useSelector((state) => state.runErrorDetails[runid]);
  const canExapndErrorDetails = !!errorDetails?.length;

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

  function toggleErrorDetails() {
    setDetailsExpanded((x) => !x);
  }

  useEffect(() => {
    document.body.classList.add('with-error-banner');

    return () => {
      document.body.classList.remove('with-error-banner');
    };
  }, []);

  function fetchErrorDetails() {
    if (loading) {
      return;
    }

    setLoading(true);
    // POST `/namespaces/:namespace/apps/:appid/:programType/:programName/runs/:runid/classify?isPreview`
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

  function viewLogs() {
    setDetailsExpanded(false);
    setLogsOpened(true);
  }

  function toggleLogs() {
    setLogsOpened((x) => !x);
  }

  useEffect(() => {
    if (!errorDetails && !loading && currentRun?.status === 'FAILED') {
      fetchErrorDetails();
    }
  }, [runid, currentRun?.status, errorDetails, loading]);

  function renderWithLink(strToRender, link) {
    if (strToRender.indexOf(link) < 0) {
      return <pre>{strToRender}</pre>;
    }

    const chunks = strToRender.split(link);
    const nodes = [chunks[0]];
    for (let i = 1; i < chunks.length; i++) {
      nodes.push(
        <a href={link} target="_blank">
          {link} <LaunchIcon fontSize="small" />
        </a>
      );
      nodes.push(chunks[i]);
    }

    return <pre>{nodes}</pre>;
  }

  if (currentRun?.status !== 'FAILED' || loading) {
    return null;
  }

  return (
    <ThemeWrapper>
      <PipelineRunErrorDetailsWrapper>
        <Provider store={PipelineMetricsStore}>
          <ShortErrorMessage>
            <PipelineErrorCountMessage classifiedErrorCount={errorDetails?.length} />
            {canExapndErrorDetails ? (
              <Button
                color="inherit"
                onClick={toggleErrorDetails}
                data-testid={getDataTestid(
                  detailsExpanded
                    ? `${TEST_PREFIX}.closeButton`
                    : `${TEST_PREFIX}.viewDetailsButton`
                )}
              >
                {detailsExpanded
                  ? T.translate(`${PREFIX}.closeButton`)
                  : T.translate(`${PREFIX}.viewDetailsButton`)}
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={toggleLogs}
                data-testid={getDataTestid(`${TEST_PREFIX}.viewLogsButton`)}
              >
                {logsOpened
                  ? T.translate(`${PREFIX}.closeButton`)
                  : T.translate(`${PREFIX}.viewLogsButton`)}
              </Button>
            )}
          </ShortErrorMessage>
          {detailsExpanded && (
            <ErrorDetailsContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{T.translate(`${PREFIX}.errorCategoryHeader`)}</TableCell>
                    <TableCell classes={TdClassesOverride}>
                      {T.translate(`${PREFIX}.errorReasonHeader`)}
                    </TableCell>
                    <TableCell>{T.translate(`${PREFIX}.errorMessageHeader`)}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {errorDetails?.map((err) => (
                    <TableRow>
                      <TableCell>{err.errorCategory}</TableCell>
                      <TableCell classes={TdClassesOverride}>
                        {renderWithLink(err.errorReason, err.supportedDocumentationUrl)}
                      </TableCell>
                      <TableCell>
                        {renderWithLink(err.errorMessage, err.supportedDocumentationUrl)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ErrorImprovementMessage>
                {improvementSurveyEnabled ? (
                  <p>
                    {/* TODO (CDAP-21109): Add i18n strings */}
                    Help us improve the error classification. Raise improvement <a href="#">here</a>
                    .
                  </p>
                ) : (
                  <p />
                )}
                <LogsButtonsContainer>
                  <Button
                    color="secondary"
                    href={getDownloadLogsUrl(dataFetcher)}
                    endIcon={<GetAppIcon />}
                    data-testid={getDataTestid(`${TEST_PREFIX}.downloadLogsButton`)}
                  >
                    {T.translate(`${PREFIX}.downloadLogsButton`)}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={viewLogs}
                    data-testid={getDataTestid(`${TEST_PREFIX}.viewLogsButton`)}
                  >
                    {T.translate(`${PREFIX}.viewLogsButton`)}
                  </Button>
                </LogsButtonsContainer>
              </ErrorImprovementMessage>
            </ErrorDetailsContainer>
          )}
        </Provider>
      </PipelineRunErrorDetailsWrapper>
      {logsOpened && <PipelineLogViewer toggleLogViewer={toggleLogs} withErrorBanner={true} />}
    </ThemeWrapper>
  );
}
