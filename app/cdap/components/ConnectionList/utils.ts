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

import { IFilteredData, ITabData, ITabsDataResponse } from 'components/ConnectionList/types';
import {
  fetchAllConnectorPluginProperties,
  fetchConnectors,
  getMapOfConnectorToPluginProperties,
  getSelectedConnectorDisplayName,
} from 'components/Connections/Create/reducer';

/**
 *
 * @param response categorized connections data
 * @param index numnber which indicates the level/column in connections list
 * @param existingTabsData existing tab data to render connection list horizontal component
 * @returns modified tab data to render connections list
 */

export const getDataForTabsHelper = (
  response: ITabsDataResponse | ITabData[],
  index: number,
  existingTabsData: IFilteredData[]
) => {
  const tempData: IFilteredData[] = existingTabsData;
  tempData.push({
    data: [],
    showTabs: false,
    selectedTab: '',
    toggleSearch: false,
  });
  if ('entities' in response) {
    tempData[index + 1][`data`] = response.entities;
  } else {
    tempData[index + 1][`data`] = response as ITabData[];
  }
  tempData[index + 1][`showTabs`] = true;
  tempData[index + 1][`selectedTab`] = null;
  tempData[index + 1][`toggleSearch`] = false;
  return tempData.slice(0, index + 2);
};

/**
 *
 * @param index numnber which indicates the level/column in connections list
 * @param tabsData data to render connection list horizontal component
 * @returns data after altering each column's search bar's status
 */

export const getUpdatedTabsData = (index: number, tabsData) => {
  let tempData: IFilteredData[] = tabsData;
  tempData = tempData.map((eachTempData) => ({
    ...eachTempData,
    toggleSearch: false,
  }));
  tempData[index].toggleSearch = true;
  tempData.forEach((eachTempData, tempDataIndex) => {
    if (tempDataIndex === index) {
      eachTempData.toggleSearch = true;
    } else {
      eachTempData.toggleSearch = false;
    }
  });
  return tempData;
};

/**
 *
 * @param connectorTypesWithSVG connector types with corresponding icon attached to it
 * @returns connector types with display name (ex: name: CloudSQLPostgreSQL --> displayName: CloudSQL PostgreSQL)
 */

export const getDisplayNamesForConnectorTypes = async (connectorTypesWithSVG) => {
  const connectorTypes = await fetchConnectors();
  const allConnectorsPluginProperties1 = await fetchAllConnectorPluginProperties(connectorTypes);

  const mapOfConnectorPluginProperties = getMapOfConnectorToPluginProperties(
    allConnectorsPluginProperties1
  );

  connectorTypes?.forEach((eachConnectorType) => {
    const displayName = getSelectedConnectorDisplayName(
      eachConnectorType,
      mapOfConnectorPluginProperties
    );
    const index = connectorTypesWithSVG.findIndex(
      (eachConnectorDataWithSvgArray) =>
        eachConnectorDataWithSvgArray.name === eachConnectorType.name
    );

    if (index >= 0) {
      connectorTypesWithSVG[index].displayName = displayName;
    }
  });
  return connectorTypesWithSVG;
};
