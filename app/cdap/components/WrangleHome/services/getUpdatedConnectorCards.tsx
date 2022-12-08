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

import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import { attachStaticCards } from 'components/WrangleHome/services/attachStaticCards';
import { getConnectorTypesDisplayNames } from 'components/WrangleHome/services/getConnectorTypesDisplayNames';

/**
 * This function update the connector types data by
 *
 * @param connectorTypesWithIcons - connector types with icons data which is retrived from dataprep store
 * @returns sorted(based on most updated connection inside of a connector) connector types with display names, icons
 */

export const getUpdatedConnectorCards = async (connectorTypesWithIcons) => {
  // Fetching all the connector type data here
  const connectorTypes = await fetchConnectors();

  // Fetching all the connections inside each connector type
  const categorizedConnections = await getCategorizedConnections();

  // Here we appending connector type's icon to each connector based on it's name
  const getIconForConnector = (connectorName: string) => {
    const matchingConnector = connectorTypesWithIcons.find(
      (eachConnector) => eachConnector.name === connectorName
    );
    return matchingConnector?.SVG;
  };

  const connectorTypeWithConnections = [];
  // Here we iterating over the categorizedConnections data & finding most updated time stamp of a connection inside each connector type
  categorizedConnections?.forEach((value, key) => {
    let mostUpdatedTimeStamp = value[0].updatedTimeMillis;
    value.forEach((e) => {
      if (mostUpdatedTimeStamp < e.updatedTimeMillis) {
        mostUpdatedTimeStamp = e.updatedTimeMillis;
      }
    });
    connectorTypeWithConnections.push({ name: key, time: mostUpdatedTimeStamp });
  });

  const sortedConections = [...connectorTypeWithConnections].sort((a, b) => b.time - a.time);

  let connectorTypesCardsData = sortedConections.map((eachConnector) => {
    return {
      ...eachConnector,
      SVG: getIconForConnector(eachConnector.name),
    };
  });

  // attaching static cards addconnections & import data
  connectorTypesCardsData = attachStaticCards(connectorTypesCardsData);
  // Fetching the display for each connector type.
  await getConnectorTypesDisplayNames(connectorTypes, connectorTypesCardsData).then((response) => {
    if (response) {
      connectorTypesCardsData = response;
    }
  });

  return {
    connectorTypes: connectorTypesCardsData,
  };
};
