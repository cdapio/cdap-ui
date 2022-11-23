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

import {
  fetchAllConnectorPluginProperties,
  getMapOfConnectorToPluginProperties,
  getSelectedConnectorDisplayName,
} from 'components/Connections/Create/reducer';

/**
 * @param connectorTypes array of connector types
 * @param connectorTypesCardsData connector types data which has icon attached to each connector
 * @returns connectors data with display name to show it on UI
 */

export const getConnectorTypesDisplayNames = async (connectorTypes, connectorTypesCardsData) => {
  const connectorTypesCardsDataWithDisplayName = connectorTypesCardsData;
  const connectorsPluginProperties = await fetchAllConnectorPluginProperties(connectorTypes);

  const mapOfConnectorPluginProperties = getMapOfConnectorToPluginProperties(
    connectorsPluginProperties
  );

  connectorTypes?.forEach((eachConnectorType) => {
    const displayName = getSelectedConnectorDisplayName(
      eachConnectorType,
      mapOfConnectorPluginProperties
    );
    const index = connectorTypesCardsDataWithDisplayName.findIndex(
      (eachconnectorTypesCardsDataWithDisplayName) =>
        eachconnectorTypesCardsDataWithDisplayName.name === eachConnectorType.name
    );

    if (index >= 0) {
      connectorTypesCardsDataWithDisplayName[index].displayName = displayName;
    }
  });

  return connectorTypesCardsDataWithDisplayName;
};
