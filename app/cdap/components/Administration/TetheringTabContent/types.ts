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
  description: string;
  metadata: { project: string; location: string };
  namespaceAllocations: INamespaceAllocations[];
}

export interface IConnection {
  requestTime: number;
  connectionStatus: string;
  endpoint: string;
  metadata: IMetadata;
  name: string;
  tetheringStatus: string;
}

export interface ITableData {
  requestTime: string;
  description: string;
  gcloudProject: string;
  instanceName: string;
  instanceUrl: string;
  region: string;
  tetheringStatus: string;
  connectionStatus: string;
  allocationData: INamespaceAllocations[];
  highlighted?: boolean;
}

export interface IConnectionsProps {
  establishedConnections: IConnection[];
  handleEdit: (connType: string, peer: string) => void;
  handleDelete: (connType: string, peer: string) => void;
}

export interface IOnPremConnectionsProps extends IConnectionsProps {
  tetheringRequests: IConnection[];
}

export interface ICdfConnectionsProps extends IConnectionsProps {
  newRequests: IConnection[];
  handleAcceptOrReject: (action: string, peer: string) => void;
}

export interface IApiError {
  statusCode?: string;
  response?: string;
}

export interface IValidationErrors {
  namespaces?: IErrorObj;
  instanceName?: IErrorObj;
  projectName?: IErrorObj;
  region?: IErrorObj;
  instanceUrl?: IErrorObj;
}

export interface INamespace {
  namespace: string;
  cpuLimit: number;
  memoryLimit: number;
}

export interface INewReqInputFields {
  projectName: string;
  region: string;
  instanceName: string;
  instanceUrl: string;
  description: string;
}
