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
import {
  fetchAllConnectorPluginProperties,
  fetchConnectionDetails,
  fetchConnectors,
  getMapOfConnectorToPluginProperties,
  getSelectedConnectorDisplayName,
} from 'components/Connections/Create/reducer';
import WidgetSVG from 'components/WrangleHome/Components/WidgetSVG';
import { getCategoriesToConnectorsMap } from 'components/WrangleHome/Components/WidgetSVG/utils';
import { AddConnectionIcon } from 'components/WrangleHome/Components/WrangleCard/iconStore/AddConnectionIcon';
import { ImportDataIcon } from 'components/WrangleHome/Components/WrangleCard/iconStore/ImportDataIcon';
import { ImportDatasetIcon } from 'components/WrangleHome/Components/WrangleCard/iconStore/ImportDatasetIcon';
import {
  IConnectorArray,
  IConnectorDetailPayloadArray,
} from 'components/WrangleHome/Components/WrangleCard/types';
import React from 'react';

export const getWidgetData = async (cbUpdateState) => {
  const connectorTypes = await fetchConnectors();
  const categorizedConnections = await getCategorizedConnections();
  const connectorTypeWithConnections = [];
  categorizedConnections?.forEach((itemEach, key) => {
    connectorTypeWithConnections.push(key);
  });
  const connectorDataArray = [];
  let connectorDataWithSvgArray: IConnectorArray[] = [];
  const allConnectorsPluginProperties: Map<
    string,
    IConnectorDetailPayloadArray[]
  > = getCategoriesToConnectorsMap(connectorTypes);
  const connectionPayloadArray: IConnectorDetailPayloadArray[] = [];
  allConnectorsPluginProperties?.forEach((connectorsArray) => {
    if (connectorsArray.length) {
      connectorsArray.map((item) => {
        connectionPayloadArray.push(item);
      });
    }
  });

  const connectionDetailsData = await Promise.all(
    connectionPayloadArray.map(async (item, index) => {
      const selectedConnector = {
        artifact: item.artifact,
        category: item.category,
        name: item.name,
        type: item.type,
      };
      connectorDataArray.push(selectedConnector);
      return new Promise((resolve, reject) => {
        const response = fetchConnectionDetails(selectedConnector);
        if (response) {
          resolve(response);
        }
      });
    })
  );
  const connectorWidgetJson = connectionDetailsData.map(
    ({ connectorWidgetJSON }) => connectorWidgetJSON
  );

  connectorDataArray.map((connectorType) => {
    let connectorTypeHasWidget = false;
    /**
     * Getting widget icons for connector types
     */
    connectorWidgetJson.map((item) => {
      if (item['display-name'] && item['display-name'].includes(connectorType.name)) {
        connectorDataWithSvgArray.push({
          ...connectorType,
          SVG: <WidgetSVG dataSrc={item?.icon?.arguments?.data} />,
        });
        connectorTypeHasWidget = true;
      }
    });
    /**
     * Retaining the connector types which are not part of widget api
     */
    if (!connectorTypeHasWidget) {
      connectorDataWithSvgArray.push({
        ...connectorType,
        SVG: <WidgetSVG dataSrc={undefined} />,
      });
    }
  });

  connectorDataWithSvgArray = connectorDataWithSvgArray.filter((obj) =>
    connectorTypeWithConnections.find((item) => item == obj.name)
  );

  connectorDataWithSvgArray = [
    ...new Map(connectorDataWithSvgArray.map((item) => [item.name, item])).values(),
  ];
  const staticCardModel = {
    name: 'Imported Datasets',
    type: 'default',
    category: 'default',
    description: 'All Connections from the List',
    artifact: {
      name: 'allConnections',
      version: 'local',
      scope: 'local',
    },

    SVG: ImportDatasetIcon,
  };

  connectorDataWithSvgArray.unshift({
    ...staticCardModel,
    name: 'Import Data',
    SVG: ImportDataIcon,
    link: 'home',
  });
  connectorDataWithSvgArray.unshift({
    ...staticCardModel,
    name: 'Add Connection',
    SVG: AddConnectionIcon,
    link: 'connections/create',
  });

  const allConnectorsPluginProperties1 = await fetchAllConnectorPluginProperties(connectorTypes);

  const mapOfConnectorPluginProperties = getMapOfConnectorToPluginProperties(
    allConnectorsPluginProperties1
  );

  connectorTypes?.forEach((eachConnectorType) => {
    const displayName = getSelectedConnectorDisplayName(
      eachConnectorType,
      mapOfConnectorPluginProperties
    );
    const index = connectorDataWithSvgArray.findIndex(
      (eachConnectorDataWithSvgArray) =>
        eachConnectorDataWithSvgArray.name === eachConnectorType.name
    );

    if (index >= 0) {
      connectorDataWithSvgArray[index].displayName = displayName;
    }
  });

  cbUpdateState({
    connectorTypes: connectorDataWithSvgArray,
  });
};
