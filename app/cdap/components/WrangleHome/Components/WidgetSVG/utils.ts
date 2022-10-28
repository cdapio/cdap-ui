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

import reject from 'lodash/reject';
import { findHighestVersion } from 'services/VersionRange/VersionUtilities';

export const getCategoriesToConnectorsMap = (connectionTypes = []) => {
  const categoryToConnectionsMap = new Map();
  const connectionToVersionsMap = new Map();
  if (!connectionTypes.length) {
    return categoryToConnectionsMap;
  }
  for (const connectionType of connectionTypes) {
    let { category } = connectionType;
    if (!category) {
      category = connectionType.artifact.name;
    }
    let isDuplicate = false;
    const connectionName = `${category}-${connectionType.name}`;
    if (!connectionToVersionsMap.has(connectionName)) {
      connectionToVersionsMap.set(connectionName, [connectionType.artifact]);
    } else {
      isDuplicate = true;
      const existingVersions: string = connectionToVersionsMap.get(connectionName);
      connectionToVersionsMap.set(connectionName, [...existingVersions, connectionType.artifact]);
    }
    if (!categoryToConnectionsMap.has(category)) {
      categoryToConnectionsMap.set(category, [connectionType]);
      continue;
    }
    if (!isDuplicate) {
      const existingConnections: string = categoryToConnectionsMap.get(category);
      categoryToConnectionsMap.set(category, [...existingConnections, connectionType]);
    }
  }
  return addVersionInfo(categoryToConnectionsMap, connectionToVersionsMap);
};

export const addVersionInfo = (categoryToConnectionsMap, versionsMap) => {
  const updatedConnectionsMap = new Map();
  for (const [category, connections] of categoryToConnectionsMap.entries()) {
    for (const connection of connections) {
      const allVersions = versionsMap.get(`${category}-${connection.name}`) || [];
      if (allVersions.length < 2) {
        connection.olderVersions = [];
        continue;
      }
      const highestVersion = findHighestVersion(
        allVersions.map((plugin) => plugin.version),
        true
      );

      const latestVersion: string = allVersions.find((plugin) => plugin.version === highestVersion);
      connection.artifact = latestVersion;
      connection.olderVersions = reject(allVersions, latestVersion);
    }
    updatedConnectionsMap.set(category, connections);
  }
  return updatedConnectionsMap;
};
