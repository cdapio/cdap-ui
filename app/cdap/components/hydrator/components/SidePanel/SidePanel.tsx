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
  Box,
  Icon,
  IconButton,
  ListItem,
  Typography,
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AppsIcon from '@material-ui/icons/Apps';
import ListIcon from '@material-ui/icons/List';
import styled, { css, createGlobalStyle } from 'styled-components';
import debounce from 'lodash/debounce';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircle from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import RichTooltip from 'components/shared/RichToolTip';
import { ToolTipButtonContainer } from './sharedStyled';
import ChangeVersionMenu from './ChangeVersionMenu';

/**
 * the old styling was too specific and we can't get rid of the classname
 * otherwise the rest of the styling won't work so the && > && > && is a way
 * to make this styling more specific without using !important
 */
const GroupsContainer = styled.div`
  && {
    && {
      && {
        overflow-y: scroll;
        padding: 0;
        right: 1px;
        height: 100%;
        border: none;
      }
    }
  }
`;

const ItemBodyWrapper = styled.div`
  background: white;
  border: none;
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
`;

const StyledGroupName = styled(Typography)`
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledAccordion = styled(Accordion)`
  background: #eeeeee;
  :before {
    border: none;
  }

  &.Mui-expanded {
    margin: 0;
    padding: 0;
    overflow-y: scroll;
  }
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  background: #ffffff;
  background-clip: content-box;
  padding: 0;
  margin-top: 5px;
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

const EllipsisIconButton = styled(IconButton)`
  width: 0;
  height: 0;
  z-index: 10000;
  position: absolute;
  top: 6px;
  right: 2px;
  visibility: hidden;
`;

// show ellipsisIconButton when you hover PluginButton
//
const PluginButton = styled(Button)`
  color: #666666;
  text-transform: none;
  min-height: ${(props) => (props.sidePanelViewType === 'icon' ? '85px' : '0')};
  &:hover {
    ${EllipsisIconButton} {
      visibility: visible;
    }
  }
`;

const IconsMenuContainer = styled.div`
  flex: 0 1 0;
  min-width: 33%;
  display: flex;
  flex-direction: column;
  vertical-align: top;
`;

const FontIconContainer = styled.div`
  && {
    && {
      && {
        font-size: 32px;
        display: flex;
        flex-direction: column;
      }
    }
  }
`;

// creates a 2 line max wrap text container
const PluginNameContainer = styled.div`
  line-height: 14px;
  padding-top: 8px;
  overflow: hidden;
  font-weight: 500;
  display: -webkit-box;
  vertical-align: top;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  text-align: center;
  -webkit-box-orient: vertical;
`;

const PluginNameContainerList = styled.div`
  margin-left: 5px;
  width: 100%;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconImg = styled.img`
  width: 32px;
  height: 32px;
  margin: 0 auto;
`;

/**
 * Mui creates tooltips at the bottom of the dom tree
 * so if you wrap the tooltip in a normal styled component
 * the style won't apply to that element - this is a way
 * to just insert regular css onto the page using styled-comps
 */
const GlobalTooltipStyle = createGlobalStyle`
  .MuiTooltip-popper {
    .MuiTooltip-tooltip {
      background-color: black;
    }
  }
`;

const PluginListItem = styled(ListItem)`
  padding: 0;
`;

const TooltipContentBox = styled(Box)`
  max-width: 300px;
`;

const PluginBadge = styled.div`
  display: block;
  font-size: 8px;
  position: absolute;
  left: 90%;
  background: #d8d8d8;
  border-radius: 2px;

  padding: 3px;
  line-height: 8px;
  bottom: 3px;
`;

interface ISidePanelProps {
  itemGenericName: string;
  groups: any[];
  groupGenericName: string;
  onPanelItemClick: (event: any, plugin: any) => void;
  createPluginTemplate: (node: any, mode: 'edit' | 'create') => void;
}

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

  const handlePopperButtonClick = (popoverId: string) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();

    setOpenPopoverId(openPopoverId === popoverId ? null : popoverId);
  };

  const handlePopoverClose = () => {
    setOpenPopoverId(null);
  };

  let AvailablePluginsStoreSubscription;
  useEffect(() => {
    // set first group opened
    if (groups && groups.length) {
      setOpenedAccordions([groups[0].name]);
    }
  }, [groups, groups.length]);

  useEffect(() => {
    AvailablePluginsStoreSubscription = AvailablePluginsStore.subscribe(() => {
      const all = AvailablePluginsStore.getState();
      if (all.plugins) {
        // treat plugin group plugins as immutable
        const newPluginGroups = pluginGroups.map((group) => {
          const newGroup = { ...group, plugins: [] };
          newGroup.plugins = group.plugins
            .map((plugin) => {
              return {
                ...plugin,
                displayName: generateLabel(plugin, all.plugins.pluginsMap) || plugin.name,
                showCustomIcon: shouldShowCustomIcon(plugin, all.plugins.pluginsMap),
                customIconSrc: getCustomIconSrc(plugin, all.plugins.pluginsMap),
              };
            })
            .sort((pluginA, pluginB) => {
              return pluginA.displayName < pluginB.displayName ? -1 : 1;
            });
          return newGroup;
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
      const handleClickShowDetails = handlePopperButtonClick(id);
      const ToolTipContent = (
        <TooltipContentBox>
          <Box>
            <Typography variant="h6">{label}</Typography>
            <Button
              aria-label={`show more ${label}`}
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                createPluginTemplate(plugin, 'create');
                handlePopoverClose();
              }}
            >
              <ToolTipButtonContainer>
                <AddCircle /> Create Template
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
            <Typography>
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

                <PluginNameContainer>
                  {myRemoveCamelCase(label || plugin.pluginTemplate)}
                </PluginNameContainer>
              </div>
            )}
            {sidePanelViewType === 'list' && (
              <PluginListItem>
                <Icon className={`fa ${plugin.icon}`} />
                <PluginNameContainerList>
                  {myRemoveCamelCase(label || plugin.pluginTemplate)}
                </PluginNameContainerList>
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
          <StyledAccordionDetails className="item">
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
