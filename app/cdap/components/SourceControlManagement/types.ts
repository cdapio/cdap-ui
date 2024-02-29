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

import { IArtifactObj } from 'components/PipelineContextMenu/PipelineTypes';
import { SUPPORT } from 'components/StatusButton/constants';
import { OperationType } from './OperationType';
import { OperationStatus } from './OperationStatus';
import { ITimeInstant } from 'services/DataFormatter';

export type TSyncStatusFilter = 'all' | 'in_sync' | 'out_of_sync';
export type TSyncStatus = 'not_available' | 'in_sync' | 'out_of_sync' | 'not_connected';

export interface IRepositoryPipeline {
  name: string;
  fileHash: string;
  error: string;
  status: SUPPORT;
  lastSyncDate?: ITimeInstant;
  syncStatus?: TSyncStatus;
}

export interface IOperationResource {
  resourceUri: string;
}

export interface IOperationMeta {
  resources: IOperationResource[];
  createTime?: ITimeInstant;
  endTime?: ITimeInstant;
}

export interface IOperationError {
  message?: string;
  details?: IOperationResourceScopedError[];
}

export interface IOperationResourceScopedError {
  resourceUri: string;
  message?: string;
}

export interface IOperationResourceScopedErrorMessage {
  type?: string;
  message: string;
}

export interface IOperationRun {
  id: string;
  type: OperationType;
  done: boolean;
  status: OperationStatus;
  metadata?: IOperationMeta;
  error?: IOperationError;
}

export interface IPushResponse {
  name: string;
  version: string;
  fileHash: string;
}

export interface IPipeline {
  type: string;
  name: string;
  version: string;
  description: string;
  artifact: IArtifactObj;
  change: {
    author: string;
    description: string;
    creationTimeMillis: number;
  };
  sourceControlMeta: {
    fileHash: string;
    lastSyncedAt?: ITimeInstant;
  };
}

export interface IListResponse {
  status: SUPPORT;
  name: string;
  message: string;
  fileHash?: string;
}

export interface IOperationMetaResponse {
  status: SUPPORT;
  resources?: IOperationResource[];
  message: string;
}

export interface IResource {
  resourceType: string;
  namespace: string;
  name: string;
  version: string;
}
