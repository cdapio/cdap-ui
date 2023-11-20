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

import moment from 'moment';
import { OperationStatus } from './OperationStatus';
import { OperationType } from './OperationType';
import {
  IResource,
  IOperationResource,
  IOperationRun,
  IOperationError,
  IOperationResourceScopedErrorMessage,
  IRepositoryPipeline,
  TSyncStatusFilter,
  TSyncStatus,
} from './types';
import T from 'i18n-react';
import { ITimeInstant, timeInstantToString } from 'services/DataFormatter';

const PREFIX = 'features.SourceControlManagement';

export const parseOperationResource = (resource: IOperationResource): IResource => {
  const { resourceUri } = resource;
  const [resourceType, resourceId] = resourceUri.split(':');
  const [namespace, name, version] = resourceId.split('.');
  return {
    resourceType,
    namespace,
    name,
    version,
  };
};

export const parseErrorMessage = (errorMessage: string): IOperationResourceScopedErrorMessage => {
  const firstColonIndex = errorMessage.indexOf(':');
  if (firstColonIndex === -1) {
    return {
      message: errorMessage,
    };
  }

  return {
    type: errorMessage.substring(0, firstColonIndex).trim(),
    message: errorMessage.substring(firstColonIndex + 1).trim(),
  };
};

export const getOperationRunMessage = (operation: IOperationRun) => {
  const n = operation.metadata?.resources?.length || '';

  if (n === 1) {
    return getOperationRunMessageSingular(operation);
  }

  if (operation.status === OperationStatus.SUCCEEDED) {
    if (operation.type === OperationType.PUSH_APPS) {
      return T.translate(`${PREFIX}.push.pushSuccessMulti`, { n });
    }
    if (operation.type === OperationType.PULL_APPS) {
      return T.translate(`${PREFIX}.pull.pullSuccessMulti`, { n });
    }
    return T.translate(`${PREFIX}.syncSuccessMulti`);
  }

  if (operation.status === OperationStatus.FAILED) {
    if (operation.type === OperationType.PUSH_APPS) {
      return T.translate(`${PREFIX}.push.pushFailureMulti`, { n });
    }
    if (operation.type === OperationType.PULL_APPS) {
      return T.translate(`${PREFIX}.pull.pullFailureMulti`, { n });
    }
    return T.translate(`${PREFIX}.syncFailreMulti`);
  }

  if (operation.status === OperationStatus.KILLED) {
    if (operation.type === OperationType.PUSH_APPS) {
      return T.translate(`${PREFIX}.push.pushKilledMulti`, { n });
    }
    if (operation.type === OperationType.PULL_APPS) {
      return T.translate(`${PREFIX}.pull.pullKilledMulti`, { n });
    }
    return T.translate(`${PREFIX}.syncKilledMulti`);
  }

  if (operation.type === OperationType.PUSH_APPS) {
    return T.translate(`${PREFIX}.push.pushAppMessageMulti`, { n });
  }
  if (operation.type === OperationType.PULL_APPS) {
    return T.translate(`${PREFIX}.pull.pullAppMessageMulti`, { n });
  }
  return T.translate(`${PREFIX}.syncAppMessageMulti`);
};

export const getOperationStatusType = (operation: IOperationRun) => {
  if (!operation || !operation.done) {
    return 'info';
  }

  if (operation.status === OperationStatus.SUCCEEDED) {
    return 'success';
  }

  if (operation.status === OperationStatus.FAILED) {
    return 'error';
  }

  if (operation.status === OperationStatus.KILLED) {
    return 'warning';
  }

  return 'info';
};

export const getOperationRunMessageSingular = (operation: IOperationRun) => {
  if (operation.status === OperationStatus.SUCCEEDED) {
    if (operation.type === OperationType.PUSH_APPS) {
      return T.translate(`${PREFIX}.push.pipelinePushedSuccess`);
    }
    if (operation.type === OperationType.PULL_APPS) {
      return T.translate(`${PREFIX}.pull.pipelinePulledSuccess`);
    }
    return T.translate(`${PREFIX}.pipelineSyncedSuccess`);
  }

  if (operation.status === OperationStatus.FAILED || operation.status === OperationStatus.KILLED) {
    if (operation.type === OperationType.PUSH_APPS) {
      return T.translate(`${PREFIX}.push.pipelinePushedFail`);
    }
    if (operation.type === OperationType.PULL_APPS) {
      return T.translate(`${PREFIX}.pull.pipelinePulledFail`);
    }
    return T.translate(`${PREFIX}.pipelineSyncedFail`);
  }

  if (operation.type === OperationType.PUSH_APPS) {
    return T.translate(`${PREFIX}.push.pipelinePushMessage`);
  }
  if (operation.type === OperationType.PULL_APPS) {
    return T.translate(`${PREFIX}.pull.pipelinePullMessage`);
  }
  return T.translate(`${PREFIX}.pipelineSyncMessage`);
};

export const compareTimeInstant = (t1: ITimeInstant, t2: ITimeInstant): number => {
  return t1.seconds - t2.seconds || t1.nanos - t2.nanos;
};

export const getOperationStartTime = (operation: IOperationRun): string => {
  return timeInstantToString(operation.metadata?.createTime);
};

export const getOperationRunTime = (operation: IOperationRun): string => {
  if (operation.metadata?.createTime && operation.metadata?.endTime) {
    return moment
      .duration(
        (operation.metadata?.endTime.seconds - operation.metadata?.createTime.seconds) * 1000
      )
      .humanize();
  }
  return null;
};

const getSyncStatusWeight = (syncStatus?: TSyncStatus): number => {
  if (syncStatus === undefined) {
    return 0;
  }
  if (syncStatus === 'not_available') {
    return 0;
  }
  if (syncStatus === 'not_connected') {
    return 0;
  }
  if (syncStatus === 'out_of_sync') {
    return 1;
  }
  return 2;
};

export const compareSyncStatus = (a: IRepositoryPipeline, b: IRepositoryPipeline): number => {
  return getSyncStatusWeight(a.syncStatus) - getSyncStatusWeight(b.syncStatus);
};

export const stableSort = (array, comparator) => {
  const stabilizedArray = array.map((el, index) => [el, index]);
  stabilizedArray.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedArray.map((el) => el[0]);
};

export const filterOnSyncStatus = (
  array: IRepositoryPipeline[],
  syncStatusFilter: TSyncStatusFilter
): IRepositoryPipeline[] => {
  if (syncStatusFilter === 'all') {
    return array;
  }

  return array.filter((pipeline) => {
    if (syncStatusFilter === 'out_of_sync') {
      return ['not_connected', 'out_of_sync', 'not_available'].includes(pipeline.syncStatus);
    }
    return pipeline.syncStatus === syncStatusFilter;
  });
};
