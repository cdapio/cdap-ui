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

import React, { useEffect } from 'react';
import T from 'i18n-react';
import { useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { SearchBox } from '../SearchBox';
import {
  FailStatusDiv,
  FiltersAndStatusWrapper,
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
  setRemoteLoadingMessage,
  setRemoteNameFilter,
  setRemotePipelines,
  toggleRemoteShowFailedOnly,
  pullAndDeployMultipleSelectedRemotePipelines,
  fetchLatestOperation,
  setRemoteSyncStatusFilter,
  setSyncStatusOfAllPipelines,
  refetchAllPipelines,
  dismissOperationAlert,
} from '../store/ActionCreator';
import { LoadingAppLevel } from 'components/shared/LoadingAppLevel';
import { getCurrentNamespace } from 'services/NamespaceStore';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';
import { SUPPORT } from 'components/StatusButton/constants';
import { IListResponse, IOperationMetaResponse, IOperationRun } from '../types';
import Alert from 'components/shared/Alert';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import { parseOperationResource } from '../helpers';
import { OperationAlert } from '../OperationAlert';
import { SyncStatusFilters } from '../SyncStatusFilters';

const PREFIX = 'features.SourceControlManagement.pull';

interface IRemotePipelineListViewProps {
  redirectOnSubmit?: boolean;
  singlePipelineMode?: boolean;
}

export const RemotePipelineListView = ({
  redirectOnSubmit,
  singlePipelineMode,
}: IRemotePipelineListViewProps) => {
  const {
    ready,
    remotePipelines,
    nameFilter,
    selectedPipelines,
    loadingMessage,
    showFailedOnly,
    pullViewErrorMsg,
    syncStatusFilter,
  } = useSelector(({ pull }) => pull);

  const { running: isAnOperationRunning, operation, showLastOperationInfo } = useSelector(
    ({ operationRun }) => operationRun
  );

  const multiPullEnabled =
    useFeatureFlagDefaultFalse('source.control.management.multi.app.enabled') &&
    !singlePipelineMode;
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
          refetchAllPipelines();
          setSyncStatusOfAllPipelines();
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
        refetchAllPipelines();
        setSyncStatusOfAllPipelines();
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
            multiPullEnabled={multiPullEnabled}
            disabled={isAnOperationRunning}
            syncStatusFilter={syncStatusFilter}
            lastOperationInfoShown={showLastOperationInfo}
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

  return (
    <>
      <Alert
        showAlert={!!pullViewErrorMsg}
        message={pullViewErrorMsg}
        type={'error'}
        onClose={() => setPullViewErrorMsg()}
      />
      <PipelineListContainer>
        {operation && multiPullEnabled && showLastOperationInfo && (
          <OperationAlert operation={operation} onClose={dismissOperationAlert} />
        )}
        <SearchBox nameFilter={nameFilter} setNameFilter={setRemoteNameFilter} />
        <FiltersAndStatusWrapper>
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
          {multiPullEnabled && (
            <SyncStatusFilters
              syncStatusFilter={syncStatusFilter}
              setSyncStatusFilter={setRemoteSyncStatusFilter}
            />
          )}
        </FiltersAndStatusWrapper>
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
