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
  fetchConnectionDetails,
  fetchConnectors,
  getCategoriesToConnectorsMap,
} from 'components/Connections/Create/reducer';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import WidgetSVG from 'components/WidgetSVG';
import {
  IConnectorTypesWithSVG,
  IConnectorDetailsPayload,
  IConnectorTypes,
} from 'components/WidgetSVG/types';
import { ImportDatasetIcon } from 'components/WrangleHome/Components/WrangleCard/iconStore/ImportDatasetIcon';
import React from 'react';
import { forkJoin } from 'rxjs/observable/forkJoin';

export const getWidgetData = async () => {
  const connectorTypes: IConnectorTypesWithSVG[] = await fetchConnectors();
  const connectorTypesData: IConnectorTypes[] = [];
  const IConnectionWithConnectorType: IConnectorTypesWithSVG[] = [];
  const allConnectorsPluginProperties: Map<
    string,
    IConnectorDetailsPayload[]
  > = getCategoriesToConnectorsMap(connectorTypes);
  const connectorsPluginProperties: IConnectorDetailsPayload[] = [];
  allConnectorsPluginProperties?.forEach((eachProperty) => {
    if (eachProperty.length) {
      eachProperty.forEach((eachPropertyItem) => {
        connectorsPluginProperties.push(eachPropertyItem);
      });
    }
  });

  const connectionDetailsList = forkJoin(
    connectorsPluginProperties.map((eachConnection) => {
      const selectedConnector = {
        artifact: eachConnection.artifact,
        category: eachConnection.category,
        name: eachConnection.name,
        type: eachConnection.type,
      };
      connectorTypesData.push(selectedConnector);
      return fetchConnectionDetails(selectedConnector);
    })
  ).subscribe((res) => res);
  const connectorWidgetData =
    Array.isArray(connectionDetailsList) &&
    connectionDetailsList.length &&
    connectionDetailsList.map(({ connectorWidgetJSON }) => connectorWidgetJSON);

  connectorTypesData.map((eachConnectorType) => {
    let connectorTypeHasWidget: boolean = false;

    // Getting widget icons for connector types

    Array.isArray(connectorWidgetData) &&
      connectorWidgetData.length &&
      connectorWidgetData.map((eachConnector) => {
        if (
          eachConnector['display-name'] &&
          eachConnector['display-name'].includes(eachConnectorType.name)
        ) {
          IConnectionWithConnectorType.push({
            ...eachConnectorType,
            SVG: (
              <WidgetSVG
                imageSource={eachConnector?.icon?.arguments?.data}
                label={eachConnectorType.name}
              />
            ),
          });
          connectorTypeHasWidget = true;
        }
      });

    // Retaining the connector types which are not part of widget api

    if (!connectorTypeHasWidget) {
      IConnectionWithConnectorType.push({
        ...eachConnectorType,
        SVG: <WidgetSVG label={eachConnectorType.name} />,
      });
    }
  });

  IConnectionWithConnectorType.push({
    name: 'Imported Dataset',
    SVG: ImportDatasetIcon,
  });

  DataPrepStore.dispatch({
    type: DataPrepActions.setConnectorIcons,
    payload: {
      data: IConnectionWithConnectorType,
    },
  });
};
