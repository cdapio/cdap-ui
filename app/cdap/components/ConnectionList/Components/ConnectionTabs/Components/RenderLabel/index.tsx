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

import TabLabelCanBrowse from 'components/ConnectionList/Components/TabLabelCanBrowse';
import TabLabelCanSample from 'components/ConnectionList/Components/TabLabelCanSample';
import React from 'react';
import { Dispatch, SetStateAction } from 'react';

export interface IRenderLabelProps {
  columnIndex: number;
  connectorType: IConnectionTabType;
  connectionIdProp: string;
  toggleLoader: (value: boolean, isError?: boolean) => void;
  setIsErrorOnNoWorkSpace: Dispatch<SetStateAction<boolean>>;
  dataTestID: number;
}

export interface IConnectionTabType {
  connectionId?: string;
  connectionType?: string;
  createdTimeMillis?: number;
  description?: string;
  isDefault?: boolean;
  name: string;
  displayName?: string;
  plugin?: IConnectionTabPlugin;
  preConfigured?: boolean;
  updatedTimeMillis?: number;
  canBrowse?: boolean;
  canSample?: boolean;
  path?: string;
  type?: string;
  properties?: Record<string, string>;
  count?: number;
  icon?: JSX.Element;
  SVG?: JSX.Element;
}

export interface IConnectionTabPlugin {
  artifact: IConnectionTabPluginArtifact;
  category: string;
  name: string;
  properties: IConnectionTabPluginProperties;
  type: string;
}

export interface IConnectionTabPluginArtifact {
  scope: string;
  name: string;
  version: string;
}

export interface IConnectionTabPluginProperties {
  host: string;
  port: string;
  jdbcPluginName: string;
  database: string;
  connectionArgument: string;
  password: string;
  user: string;
}

export default function({
  columnIndex,
  connectorType,
  connectionIdProp,
  toggleLoader,
  setIsErrorOnNoWorkSpace,
  dataTestID,
}: IRenderLabelProps) {
  if ([0, 1].includes(columnIndex) || connectorType.canBrowse) {
    return (
      <TabLabelCanBrowse
        label={columnIndex === 0 ? connectorType?.displayName : connectorType?.name}
        count={columnIndex === 0 ? connectorType?.count : undefined}
        columnIndex={columnIndex}
        icon={connectorType?.icon}
        dataTestID={dataTestID}
      />
    );
  }

  return (
    <TabLabelCanSample
      label={connectorType.name}
      entity={connectorType}
      initialConnectionId={connectionIdProp}
      toggleLoader={toggleLoader}
      setIsErrorOnNoWorkSpace={setIsErrorOnNoWorkSpace}
      dataTestID={dataTestID}
    />
  );
}
