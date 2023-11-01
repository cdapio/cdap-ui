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

import T from 'i18n-react';
import debounce from 'lodash/debounce';
import { catchError, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { MyPipelineApi } from 'api/pipeline';
import { BATCH_PIPELINE_TYPE } from 'services/helpers';
import SourceControlManagementSyncStore, {
  OperationRunActions,
  PullFromGitActions,
  PushToGitActions,
} from '.';
import { SourceControlApi } from 'api/sourcecontrol';
import { LongRunningOperationApi } from 'api/longRunningOperation';
import { IPipeline, IPushResponse, IRepositoryPipeline, IOperationRun } from '../types';
import { SUPPORT } from 'components/StatusButton/constants';
import { compareTimeInstant } from '../helpers';

const PREFIX = 'features.SourceControlManagement';

// push actions
export const getNamespacePipelineList = (namespace, nameFilter = null) => {
  MyPipelineApi.list({
    namespace,
    artifactName: BATCH_PIPELINE_TYPE,
    nameFilter,
  }).subscribe(
    (res: IPipeline[] | { applications: IPipeline[] }) => {
      const pipelines = Array.isArray(res) ? res : res?.applications;
      const nsPipelines = pipelines.map((pipeline) => {
        return {
          name: pipeline.name,
          fileHash: pipeline.sourceControlMeta?.fileHash,
          error: null,
          status: null,
        };
      });
      setLocalPipelines(nsPipelines);
    },
    (err) => {
      setLocalPipelines([]);
    }
  );
};

export const setLocalPipelines = (pipelines: IRepositoryPipeline[]) => {
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
      return SourceControlApi.push(params, payload).pipe(
        map((res: IPushResponse | string) => {
          if (typeof res === 'string') {
            return { message: res, name: appId, status: SUPPORT.partial };
          }
          return {
            message: null,
            name: appId,
            status: SUPPORT.yes,
            fileHash: res.fileHash,
          };
        }),
        catchError((err) => {
          return of({ message: err.message, name: appId, status: SUPPORT.no });
        })
      );
    })
  );
};

export const pushMultipleSelectedPipelines = (
  namespace,
  apps,
  payload,
  loadingMessageDispatcher: (message: string) => void
) => {
  loadingMessageDispatcher(
    T.translate(`${PREFIX}.push.pushAppMessageMulti`, { n: apps.length }).toString()
  );
  return SourceControlApi.pushMultiple({ namespace }, { ...payload, apps }).pipe(
    map((res: IOperationRun | string) => {
      loadingMessageDispatcher(null);
      if (typeof res === 'string') {
        return { message: res, status: SUPPORT.no };
      }

      setLatestOperation(namespace, res);
      return {
        message: null,
        resources: res.metadata?.resources,
        status: SUPPORT.yes,
      };
    }),
    catchError((err) => {
      return of({ message: err.message, status: SUPPORT.no });
    })
  );
};

const pushAppMessage = (appId) => {
  return T.translate(`${PREFIX}.push.pushAppMessage`, { appId }).toString();
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
    (pipeline.error = null), (pipeline.status = null);
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

// pull actions
export const getRemotePipelineList = (namespace) => {
  SourceControlApi.list({
    namespace,
  }).subscribe(
    (res: IRepositoryPipeline[] | { apps: IRepositoryPipeline[] }) => {
      const pipelines = Array.isArray(res) ? res : res?.apps;
      const remotePipelines = pipelines.map((pipeline) => {
        return {
          name: pipeline.name,
          fileHash: pipeline.fileHash,
          error: null,
          status: null,
        };
      });
      setRemotePipelines(remotePipelines);
    },
    (err) => {
      setRemotePipelines([]);
      setPullViewErrorMsg(err.message || T.translate(`${PREFIX}.pull.pipelinesListedFail`));
    }
  );
};

export const setRemotePipelines = (pipelines: IRepositoryPipeline[]) => {
  SourceControlManagementSyncStore.dispatch({
    type: PullFromGitActions.setRemotePipelines,
    payload: {
      remotePipelines: pipelines,
    },
  });
};

export const setPullViewErrorMsg = (errorMsg: string = '') => {
  SourceControlManagementSyncStore.dispatch({
    type: PullFromGitActions.setPullViewErrorMsg,
    payload: {
      pullViewErrorMsg: errorMsg,
    },
  });
};

export const setRemoteNameFilter = (nameFilter: string) => {
  SourceControlManagementSyncStore.dispatch({
    type: PullFromGitActions.setNameFilter,
    payload: {
      nameFilter,
    },
  });
};

export const setSelectedRemotePipelines = (selectedPipelines: string[]) => {
  SourceControlManagementSyncStore.dispatch({
    type: PullFromGitActions.setSelectedPipelines,
    payload: {
      selectedPipelines,
    },
  });
};

export const setRemoteLoadingMessage = (loadingMessage) => {
  SourceControlManagementSyncStore.dispatch({
    type: PullFromGitActions.setLoadingMessage,
    payload: {
      loadingMessage,
    },
  });
};

export const resetPullStatus = () => {
  const pipelines = [...SourceControlManagementSyncStore.getState().pull.remotePipelines];
  pipelines.forEach((pipeline) => {
    (pipeline.error = null), (pipeline.status = null);
  });
  setRemotePipelines(pipelines);
};

export const countPullFailedPipelines = () => {
  return SourceControlManagementSyncStore.getState().pull.remotePipelines.filter(
    (pipeline) => pipeline.error
  ).length;
};

export const toggleRemoteShowFailedOnly = () => {
  SourceControlManagementSyncStore.dispatch({
    type: PullFromGitActions.toggleShowFailedOnly,
  });
};

export const pullAndDeploySelectedRemotePipelines = (
  namespace,
  apps: string[],
  loadingMessageDispatcher: (message: string) => void
) => {
  return of(...apps).pipe(
    concatMap((appId) => {
      loadingMessageDispatcher(T.translate(`${PREFIX}.pull.pullAppMessage`, { appId }).toString());
      const params = {
        namespace,
        appId,
      };
      return SourceControlApi.pull(params).pipe(
        map((res: IPipeline | string) => {
          if (typeof res === 'string') {
            return { message: res, name: appId, status: SUPPORT.partial };
          }
          return {
            message: null,
            name: appId,
            status: SUPPORT.yes,
          };
        }),
        catchError((err) => {
          return of({ message: err.message, name: appId, status: SUPPORT.no });
        })
      );
    })
  );
};

export const pullAndDeployMultipleSelectedRemotePipelines = (
  namespace,
  apps: string[],
  loadingMessageDispatcher: (message: string) => void
) => {
  loadingMessageDispatcher(T.translate(`${PREFIX}.pull.pullAppMessageMulti`).toString());
  return SourceControlApi.pullMultiple({ namespace }, { apps }).pipe(
    map((res: IOperationRun | string) => {
      if (typeof res === 'string') {
        return { message: res, status: SUPPORT.no };
      }

      setLatestOperation(namespace, res);
      return {
        message: null,
        resources: res.metadata?.resources,
        status: SUPPORT.yes,
      };
    }),
    catchError((err) => {
      return of({ message: err.message, status: SUPPORT.no });
    })
  );
};

export const resetRemote = () => {
  SourceControlManagementSyncStore.dispatch({
    type: PullFromGitActions.reset,
  });
};

export const setLatestOperation = (namespace: string, operation: IOperationRun) => {
  SourceControlManagementSyncStore.dispatch({
    type: OperationRunActions.setLatestOperation,
    payload: operation,
  });

  if (operation.done) {
    return;
  }

  const pollOperationStatus = LongRunningOperationApi.pollOperation({
    namespace,
    operationId: operation.id,
  }).subscribe((res: IOperationRun) => {
    if (res.done) {
      pollOperationStatus.unsubscribe();

      SourceControlManagementSyncStore.dispatch({
        type: OperationRunActions.setLatestOperation,
        payload: res,
      });
    }
  });
};

export const unsetLatestOperation = (operation: IOperationRun) => {
  SourceControlManagementSyncStore.dispatch({
    type: OperationRunActions.unsetLatestOperation,
  });
};

export const fetchLatestPullOperation = (namespace: string) => {
  const currentLatest = SourceControlManagementSyncStore.getState().operationRun.operation;
  return LongRunningOperationApi.getLatestPull({
    namespace,
  }).pipe(
    map((res: { operations: IOperationRun[] }) => {
      if (res.operations.length < 1) {
        return;
      }
      const operation = res.operations[0];
      if (
        !currentLatest ||
        compareTimeInstant(operation.metadata.createTime, currentLatest.metadata.createTime) > 0
      ) {
        setLatestOperation(namespace, operation);
      }
    })
  );
};

export const fetchLatestPushOperation = (namespace: string) => {
  const currentLatest = SourceControlManagementSyncStore.getState().operationRun.operation;
  return LongRunningOperationApi.getLatestPush({
    namespace,
  }).pipe(
    map((res: { operations: IOperationRun[] }) => {
      if (res.operations.length < 1) {
        return;
      }
      const operation = res.operations[0];
      if (
        !currentLatest ||
        compareTimeInstant(operation.metadata.createTime, currentLatest.metadata.createTime) > 0
      ) {
        setLatestOperation(namespace, operation);
      }
    })
  );
};

export const fetchLatestOperation = (namespace: string) => {
  fetchLatestPullOperation(namespace).subscribe(() => {
    fetchLatestPushOperation(namespace).subscribe();
  });
};

export const stopOperation = (namespace: string, operation: IOperationRun) => () => {
  LongRunningOperationApi.stopOperation({
    namespace,
    operationId: operation.id,
  }).subscribe((res) => {
    // no op, as it's an asynchronous operation.
    // The operation status will be updated by the ongoing poll for the operation.
  });
};
