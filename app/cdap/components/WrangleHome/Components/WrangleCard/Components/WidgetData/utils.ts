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
      const existingVersions = connectionToVersionsMap.get(connectionName);
      connectionToVersionsMap.set(connectionName, [...existingVersions, connectionType.artifact]);
    }
    if (!categoryToConnectionsMap.has(category)) {
      categoryToConnectionsMap.set(category, [connectionType]);
      continue;
    }
    if (!isDuplicate) {
      const existingConnections = categoryToConnectionsMap.get(category);
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
      const latestVersion = allVersions.find((plugin) => plugin.version === highestVersion);
      connection.artifact = latestVersion;
      connection.olderVersions = reject(allVersions, latestVersion);
    }
    updatedConnectionsMap.set(category, connections);
  }
  return updatedConnectionsMap;
};
