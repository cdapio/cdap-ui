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
import ConfigurableTab, {
  ITabConfigObj,
  TabLayoutEnum,
  ITabConfig,
} from 'components/shared/ConfigurableTab';
import { ActiveConnectionTab } from 'components/Connections/Create/CategorizedConnectors/ActiveTab';
import makeStyle from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core';

const useStyle = makeStyle<Theme>((theme) => {
  return {
    activeTabPane: {
      width: '100%',
    },
    tabContainer: {
      borderTop: `1px solid ${theme.palette.grey[400]}`,
    },
  };
});

interface ICategorizedConnectors {
  connectorsMap: Map<string, any[]>;
  allConnectorsPluginProperties: Map<string, any[]>;
  onActiveCategory: (activeCategory: string) => void;
  onConnectorSelection: (selectedConnection: any) => void;
}

export function CategorizedConnectors({
  connectorsMap: connectionsTypeMap,
  allConnectorsPluginProperties: allConnectorsPluginProperties,
  onActiveCategory: onSelection,
  onConnectorSelection,
}: ICategorizedConnectors) {
  const classes = useStyle();
  const [search, setSearch] = React.useState('');
  if (!connectionsTypeMap) {
    return null;
  }
  const getAllConnections = () => {
    let allConnectors = [];
    for (const [_, connections] of connectionsTypeMap.entries()) {
      allConnectors = allConnectors.concat(connections);
    }
    return allConnectors;
  };
  const tabConfig: ITabConfigObj = {
    defaultTab: 'all',
    layout: TabLayoutEnum.VERTICAL,
    tabs: [
      {
        id: 'all',
        name: 'All',
        content: (
          <ActiveConnectionTab
            search={search}
            allConnectorsPluginProperties={allConnectorsPluginProperties}
            connector={getAllConnections()}
            onConnectorSelection={onConnectorSelection}
            onSearchChange={setSearch}
          />
        ),
        paneClassName: classes.activeTabPane,
      },
    ],
  };
  for (const category of connectionsTypeMap.keys()) {
    if (!tabConfig.defaultTab) {
      tabConfig.defaultTab = category;
    }
    const tab: ITabConfig = {
      id: category,
      name: category,
      content: (
        <ActiveConnectionTab
          allConnectorsPluginProperties={allConnectorsPluginProperties}
          connector={connectionsTypeMap.get(category)}
          onConnectorSelection={onConnectorSelection}
          search={search}
          onSearchChange={setSearch}
        />
      ),
      contentClassName: category,
      paneClassName: classes.activeTabPane,
    };
    tabConfig.tabs.push(tab);
  }

  if (!tabConfig.tabs.length) {
    return null;
  }
  return (
    <React.Fragment>
      <ConfigurableTab
        className={classes.tabContainer}
        onTabClick={onSelection}
        tabClassName="size1-5x"
        tabConfig={tabConfig}
      />
    </React.Fragment>
  );
}
