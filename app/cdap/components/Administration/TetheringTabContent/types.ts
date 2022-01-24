/*
 * Copyright © 2022 Cask Data, Inc.
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

import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';

export interface INamespaceAllocations {
  namespace: string;
  cpuLimit: string;
  memoryLimit: string;
}

export interface IMetadata {
  metadata: { project: string; location: string };
  namespaceAllocations: INamespaceAllocations[];
}

export interface IConnection {
  connectionStatus: string;
  endpoint: string;
  metadata: IMetadata;
  name: string;
  tetheringStatus: string;
}

export interface ITableData {
  requestTime: string;
  gcloudProject: string;
  instanceName: string;
  region: string;
}

export interface IAllocationData extends INamespaceAllocations {
  pods: number;
}

export interface IPendingReqsTableData extends ITableData {
  requestedResources: INamespaceAllocations[];
}

export interface IConnectionsTableData extends ITableData {
  status: string;
  allocationData: IAllocationData[];
}

export interface IConnectionsProps {
  establishedConnections: IConnection[];
  handleEdit: (connType: string, peer: string) => void;
  handleDelete: (connType: string, peer: string) => void;
}

export interface IOdfConnectionsProps extends IConnectionsProps {
  pendingRequests: IConnection[];
}

export interface ICdfConnectionsProps extends IConnectionsProps {
  newRequests: IConnection[];
}

export interface IApiError {
  statusCode?: string;
  response?: string;
}

export interface IValidationErrors {
  instanceName?: IErrorObj;
  projectName?: IErrorObj;
  region?: IErrorObj;
}
