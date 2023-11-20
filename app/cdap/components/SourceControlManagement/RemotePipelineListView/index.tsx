/*
 * Copyright © 2023 Cask Data, Inc.
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
import { useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { default as MuiAlert } from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { SearchBox } from '../SearchBox';
import {
  AlertErrorView,
  FailStatusDiv,
  PipelineListContainer,
  StyledSelectionStatusDiv,
} from '../styles';
import { RemotePipelineTable } from './RemotePipelineTable';
import {
  countPullFailedPipelines,
  getRemotePipelineList,
  pullAndDeploySelectedRemotePipelines,
  resetPullStatus,
  setPullViewErrorMsg,
  resetRemote,
  setRemoteLoadingMessage,
  setRemoteNameFilter,
  setRemotePipelines,
  toggleRemoteShowFailedOnly,
  pullAndDeployMultipleSelectedRemotePipelines,
  fetchLatestOperation,
  stopOperation,
} from '../store/ActionCreator';
import { LoadingAppLevel } from 'components/shared/LoadingAppLevel';
import { getCurrentNamespace } from 'services/NamespaceStore';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import { useOnUnmount } from 'services/react/customHooks/useOnUnmount';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';
import { SUPPORT } from 'components/StatusButton/constants';
import { IListResponse, IOperationMetaResponse, IOperationRun } from '../types';
import Alert from 'components/shared/Alert';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import {
  getOperationRunMessage,
  getOperationStartTime,
  getOperationStatusType,
  parseOperationResource,
} from '../helpers';
import Button from '@material-ui/core/Button';
import { OperationStatus } from '../OperationStatus';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const PREFIX = 'features.SourceControlManagement.pull';

interface IRemotePipelineListViewProps {
  redirectOnSubmit?: boolean;
}

export const RemotePipelineListView = ({ redirectOnSubmit }: IRemotePipelineListViewProps) => {
  const [viewErrorExpanded, setViewErrorExpanded] = useState(false);
  const {
    ready,
    remotePipelines,
    nameFilter,
    selectedPipelines,
    loadingMessage,
    showFailedOnly,
    pullViewErrorMsg,
  } = useSelector(({ pull }) => pull);

  const { running: isAnOperationRunning, operation } = useSelector(
    ({ operationRun }) => operationRun
  );

  const multiPullEnabled = useFeatureFlagDefaultFalse(
    'source.control.management.multi.app.enabled'
  );
  const pullFailedCount = countPullFailedPipelines();

  useEffect(() => {
    if (!ready) {
      getRemotePipelineList(getCurrentNamespace());
    }
  }, [ready]);

  useEffect(() => {
    if (multiPullEnabled) {
      fetchLatestOperation(getCurrentNamespace());
    }
  }, []);

  useOnUnmount(() => resetRemote());

  const filteredPipelines = remotePipelines.filter((pipeline) =>
    pipeline.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  const onPullSubmit = () => {
    resetPullStatus();
    const pulledPipelines = cloneDeep(remotePipelines);
    const namespace = getCurrentNamespace();
    if (multiPullEnabled) {
      pullAndDeployMultipleSelectedRemotePipelines(
        getCurrentNamespace(),
        selectedPipelines,
        setRemoteLoadingMessage
      ).subscribe({
        next(res: IOperationMetaResponse) {
          const resources = res.resources.map(parseOperationResource);
          const resourceNames = resources.map(({ name }) => name);
          pulledPipelines.forEach((pipeline) => {
            if (resourceNames.includes(pipeline.name)) {
              pipeline.status = res.status;
            }
          });
          setRemotePipelines(pulledPipelines);
        },
        complete() {
          setRemoteLoadingMessage(null);
        },
      });

      return;
    }

    pullAndDeploySelectedRemotePipelines(
      namespace,
      selectedPipelines,
      setRemoteLoadingMessage
    ).subscribe({
      next(res: IListResponse) {
        const currentPipeline = pulledPipelines.find((pipeline) => pipeline.name === res.name);
        currentPipeline.status = res.status;
        currentPipeline.error = res.message;
        setRemotePipelines(pulledPipelines);
        if (res.status === SUPPORT.yes && redirectOnSubmit) {
          const link = getHydratorUrl({
            stateName: 'hydrator.detail',
            stateParams: {
              namespace,
              pipelineId: res.name,
            },
          });
          window.location.href = link;
        }
      },
      complete() {
        setRemoteLoadingMessage(null);
      },
    });
  };

  const RemotePipelineTableComp = () => {
    if (filteredPipelines.length > 0) {
      return (
        <>
          <RemotePipelineTable
            remotePipelines={filteredPipelines}
            selectedPipelines={selectedPipelines}
            showFailedOnly={showFailedOnly}
            enableMultipleSelection={multiPullEnabled}
            disabled={isAnOperationRunning}
          />
          <PrimaryContainedButton
            size="large"
            disabled={isAnOperationRunning || !selectedPipelines.length}
            data-testid="remote-pull-button"
            onClick={onPullSubmit}
          >
            {T.translate(`${PREFIX}.pullButton`)}
          </PrimaryContainedButton>
        </>
      );
    }
    return <div>{T.translate(`${PREFIX}.emptyPipelineListMessage`, { query: nameFilter })}</div>;
  };

  const getOperationAction = () => {
    if (!operation.done) {
      return (
        <Button
          color="inherit"
          size="small"
          onClick={stopOperation(getCurrentNamespace(), operation)}
        >
          {T.translate(`${PREFIX}.stopOperation`)}
        </Button>
      );
    }

    if (operation.status === OperationStatus.FAILED) {
      return (
        <Button
          color="inherit"
          size="small"
          onClick={() => setViewErrorExpanded((isExpanded) => !isExpanded)}
        >
          {viewErrorExpanded ? <ExpandLess /> : <ExpandMore />}
        </Button>
      );
    }

    return undefined;
  };

  return (
    <>
      <Alert
        showAlert={!!pullViewErrorMsg}
        message={pullViewErrorMsg}
        type={'error'}
        onClose={() => setPullViewErrorMsg()}
      />
      <PipelineListContainer>
        <SearchBox nameFilter={nameFilter} setNameFilter={setRemoteNameFilter} />
        {operation && (
          <MuiAlert
            variant="filled"
            severity={getOperationStatusType(operation)}
            action={getOperationAction()}
          >
            <AlertTitle>{getOperationRunMessage(operation)}</AlertTitle>
            {getOperationStartTime(operation)}
            {operation.status === OperationStatus.FAILED && viewErrorExpanded && (
              <AlertErrorView>
                Operation ID: {operation.id}
                <br />
                Error: {operation.error.message}
              </AlertErrorView>
            )}
          </MuiAlert>
        )}
        {selectedPipelines.length > 0 && (
          <StyledSelectionStatusDiv>
            <div>
              {T.translate(`${PREFIX}.pipelinesSelected`, {
                selected: selectedPipelines.length,
                total: remotePipelines.length,
              })}
            </div>
            {pullFailedCount > 0 && (
              <>
                <FailStatusDiv>
                  {pullFailedCount === 1
                    ? T.translate(`${PREFIX}.pipelinePulledFail`)
                    : T.translate(`${PREFIX}.pipelinesPulledFail`, {
                        count: pullFailedCount.toString(),
                      })}
                </FailStatusDiv>
                <PrimaryTextButton onClick={toggleRemoteShowFailedOnly}>
                  {showFailedOnly
                    ? T.translate('commons.showAll')
                    : T.translate('commons.showFailed')}
                </PrimaryTextButton>
              </>
            )}
          </StyledSelectionStatusDiv>
        )}
        {ready ? RemotePipelineTableComp() : <LoadingSVGCentered />}
      </PipelineListContainer>
      <LoadingAppLevel
        isopen={loadingMessage !== null}
        message={loadingMessage}
        style={{ width: '500px' }}
      />
    </>
  );
};
