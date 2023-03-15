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
import { FailStatusDiv, PipelineListContainer, StyledSelectionStatusDiv } from '../styles';
import { RemotePipelineTable } from './RemotePipelineTable';
import {
  countPullFailedPipelines,
  getRemotePipelineList,
  pullAndDeploySelectedRemotePipelines,
  resetPullStatus,
  resetRemote,
  setRemoteLoadingMessage,
  setRemoteNameFilter,
  setRemotePipelines,
  toggleRemoteShowFailedOnly,
} from '../store/ActionCreator';
import { LoadingAppLevel } from 'components/shared/LoadingAppLevel';
import { getCurrentNamespace } from 'services/NamespaceStore';
import LoadingSVGCentered from 'components/shared/LoadingSVGCentered';
import PrimaryTextButton from 'components/shared/Buttons/PrimaryTextButton';
import PrimaryContainedButton from 'components/shared/Buttons/PrimaryContainedButton';
import { useOnUnmount } from 'services/react/customHooks/useOnUnmount';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';
import { SUPPORT } from 'components/StatusButton/constants';
import { IListResponse } from '../types';

const PREFIX = 'features.SourceControlManagement.pull';

interface IRemotePipelineListViewProps {
  redirectOnSubmit?: boolean;
}

export const RemotePipelineListView = ({ redirectOnSubmit }: IRemotePipelineListViewProps) => {
  const {
    ready,
    remotePipelines,
    nameFilter,
    selectedPipelines,
    loadingMessage,
    showFailedOnly,
  } = useSelector(({ pull }) => pull);

  const pullFailedCount = countPullFailedPipelines();

  useEffect(() => {
    if (!ready) {
      getRemotePipelineList(getCurrentNamespace());
    }
  }, [ready]);

  useOnUnmount(() => resetRemote());

  const filteredPipelines = remotePipelines.filter((pipeline) =>
    pipeline.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  const onPullSubmit = () => {
    resetPullStatus();
    const pulledPipelines = cloneDeep(remotePipelines);
    const namespace = getCurrentNamespace();
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
          />
          <PrimaryContainedButton
            size="large"
            disabled={!selectedPipelines.length}
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
      <PipelineListContainer>
        <SearchBox nameFilter={nameFilter} setNameFilter={setRemoteNameFilter} />
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
                  {showFailedOnly ? T.translate('commons.hide') : T.translate('commons.show')}
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
