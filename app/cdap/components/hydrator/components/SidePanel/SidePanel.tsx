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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Icon,
  ListItem,
  Typography,
} from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import ListIcon from '@material-ui/icons/List';
import styled, { css } from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// the old styling was pretty specific and we can't get rid of the classname
// otherwise the rest of the styling won't work so the && > && > && is a way
// to make this styling more specific without using !important
const GroupsContainer = styled.div`
  && {
    && {
      && {
        height: auto;
        overflow: scroll;
        position: absolute;
        right: 1px;
      }
    }
  }
`;

const ItemBodyWrapper = styled.div`
  width: 100%;
  background: white;
`;

const StyledGroupName = styled(Typography)`
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledAccordion = styled(Accordion)`
  background: #eeeeee;
  &.Mui-expanded {
    margin: 0px;
    overflow: scroll;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  &.Mui-expanded {
    min-height: 0px;
  }
  ${css`
    .MuiAccordionSummary-content.Mui-expanded {
      margin: 12px 0;
    }
  `}
`;
const ListOrIconsButton = styled(Button)`
  min-width: 20px;
  padding: 5px;
  margin-left: 5px;
  box-shadow: 0;
  background: white;
`;

interface ISidePanelProps {
  itemGenericName: string;
  groups: any[];
  groupGenericName: string;
  onPanelItemClick: (event: any, plugin: any) => void;
}

export const SidePanel = ({
  itemGenericName,
  groups,
  groupGenericName,
  onPanelItemClick,
}: ISidePanelProps) => {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [sidePanelViewType, setSidePanelViewType] = useState<string>('icon');
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

  const handleClickPlugin = (event, plugin) => {
    // the angular controller function has event as an input
    onPanelItemClick(event, plugin);
  };

  const renderPlugins = (plugins: [any]) => {
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
          {sidePanelViewType === 'icon' && (
            <>
              {showCustomIcon && (
                <div className="text-center fa icon-container">
                  <img src={getCustomIconSrc(plugin, pluginsMap)} />
                </div>
              )}
              {!showCustomIcon && <div className={`text-center fa ${plugin.icon}`}> </div>}
              <div className="name plugin-name">{generateLabel(plugin, pluginsMap)}</div>
            </>
          )}
          {sidePanelViewType === 'list' && (
            <ListItem>
              <Icon className={`text-center fa ${plugin.icon}`} />
              <span
                style={{ marginLeft: '5px' }}
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
            </ListItem>
          )}
          <div className="plugin-badge">T</div>
        </div>
      );
    });
  };

  const renderAccGroups = () => {
    return groups.map((group, i) => {
      return (
        <StyledAccordion elevation={0} square defaultExpanded={i === 0}>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls=""
            id={`${group.name}-acc-summary`}
            data-cy={`plugin-${group.name}-group`}
          >
            <Chip label={group.plugins.length} size="small" />
            <StyledGroupName>{group.name}</StyledGroupName>
          </StyledAccordionSummary>
          <AccordionDetails className="item">
            <ItemBodyWrapper className="item-body-wrapper">
              <div
                className={`item-body ${sidePanelViewType === 'icon' ? 'view-icon' : 'view-list'}`}
                style={{ overflow: 'scroll' }}
              >
                {renderPlugins(filterPlugins(searchText, group.plugins))}
                {group.plugins.length === 0 && (
                  <div className="no-item-message">
                    <h4>No {itemGenericName} found.</h4>
                  </div>
                )}
              </div>
            </ItemBodyWrapper>
          </AccordionDetails>
        </StyledAccordion>
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
          <ListOrIconsButton
            size="small"
            variant={'contained'}
            className={`${sidePanelViewType === 'list' ? 'active' : ''}`}
            onClick={() => handleSetSidePanelViewType('list')}
          >
            <ListIcon />
          </ListOrIconsButton>
          <ListOrIconsButton
            variant={'contained'}
            size="small"
            className={`${sidePanelViewType === 'icon' ? 'active' : ''}`}
            onClick={() => handleSetSidePanelViewType('icon')}
          >
            <AppsIcon />
          </ListOrIconsButton>
        </div>
      </div>

      <GroupsContainer className="groups-container">
        {renderAccGroups()}

        {groups.length === 0 && (
          <div>
            <h4>No {groupGenericName} found.</h4>
          </div>
        )}
      </GroupsContainer>
    </div>
  );
};

export default SidePanel;
