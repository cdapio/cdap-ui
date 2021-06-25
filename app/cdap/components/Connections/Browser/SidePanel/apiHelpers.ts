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

import { ConnectionsApi } from 'api/connections';
import { getCurrentNamespace } from 'services/NamespaceStore';

function getConnections() {
  return ConnectionsApi.listConnections({
    context: getCurrentNamespace(),
  }).toPromise();
}

export async function getCategorizedConnections() {
  let connections;
  const categorizedConnectionsMap = new Map();
  try {
    connections = await getConnections();
    for (const connection of connections) {
      let { connectionType } = connection;
      if (!connectionType) {
        connectionType = connection.plugin.artifact.name;
      }
      let existingConnections = categorizedConnectionsMap.get(connectionType);
      if (!existingConnections) {
        existingConnections = [];
      }
      categorizedConnectionsMap.set(connectionType, existingConnections.concat(connection));
    }
  } catch (e) {
    // tslint:disable-next-line: no-console
    console.log('Unable to fetch connections');
    throw new Error(`Connections fetch failed: ${e.message}`);
  }
  return categorizedConnectionsMap;
}
