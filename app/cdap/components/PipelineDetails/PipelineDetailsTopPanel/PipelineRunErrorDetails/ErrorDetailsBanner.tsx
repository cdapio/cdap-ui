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

import React, { useEffect, useState } from 'react';
import T from 'i18n-react';
import { useSelector, Provider, useDispatch } from 'react-redux';
import styled from 'styled-components';
import _uniq from 'lodash/uniq';

import LaunchIcon from '@material-ui/icons/Launch';
import GetAppIcon from '@material-ui/icons/GetApp';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import { getDataTestid } from '@cdap-ui/testids/TestidsProvider';
import IDataFetcher from 'components/LogViewer/DataFetcher';
import { IErrorEntry } from './types';
import ErrorDetailsBannerUiStore, { ErrorDetailsBannerUiActions } from './uiStateStore';
import ThemeWrapper from 'components/ThemeWrapper';
import PipelineMetricsStore from 'services/PipelineMetricsStore';
import PreviewLogs from 'components/PreviewLogs';
import PipelineDetailStore from 'components/PipelineDetails/store';
import { getCurrentNamespace } from 'services/NamespaceStore';
import PipelineLogViewer from 'components/PipelineDetails/RunLevelInfo/PipelineLogViewer';
import { getDownloadLogsUrl } from 'components/LogViewer/LogsUrlUtils';
import { PREFIX, TEST_PREFIX } from './constants';

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

  .highlighted-table-row {
    border-left: 5px ${({ theme }) => theme.palette.red[200]} solid;
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

const HighlightedTrClassesOverride = {
  root: 'highlighted-table-row',
};

const PipelineErrorCountMessage = ({ classifiedErrorCount, stages }) => {
  if (Array.isArray(stages) && stages.length > 1) {
    return (
      <p data-testid={getDataTestid(`${TEST_PREFIX}.errorCountMessage`)}>
        {T.translate(`${PREFIX}.errorInMultipleStagesMessage`)}
      </p>
    );
  }

  if (Array.isArray(stages) && typeof stages[0] === 'string' && stages[0].length) {
    return (
      <p data-testid={getDataTestid(`${TEST_PREFIX}.errorCountMessage`)}>
        {T.translate(`${PREFIX}.errorInSingleStageMessage`, { stageName: stages[0] })}
      </p>
    );
  }

  return (
    <p data-testid={getDataTestid(`${TEST_PREFIX}.errorCountMessage`)}>
      {T.translate(`${PREFIX}.errorCountMessage`, {
        context: classifiedErrorCount || 0,
      })}
    </p>
  );
};

interface IErrorDetailsBannerViewProps {
  dataFetcher: IDataFetcher;
  hasSurvey?: boolean;
  errorDetails?: IErrorEntry[];
  previewId?: string;
}

function ErrorDetailsBannerView({
  hasSurvey,
  errorDetails,
  dataFetcher,
  previewId = '',
}: IErrorDetailsBannerViewProps) {
  const detailsExpanded = useSelector((state) => state.detailsExpanded);
  const highlightedStage = useSelector((state) => state.highlightedStage);
  const dispatch = useDispatch();

  const [logsOpened, setLogsOpened] = useState<boolean>(false);

  useEffect(() => {
    document.body.classList.add('with-error-banner');

    return () => {
      document.body.classList.remove('with-error-banner');
      dispatch({
        type: ErrorDetailsBannerUiActions.RESET,
      });
    };
  }, []);

  const canExapndErrorDetails = !!errorDetails?.length;

  function toggleErrorDetails() {
    dispatch({
      type: detailsExpanded
        ? ErrorDetailsBannerUiActions.COLLAPSE_ERROR_DETAILS
        : ErrorDetailsBannerUiActions.EXPAND_ERROR_DETAILS,
    });
  }

  function viewLogs() {
    dispatch({ type: ErrorDetailsBannerUiActions.COLLAPSE_ERROR_DETAILS });
    setLogsOpened(true);
  }

  function toggleLogs() {
    setLogsOpened((x) => !x);
  }

  function closeLogs() {
    setLogsOpened(false);
  }

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

  return (
    <ThemeWrapper>
      <PipelineRunErrorDetailsWrapper>
        <Provider store={PipelineMetricsStore}>
          <ShortErrorMessage>
            <PipelineErrorCountMessage
              classifiedErrorCount={errorDetails?.length}
              stages={_uniq(errorDetails?.map((err) => err.stageName)?.filter(Boolean) || [])}
            />
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
            <ClickAwayListener onClickAway={toggleErrorDetails}>
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
                      <TableRow
                        classes={
                          err.stageName === highlightedStage ? HighlightedTrClassesOverride : {}
                        }
                      >
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
                  {hasSurvey ? (
                    <p>
                      {/* TODO (CDAP-21109): Add i18n strings */}
                      Help us improve the error classification. Raise improvement{' '}
                      <a href="#">here</a>.
                    </p>
                  ) : (
                    <p />
                  )}
                  <LogsButtonsContainer>
                    <Button
                      color="secondary"
                      href={getDownloadLogsUrl(dataFetcher)}
                      target="_blank"
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
            </ClickAwayListener>
          )}
        </Provider>
      </PipelineRunErrorDetailsWrapper>
      {logsOpened &&
        (previewId ? (
          <PreviewLogs
            namespace={getCurrentNamespace()}
            previewId={previewId}
            onClose={closeLogs}
          />
        ) : (
          <Provider store={PipelineDetailStore}>
            <PipelineLogViewer toggleLogViewer={toggleLogs} />
          </Provider>
        ))}
    </ThemeWrapper>
  );
}

export default function ErrorDetailsBanner(props: IErrorDetailsBannerViewProps) {
  return (
    <Provider store={ErrorDetailsBannerUiStore}>
      <ErrorDetailsBannerView {...props} />
    </Provider>
  );
}
