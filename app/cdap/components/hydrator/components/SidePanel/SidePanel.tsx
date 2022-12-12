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

import React, { useEffect, useState, MouseEvent } from 'react';

import { shouldShowCustomIcon, getCustomIconSrc, filterPlugins, generateLabel } from './helpers';
import { Button, Chip, Box, Typography } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AppsIcon from '@material-ui/icons/Apps';
import ListIcon from '@material-ui/icons/List';
import { createGlobalStyle } from 'styled-components';
import debounce from 'lodash/debounce';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircle from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import RichTooltip from 'components/shared/RichToolTip';
import {
  EllipsisIconButton,
  FontIconContainer,
  GroupsContainer,
  IconImg,
  IconsMenuContainer,
  ItemBodyWrapper,
  ListCustomIcon,
  ListIconImg,
  ListOrIconsButton,
  PluginBadge,
  PluginButton,
  PluginListItem,
  PluginNameContainer,
  PluginNameContainerList,
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledGroupName,
  ToolTipButtonContainer,
  TooltipContentBox,
} from './sharedStyled';
import ChangeVersionMenu from './ChangeVersionMenu';

/**
 * Mui creates tooltips at the bottom of the dom tree
 * so if you wrap the tooltip in a normal styled component
 * the style won't apply to that element - this is a way
 * to just insert regular css onto the page using styled-comps
 */
export const GlobalTooltipStyle = createGlobalStyle`
 .MuiTooltip-popper {
   .MuiTooltip-tooltip {
     background-color: black;
   }
 }
`;

const organizePlugins = (pluginGroups, availablePlugins) => {
  pluginGroups.forEach((group) => {
    if (!group.plugins?.length) {
      return;
    }
    group.plugins.forEach((plugin) => {
      plugin.displayName =
        generateLabel(plugin, availablePlugins.plugins.pluginsMap) || plugin.name;
      plugin.showCustomIcon = shouldShowCustomIcon(plugin, availablePlugins.plugins.pluginsMap);
      plugin.customIconSrc = getCustomIconSrc(plugin, availablePlugins.plugins.pluginsMap);
    });

    group.plugins.sort((pluginA, pluginB) => {
      return pluginA.displayName < pluginB.displayName ? -1 : 1;
    });
  });

  return pluginGroups;
};

interface ISidePanelProps {
  availablePlugins: any;
  itemGenericName: string;
  groups: any[];
  groupGenericName: string;
  onPanelItemClick: (event: any, plugin: any) => void;
  createPluginTemplate: (node: any, mode: 'edit' | 'create') => void;
}

// this value is definied once and doesn't change dynamically
let allGroups;

/**
 * There are tons of rerenders on this component right now - unfortunately its difficult to tackle
 * while we're using angular to manage the state. Will be tackled soon.
 *
 * There are many modes to a plugin and things you can do - most are handled by onPanelItemClick which wraps
 * create template, add node, delete template
 * *  create template - creates a new template version of the plugin - it uses plugin.pluginTemplate in order
 *    to tell that its a template
 * *  delete template - deletes a plugin template - only available on a created template
 * *  add node - adds a node to the canvas
 *
 * -  changing version - you can also change the version from inside of the popover - as far as
 *    i can tell how it saves the new default version is by adding the node to the canvas - the
 *    old angular way of doing things with two way data binding along with passing around all of the
 *    plugin template states in content data etc makes this extremely confusing. It changes
 *    versions by altering the plugin.defaultArtifact in the plugin array and then adding
 *    that altered plugin.defaultArtifact to the canvas and it automatically sends that to be saved...
 */
export const SidePanel = ({
  availablePlugins,
  itemGenericName,
  groups,
  groupGenericName,
  onPanelItemClick,
  createPluginTemplate,
}: ISidePanelProps) => {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [pluginGroups, setPluginGroups] = useState(groups);
  const [openedAccordions, setOpenedAccordions] = useState([]);
  const [sidePanelViewType, setSidePanelViewType] = useState<string>('icon');
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // keep track of number of plugins so if you create a template we can rerun organizePlugins
  const numberOfPlugins = groups.reduce((prev, curr) => {
    return (prev += curr.plugins.length);
  }, 0);

  const handlePopperButtonClick = (popoverId: string) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    setOpenPopoverId(openPopoverId === popoverId ? null : popoverId);
  };

  const handlePopoverClose = () => {
    setOpenPopoverId(null);
  };

  useEffect(() => {
    // set first group opened
    if (groups && groups.length) {
      allGroups = groups.map((group) => group.name);
      setOpenedAccordions([groups[0].name]);
    }
  }, [groups, groups.length]);

  useEffect(() => {
    if (availablePlugins && availablePlugins.plugins) {
      setPluginGroups(organizePlugins(pluginGroups, availablePlugins));
    }
  }, [availablePlugins]);

  useEffect(() => {
    setPluginGroups(organizePlugins(pluginGroups, availablePlugins));
  }, [numberOfPlugins, JSON.stringify(groups)]);

  const handleSetSearch = debounce((text) => {
    // open all accordions when searching (then filtered closes them if no plugins)
    if (text === '' || text === undefined) {
      setOpenedAccordions([groups[0].name]);
      setSearchText(text);
    } else {
      setOpenedAccordions(allGroups);
      setSearchText(text);
    }
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

    handlePopoverClose();
    setOpenedAccordions(accordions);
  };

  const handleSetSidePanelViewType = (viewType: string) => {
    setSidePanelViewType(viewType);
  };

  const handleClickPlugin = (event, plugin) => {
    // the angular controller function has event as an input
    handlePopoverClose();
    onPanelItemClick(event, plugin);
  };

  const handleChangePluginVersion = (plugin) => {
    handleClickPlugin(null, plugin);
  };

  const renderPlugins = (plugins: [any]) => {
    return plugins.map((plugin) => {
      const id = `plugin-${plugin.name}-${plugin.type}`;
      const label = plugin.displayName || plugin.name;
      const createOrEditLabel = plugin.pluginTemplate ? 'Edit' : 'Create';
      const handleClickShowDetails = handlePopperButtonClick(id);
      const ToolTipContent = (
        <TooltipContentBox>
          <Box>
            <Typography variant="h4">{label}</Typography>
            <Button
              aria-label={`show more ${label}`}
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                createPluginTemplate(plugin, createOrEditLabel.toLowerCase() as 'edit' | 'create');
                handlePopoverClose();
              }}
            >
              <ToolTipButtonContainer>
                <AddCircle /> {`${createOrEditLabel} Template`}
              </ToolTipButtonContainer>
            </Button>
            {plugin.pluginTemplate && (
              <Button
                onClick={() => {
                  onPanelItemClick(null, { action: 'deleteTemplate', contentData: plugin });
                  handlePopoverClose();
                }}
              >
                <ToolTipButtonContainer>
                  <DeleteIcon /> Delete Template
                </ToolTipButtonContainer>
              </Button>
            )}
          </Box>
          <Box>
            <Typography variant="h6">
              {plugin.defaultArtifact?.version} {plugin.defaultArtifact?.scope}
            </Typography>
            <ChangeVersionMenu changePluginVersion={handleChangePluginVersion} plugin={plugin} />
          </Box>
          <Box>
            <Typography>{plugin.description}</Typography>
          </Box>
        </TooltipContentBox>
      );

      const MoreIconButton = sidePanelViewType === 'icon' ? <MoreVertIcon /> : <ArrowRightIcon />;

      return (
        <IconsMenuContainer>
          <PluginButton
            key={id}
            onClick={(event) => handleClickPlugin(event, plugin)}
            data-cy={id}
            data-testid={id}
            sidePanelViewType={sidePanelViewType}
          >
            {// wait till display name is loaded because display name is propagated at the same
            // time as the other things we need
            plugin.displayName && (
              <RichTooltip
                open={openPopoverId === id}
                placement="right"
                onClose={handlePopoverClose}
                content={ToolTipContent}
              >
                <EllipsisIconButton
                  aria-label={`show more ${label}`}
                  component="span"
                  onClick={handleClickShowDetails}
                >
                  {MoreIconButton}
                </EllipsisIconButton>
              </RichTooltip>
            )}
            {sidePanelViewType === 'icon' && (
              <div>
                {plugin.showCustomIcon && (
                  <FontIconContainer className="fa">
                    <IconImg src={plugin.customIconSrc} />
                  </FontIconContainer>
                )}
                {!plugin.showCustomIcon && (
                  <FontIconContainer className={`fa ${plugin.icon}`}> </FontIconContainer>
                )}

                <PluginNameContainer>{label || plugin.pluginTemplate}</PluginNameContainer>
              </div>
            )}
            {sidePanelViewType === 'list' && (
              <PluginListItem>
                {plugin.showCustomIcon && (
                  <ListCustomIcon className="fa">
                    <ListIconImg src={plugin.customIconSrc} />
                  </ListCustomIcon>
                )}
                {!plugin.showCustomIcon && (
                  <ListCustomIcon className={`fa ${plugin.icon}`}> </ListCustomIcon>
                )}
                <PluginNameContainerList>{label || plugin.pluginTemplate}</PluginNameContainerList>
              </PluginListItem>
            )}
            {plugin.pluginTemplate && <PluginBadge>T</PluginBadge>}
          </PluginButton>
        </IconsMenuContainer>
      );
    });
  };

  const renderAccGroups = () => {
    if (!groups || groups.length === 0) {
      return null;
    }

    return pluginGroups.map((group, i) => {
      const plugins = filterPlugins(searchText, group.plugins);
      // open accordion if the user searches for a plugin and a plugin
      // is in that group or use the accordion state

      let expanded = openedAccordions.indexOf(group.name) !== -1;
      if (plugins.length === 0) {
        // closes accordion if no plugins are present after searching.
        expanded = false;
      }

      return (
        <StyledAccordion
          elevation={0}
          square
          expanded={expanded}
          onClick={() => handleOpenAccordion(group.name)}
          data-cy={`plugin-${group.name}-group`}
          data-testid={`plugin-${group.name}-group`}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls=""
            id={`${group.name}-acc-summary`}
            data-cy={`plugin-${group.name}-group-summary`}
            data-testid={`plugin-${group.name}-group-summary`}
          >
            <Chip label={plugins.length} size="small" />
            <StyledGroupName>{group.name}</StyledGroupName>
          </StyledAccordionSummary>
          <StyledAccordionDetails
            className="item"
            data-testid={`plugin-${group.name}-group-details`}
          >
            <ItemBodyWrapper className="item-body-wrapper">
              <div
                className={`item-body ${sidePanelViewType === 'icon' ? 'view-icon' : 'view-list'}`}
                style={{ overflow: 'scroll' }}
              >
                {renderPlugins(plugins)}
                {plugins.length === 0 && (
                  <div className="no-item-message">
                    <h4>No {itemGenericName === '' ? itemGenericName : 'items'} found.</h4>
                  </div>
                )}
              </div>
            </ItemBodyWrapper>
          </StyledAccordionDetails>
        </StyledAccordion>
      );
    });
  };

  return (
    <div className="side-panel text-center left">
      <GlobalTooltipStyle />
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
