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

import { MyPipelineApi } from 'api/pipeline';
import { BATCH_PIPELINE_TYPE } from 'services/helpers';
import SourceControlManagementSyncStore, { PushToGitActions } from '.';
import debounce from 'lodash/debounce';
import { MyRepositoryApi } from 'api/repository';
import { catchError, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ILocalPipeline } from '../types';
import T from 'i18n-react';

export const getNamespacePipelineList = (namespace, nameFilter = null) => {
  MyPipelineApi.list({
    namespace,
    artifactName: BATCH_PIPELINE_TYPE,
    nameFilter,
  }).subscribe((res) => {
    let pipelines = Array.isArray(res) ? res : res?.applications;
    pipelines = pipelines.map((pipeline) => {
      return {
        name: pipeline.name,
        fileHash: pipeline.sourceControlMeta?.fileHash,
        error: null,
        success: null,
      };
    });
    setLocalPipelines(pipelines);
  });
};

export const setLocalPipelines = (pipelines: ILocalPipeline[]) => {
  SourceControlManagementSyncStore.dispatch({
    type: PushToGitActions.setLocalPipelines,
    payload: {
      localPipelines: pipelines,
    },
  });
};

const applySearch = () => {
  SourceControlManagementSyncStore.dispatch({
    type: PushToGitActions.applySearch,
  });
};
const debouncedApplySearch = debounce(applySearch, 1000);

export const setNameFilter = (nameFilter: string) => {
  SourceControlManagementSyncStore.dispatch({
    type: PushToGitActions.setNameFilter,
    payload: {
      nameFilter,
    },
  });
  debouncedApplySearch();
};

export const setSelectedPipelines = (selectedPipelines: any[]) => {
  SourceControlManagementSyncStore.dispatch({
    type: PushToGitActions.setSelectedPipelines,
    payload: {
      selectedPipelines,
    },
  });
};

export const pushSelectedPipelines = (namespace, apps, payload, loadingMessageDispatcher) => {
  return of(...apps).pipe(
    concatMap((appId) => {
      loadingMessageDispatcher(pushAppMessage(appId));
      const params = {
        namespace,
        appId,
      };
      return MyRepositoryApi.push(params, payload).pipe(
        map((res: object) => ({ ...res, statusCode: 200 })),
        catchError((err) => {
          return of({ ...err, name: appId });
        })
      );
    })
  );
};

const pushAppMessage = (appId) => {
  return T.translate('features.SourceControlManagement.push.pushAppMessage', { appId }).toString();
};

export const setLoadingMessage = (loadingMessage) => {
  SourceControlManagementSyncStore.dispatch({
    type: PushToGitActions.setLoadingMessage,
    payload: {
      loadingMessage,
    },
  });
};

export const toggleCommitModal = () => {
  SourceControlManagementSyncStore.dispatch({
    type: PushToGitActions.toggleCommitModal,
  });
};

export const resetPushStatus = () => {
  const pipelines = [...SourceControlManagementSyncStore.getState().push.localPipelines];
  pipelines.forEach((pipeline) => {
    (pipeline.error = null), (pipeline.success = null);
  });
  setLocalPipelines(pipelines);
};

export const countPushFailedPipelines = () => {
  return SourceControlManagementSyncStore.getState().push.localPipelines.filter(
    (pipeline) => pipeline.error
  ).length;
};

export const toggleShowFailedOnly = () => {
  SourceControlManagementSyncStore.dispatch({
    type: PushToGitActions.toggleShowFailedOnly,
  });
};

export const reset = () => {
  SourceControlManagementSyncStore.dispatch({
    type: PushToGitActions.reset,
  });
};
