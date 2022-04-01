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
  Tooltip,
  Typography,
} from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import ListIcon from '@material-ui/icons/List';
import styled, { css } from 'styled-components';
import debounce from 'lodash/debounce';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// the old styling was pretty specific and we can't get rid of the classname
// otherwise the rest of the styling won't work so the && > && > && is a way
// to make this styling more specific without using !important
const GroupsContainer = styled.div`
  && {
    && {
      && {
        height: auto;
        overflow-y: scroll;
        position: absolute;
        padding: 0;
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
    margin: 0;
    padding: 0;
    overflow-y: scroll;
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

const TooltipText = styled.div`
  font-size: 14px;
  line-height: 14px;
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
  const [pluginGroups, setPluginGroups] = useState(groups);
  const [openedAccordions, setOpenedAccordions] = useState([]);
  const [sidePanelViewType, setSidePanelViewType] = useState<string>('icon');
  let AvailablePluginsStoreSubscription;

  useEffect(() => {
    // set first group opened
    if (groups) {
      setOpenedAccordions([groups[0].name]);
    }
  }, []);

  useEffect(() => {
    AvailablePluginsStoreSubscription = AvailablePluginsStore.subscribe(() => {
      const all = AvailablePluginsStore.getState();
      if (all.plugins) {
        const newPluginGroups = [...pluginGroups];
        newPluginGroups.forEach((group) => {
          group.plugins.forEach((plugin) => {
            // add the display name and show custom icon to the plugins
            plugin.displayName = generateLabel(plugin, all.plugins.pluginsMap);
            plugin.showCustomIcon = shouldShowCustomIcon(plugin, all.plugins.pluginsMap);
            plugin.customIconSrc = getCustomIconSrc(plugin, all.plugins.pluginsMap);
          });
        });

        setPluginGroups(newPluginGroups);
      }
    });
  }, []);

  useOnUnmount(() => {
    AvailablePluginsStoreSubscription();
  });

  const handleSetSearch = debounce((text) => {
    setSearchText(text);
  }, 400);

  const handleOpenAccordion = (name: string) => {
    // openAccordions handles the opened accordion state - necessary to have search
    // open accordions
    const accordions = [...openedAccordions];
    const accIndex = accordions.indexOf(name);
    if (accIndex === -1) {
      accordions.push(name);
    } else {
      accordions.splice(accIndex, 1);
    }

    setOpenedAccordions(accordions);
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
      const id = `plugin-${plugin.displayName}-${plugin.type}`;
      const label = plugin.displayName || plugin.name;
      return (
        <Tooltip
          title={
            <TooltipText>
              <span>{label}</span>
              <br />
              <br />
              <span>{plugin.description}</span>
            </TooltipText>
          }
          arrow
          placement="right"
        >
          <div
            role="button"
            className={`plugin-item ${plugin.nodeClass ? plugin.nodeClass : ''} ${
              plugin.hovering ? 'hovered' : ''
            }`}
            key={id}
            onClick={(event) => handleClickPlugin(event, plugin)}
            data-cy={id}
          >
            {sidePanelViewType === 'icon' && (
              <>
                {plugin.showCustomIcon && (
                  <div className="text-center fa icon-container">
                    <img src={plugin.customIconSrc} />
                  </div>
                )}
                {!plugin.showCustomIcon && <div className={`text-center fa ${plugin.icon}`}> </div>}
                <div className="name plugin-name">{label}</div>
              </>
            )}
            {sidePanelViewType === 'list' && (
              <ListItem>
                <Icon className={`text-center fa ${plugin.icon}`} />
                <span style={{ marginLeft: '5px' }} className="name">
                  {myRemoveCamelCase(label || plugin.pluginTemplate)}
                </span>
              </ListItem>
            )}
            <div className="plugin-badge">T</div>
          </div>
        </Tooltip>
      );
    });
  };

  const renderAccGroups = () => {
    return pluginGroups.map((group, i) => {
      const plugins = filterPlugins(searchText, group.plugins);
      // open accordion if the user searches for a plugin and a plugin
      // is in that group or use the accordion state
      const expanded =
        searchText !== '' && searchText !== undefined
          ? plugins.length
          : openedAccordions.indexOf(group.name) !== -1;
      return (
        <StyledAccordion
          elevation={0}
          square
          expanded={expanded}
          onClick={() => handleOpenAccordion(group.name)}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls=""
            id={`${group.name}-acc-summary`}
            data-cy={`plugin-${group.name}-group`}
          >
            <Chip label={plugins.length} size="small" />
            <StyledGroupName>{group.name}</StyledGroupName>
          </StyledAccordionSummary>
          <AccordionDetails className="item">
            <ItemBodyWrapper className="item-body-wrapper">
              <div
                className={`item-body ${sidePanelViewType === 'icon' ? 'view-icon' : 'view-list'}`}
                style={{ overflow: 'scroll' }}
              >
                {renderPlugins(plugins)}
                {plugins.length === 0 && (
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
            disabled={sidePanelViewType === 'list'}
            onClick={() => handleSetSidePanelViewType('list')}
          >
            <ListIcon />
          </ListOrIconsButton>
          <ListOrIconsButton
            variant={'contained'}
            size="small"
            disabled={sidePanelViewType === 'icon'}
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
