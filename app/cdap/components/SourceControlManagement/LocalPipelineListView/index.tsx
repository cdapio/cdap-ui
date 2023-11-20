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

import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentNamespace } from 'services/NamespaceStore';
import {
  countPushFailedPipelines,
  dismissOperationAlert,
  fetchLatestOperation,
  getNamespacePipelineList,
  pushMultipleSelectedPipelines,
  pushSelectedPipelines,
  refetchAllPipelines,
  resetPushStatus,
  setLoadingMessage,
  setLocalPipelines,
  setNameFilter,
  setSyncStatusFilter,
  setSyncStatusOfAllPipelines,
  setSyncStatusOfRemotePipelines,
  toggleCommitModal,
  toggleShowFailedOnly,
} from '../store/ActionCreator';
import { SearchBox } from '../SearchBox';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import T from 'i18n-react';
import { CommitModal } from './CommitModal';
import cloneDeep from 'lodash/cloneDeep';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import { LocalPipelineTable } from './PipelineTable';
import { useOnUnmount } from 'services/react/customHooks/useOnUnmount';
import {
  FailStatusDiv,
  FiltersAndStatusWrapper,
  PipelineListContainer,
  StyledSelectionStatusDiv,
} from '../styles';
import { IListResponse, IOperationMetaResponse, IOperationRun } from '../types';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import { parseOperationResource } from '../helpers';
import { OperationAlert } from '../OperationAlert';
import { SyncStatusFilters } from '../SyncStatusFilters';

const PREFIX = 'features.SourceControlManagement.push';

export const LocalPipelineListView = () => {
  const {
    ready,
    localPipelines,
    nameFilter,
    selectedPipelines,
    commitModalOpen,
    loadingMessage,
    showFailedOnly,
    syncStatusFilter,
  } = useSelector(({ push }) => push);

  const { running: isAnOperationRunning, operation, showLastOperationInfo } = useSelector(
    ({ operationRun }) => operationRun
  );

  const multiPushEnabled = useFeatureFlagDefaultFalse(
    'source.control.management.multi.app.enabled'
  );
  const pushFailedCount = countPushFailedPipelines();

  useEffect(() => {
    if (!ready) {
      getNamespacePipelineList(getCurrentNamespace(), nameFilter);
    }
  }, [ready]);

  useEffect(() => {
    if (multiPushEnabled) {
      fetchLatestOperation(getCurrentNamespace());
    }
  }, []);

  const onPushSubmit = (commitMessage: string) => {
    resetPushStatus();
    const pushedPipelines = cloneDeep(localPipelines);
    const payload = {
      commitMessage,
    };
    toggleCommitModal();
    if (multiPushEnabled) {
      pushMultipleSelectedPipelines(
        getCurrentNamespace(),
        selectedPipelines,
        payload,
        setLoadingMessage
      ).subscribe({
        next(res: IOperationMetaResponse) {
          const resources = res.resources.map(parseOperationResource);
          const resourceNames = resources.map(({ name }) => name);
          pushedPipelines.forEach((pipeline) => {
            if (resourceNames.includes(pipeline.name)) {
              pipeline.status = res.status;
            }
          });
          setLocalPipelines(pushedPipelines);
        },
        complete() {
          setLoadingMessage(null);
          refetchAllPipelines();
          setSyncStatusOfAllPipelines();
        },
      });

      return;
    }

    pushSelectedPipelines(
      getCurrentNamespace(),
      selectedPipelines,
      payload,
      setLoadingMessage
    ).subscribe({
      next(res: IListResponse) {
        const currentPipeline = pushedPipelines.find((pipeline) => pipeline.name === res.name);
        currentPipeline.status = res.status;
        currentPipeline.error = res.message;
        if (res.fileHash) {
          currentPipeline.fileHash = res.fileHash;
        }
        setLocalPipelines(pushedPipelines);
      },
      complete() {
        setLoadingMessage(null);
        refetchAllPipelines();
        setSyncStatusOfAllPipelines();
      },
    });
  };

  const LocalPipelineTableComp = () => {
    if (localPipelines.length > 0) {
      return (
        <>
          <LocalPipelineTable
            localPipelines={localPipelines}
            selectedPipelines={selectedPipelines}
            showFailedOnly={showFailedOnly}
            multiPushEnabled={multiPushEnabled}
            disabled={isAnOperationRunning}
            syncStatusFilter={syncStatusFilter}
            lastOperationInfoShown={showLastOperationInfo}
          />
          <PrimaryContainedButton
            onClick={toggleCommitModal}
            size="large"
            disabled={isAnOperationRunning || !selectedPipelines.length}
            data-testid="remote-push-button"
          >
            {T.translate(`${PREFIX}.pushButton`)}
          </PrimaryContainedButton>
        </>
      );
    }
    return <div>{T.translate(`${PREFIX}.emptyPipelineListMessage`, { query: nameFilter })}</div>;
  };

  return (
    <PipelineListContainer>
      {operation && multiPushEnabled && showLastOperationInfo && (
        <OperationAlert operation={operation} onClose={dismissOperationAlert} />
      )}
      <SearchBox nameFilter={nameFilter} setNameFilter={setNameFilter} />
      <FiltersAndStatusWrapper>
        {selectedPipelines.length > 0 && (
          <StyledSelectionStatusDiv>
            <div>
              {T.translate(`${PREFIX}.pipelinesSelected`, {
                selected: selectedPipelines.length,
                total: localPipelines.length,
              })}
            </div>
            {!multiPushEnabled && pushFailedCount > 0 && (
              <>
                <FailStatusDiv>
                  {pushFailedCount === 1
                    ? T.translate(`${PREFIX}.pipelinePushedFail`)
                    : T.translate(`${PREFIX}.pipelinesPushedFail`, {
                        count: pushFailedCount.toString(),
                      })}
                </FailStatusDiv>
                <PrimaryTextButton onClick={toggleShowFailedOnly}>
                  {showFailedOnly
                    ? T.translate('commons.showAll')
                    : T.translate('commons.showFailed')}
                </PrimaryTextButton>
              </>
            )}
            {multiPushEnabled && pushFailedCount > 0 && (
              <FailStatusDiv>{T.translate(`${PREFIX}.pipelinesPushedFailMulti`)}</FailStatusDiv>
            )}
          </StyledSelectionStatusDiv>
        )}
        {multiPushEnabled && (
          <SyncStatusFilters
            syncStatusFilter={syncStatusFilter}
            setSyncStatusFilter={setSyncStatusFilter}
          />
        )}
      </FiltersAndStatusWrapper>
      {ready ? LocalPipelineTableComp() : <LoadingSVGCentered />}
      <CommitModal
        isOpen={commitModalOpen}
        onToggle={toggleCommitModal}
        onSubmit={onPushSubmit}
        loadingMessage={loadingMessage}
        enableMultiplePush={multiPushEnabled}
      />
    </PipelineListContainer>
  );
};
