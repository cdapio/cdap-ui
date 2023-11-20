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
import { IResource, IOperationResource, IOperationRun, ITimeInstant } from './types';
import T from 'i18n-react';

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

  if (operation.status === OperationStatus.FAILED || operation.status === OperationStatus.KILLED) {
    if (operation.type === OperationType.PUSH_APPS) {
      return T.translate(`${PREFIX}.push.pushFailureMulti`, { n });
    }
    if (operation.type === OperationType.PULL_APPS) {
      return T.translate(`${PREFIX}.pull.pullFailureMulti`, { n });
    }
    return T.translate(`${PREFIX}.syncFailreMulti`);
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

  if (operation.status === OperationStatus.FAILED || operation.status === OperationStatus.KILLED) {
    return 'error';
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
  return moment(operation.metadata?.createTime.seconds * 1000).format('DD-MM-YYYY HH:mm:ss A');
};
