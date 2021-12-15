/*
 * Copyright © 2021 Cask Data, Inc.
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

import * as React from 'react';

/**
 * The Connection Mode represents how the connections will be integrated across the UI.
 *
 * 1. Routed - Regular use of Connections under the /connections route. This is entirely in React
 * so we can use regular react-router and navigation can take place just normal
 *
 * 2. Routed Workspace - Meaning routing only happens while navigating to the workspace. This is the
 * case when user is in dataprep table and clicks on the left arrow to browse through connections.
 * The user is already in a specific workspace (/wrangler/:workspaceid) and we don't want to change
 * the url based on the activity in the connection
 *
 * 3. In Memory - The entire routing happens in memory. This will be the case when the user clicks on the
 * "Browse" button in wrangler sources or clicks on the "Wrangle" button in wrangler transform. Since we are in
 * studio (completely in angular world) we do not want to do any navigation here. Everything happens in memory,
 * including browsing through connections, going to a wrangler workspace, and finally applying the wrangler properties
 * to wrangler transform.
 */
export enum IConnectionMode {
  'ROUTED' = 'ROUTED',
  'ROUTED_WORKSPACE' = 'ROUTED_WORKSPACE',
  'INMEMORY' = 'INMEMORY',
}
export interface IConnections {
  mode: IConnectionMode;
  path?: string;
  // Ideally connections should not require workspaceId. Path should be sufficient but because of old usage this is still here.
  workspaceId?: string;
  onWorkspaceCreate?: (workspaceId: string) => void;
  connectionId?: string;
  onEntitySelect?: (entitySpec) => void;
  initPath?: string;
  disabledTypes?: Record<string, boolean>;
  hideSidePanel?: boolean;
  hideAddConnection?: boolean;
  connectorType?: string;
  allowDefaultConnection?: boolean;
  selectedPlugin?: Record<string, string>;
  showParsingConfig?: boolean;
}
export const ConnectionsContext = React.createContext<IConnections>({
  mode: IConnectionMode.ROUTED,
  disabledTypes: {},
  selectedPlugin: null,
});
