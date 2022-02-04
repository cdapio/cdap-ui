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

import React, { useEffect, useState } from 'react';

import { myRemoveCamelCase } from 'services/filters/removeCamelCase';
import AvailablePluginsStore from 'services/AvailablePluginsStore';
import { useOnUnmount } from 'services/react/customHooks/useOnUnmount';
import { shouldShowCustomIcon, getCustomIconSrc, filterPlugins, generateLabel } from './helpers';

interface ISidePanelProps {
  itemGenericName: string;
  groups: any;
  groupGenericName: string;
  onPanelItemClick: any;
}

export const SidePanel = ({
  itemGenericName,
  groups,
  groupGenericName,
  onPanelItemClick,
}: ISidePanelProps) => {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [sidePanelViewType, setSidePanelViewType] = useState<string>('icon');
  const [openedGroup, setOpenedGroup] = useState(groups[0].name);
  const groupWrapperHeight = 'calc(100% - ' + (groups.length * 35 - 35 - 1) + 'px)';
  const [pluginsMap, setPluginsMap] = useState({});
  let AvailablePluginsStoreSubscription;

  useEffect(() => {
    AvailablePluginsStoreSubscription = AvailablePluginsStore.subscribe(() => {
      const all = AvailablePluginsStore.getState();
      if (all.plugins) {
        setPluginsMap(all.plugins.pluginsMap);
      }
    });
  }, []);

  useOnUnmount(() => {
    AvailablePluginsStoreSubscription();
  });

  const handleSetSearch = (text) => {
    setSearchText(text);
  };

  const handleSetSidePanelViewType = (viewType: string) => {
    setSidePanelViewType(viewType);
  };

  const handleClickGroup = (groupName: string) => {
    setOpenedGroup(groupName);
  };

  const handleClickPlugin = (event, plugin) => {
    // the angular controller function has event as an input
    onPanelItemClick(event, plugin);
  };

  const renderIconPlugins = (plugins: [any]) => {
    return plugins.map((plugin) => {
      const showCustomIcon = shouldShowCustomIcon(plugin, pluginsMap);
      return (
        <div
          role="button"
          className={`plugin-item ${plugin.nodeClass ? plugin.nodeClass : ''} ${
            plugin.hovering ? 'hovered' : ''
          }`}
          // need to implement my popover
          // my-popover
          // data-placement="right"
          // data-template={plugin.template}
          // content-data={plugin}
          // data-popover-context={'MySidePanel'} // whole controller
          // end plugin stuff
          onClick={(event) => handleClickPlugin(event, plugin)}
          data-cy={`plugin-${plugin.name}-${plugin.type}`}
        >
          {showCustomIcon && (
            <div className="text-center fa icon-container">
              <img src={getCustomIconSrc(plugin, pluginsMap)} />
            </div>
          )}
          {!showCustomIcon && <div className={`text-center fa ${plugin.icon}`}> </div>}
          <div className="name plugin-name">{generateLabel(plugin, pluginsMap)}</div>
          <div className="plugin-badge">T</div>
        </div>
      );
    });
  };

  const renderItemPlugins = (plugins: [any]) => {
    return plugins.map((plugin) => {
      <div
        className={`plugin-item ${plugin.nodeClass}`}
        onClick={(event) => handleClickPlugin(event, plugin)}
        data-cy={`plugin-${plugin.name}-${plugin.type}`}
      >
        <div className={`text-center fa ${plugin.icon}`}></div>
        <span
          className="name"
          // need to implement my popover
          // my-popover
          // data-placement="right"
          // data-template={plugin.template}
          // content-data={plugin}
          // data-popover-context={'MySidePanel'} // whole controller
          // end popover stuff
        >
          {myRemoveCamelCase(plugin.name || plugin.pluginTemplate)}
        </span>
        <span className="plugin-badge">T</span>
      </div>;
    });
  };

  const renderGroups = () => {
    // ordering still not the same
    return groups.map((group, i) => {
      const thisGroupOpened = openedGroup === group.name;
      return (
        <div
          role="button"
          onClick={() => handleClickGroup(group.name)}
          style={thisGroupOpened ? { height: groupWrapperHeight } : {}}
          className={`item  ${thisGroupOpened ? 'item-open' : ''}`}
          data-cy={`plugin-${group.name}-group`}
        >
          <div className="text-left item-heading">
            <span className={`fa ${thisGroupOpened ? 'fa-caret-down' : 'fa-caret-right'}`}></span>
            <span className="name">{group.name} </span>
            <div className="pull-right">
              <span className="badge">{group.plugins.length}</span>
            </div>
          </div>
          {openedGroup === null ||
            (openedGroup === group.name && (
              <div className="item-body-wrapper">
                <div
                  className={`item-body ${
                    sidePanelViewType === 'icon' ? 'view-icon' : 'view-list'
                  }`}
                >
                  {sidePanelViewType === 'icon' &&
                    renderIconPlugins(filterPlugins(searchText, group.plugins))}
                  {group.plugins.length === 0 && (
                    <div className="no-item-message">
                      <h4>No {itemGenericName} found.</h4>
                    </div>
                  )}
                  {sidePanelViewType === 'list' &&
                    renderItemPlugins(filterPlugins(searchText, group.plugins))}
                </div>
              </div>
            ))}
        </div>
      );
    });
  };

  return (
    <div className="side-panel text-center left">
      <div className="hydrator-filter text-left">
        <input
          className="form-control"
          placeholder="Filter"
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetSearch(e.target.value)}
        />
        <div className="btn-group">
          <div
            role="button"
            className={`btn btn-default btn-sm  ${sidePanelViewType === 'list' ? 'active' : ''}`}
            onClick={() => handleSetSidePanelViewType('list')}
          >
            <span className="fa fa-list-ul"></span>
          </div>
          <div
            role="button"
            className={`btn btn-default btn-sm ${sidePanelViewType === 'icon' ? 'active' : ''}`}
            onClick={() => handleSetSidePanelViewType('list')}
          >
            <span className="fa fa-th"></span>
          </div>
        </div>
      </div>

      <div className="groups-container">
        {renderGroups()}

        {groups.length === 0 && (
          <div>
            <h4>No {groupGenericName} found.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
