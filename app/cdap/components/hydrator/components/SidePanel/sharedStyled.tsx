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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Icon,
  Box,
  IconButton,
  ListItem,
  Typography,
} from '@material-ui/core';

import styled, { css } from 'styled-components';

export const ToolTipButtonContainer = styled.div`
  color: blue;
  text-transform: none;
  font-size: 13px;
  svg {
    vertical-align: middle;
    height: 0.8em;
    width: 0.8em;
  }
`;

/**
 * the old styling was too specific and we can't get rid of the classname
 * otherwise the rest of the styling won't work so the && > && > && is a way
 * to make this styling more specific without using !important
 */
export const GroupsContainer = styled.div`
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

export const ItemBodyWrapper = styled.div`
  background: white;
  border: none;
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
`;

export const StyledGroupName = styled(Typography)`
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StyledAccordion = styled(Accordion)`
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

export const StyledAccordionDetails = styled(AccordionDetails)`
  background: #ffffff;
  background-clip: content-box;
  padding: 0;
  margin-top: 5px;
`;

export const StyledAccordionSummary = styled(AccordionSummary)`
  &.Mui-expanded {
    min-height: 0px;
  }
  ${css`
    .MuiAccordionSummary-content.Mui-expanded {
      margin: 12px 0;
    }
  `}
`;

export const ListOrIconsButton = styled(Button)`
  min-width: 20px;
  padding: 5px;
  margin-left: 5px;
  box-shadow: 0;
  background: white;
`;

export const EllipsisIconButton = styled(IconButton)`
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
export const PluginButton = styled(Button)`
  color: #666666;
  text-transform: none;
  min-height: ${(props) => (props.sidePanelViewType === 'icon' ? '85px' : '0')};
  &:hover {
    ${EllipsisIconButton} {
      visibility: visible;
    }
  }
`;

export const IconsMenuContainer = styled.div`
  flex: 0 1 0;
  min-width: 33%;
  display: flex;
  flex-direction: column;
  vertical-align: top;
`;

export const FontIconContainer = styled.div`
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
export const PluginNameContainer = styled.div`
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

export const PluginNameContainerList = styled.div`
  margin-left: 5px;
  width: 100%;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const IconImg = styled.img`
  width: 32px;
  height: 32px;
  margin: 0 auto;
`;

export const ListIconImg = styled.img`
  width: 19px;
  height: 19px;
  margin: 0 auto;
`;

export const ListCustomIcon = styled(Icon)`
  && {
    && {
      font-size: 19px;
    }
  }
`;

export const PluginListItem = styled(ListItem)`
  padding: 0;
`;

export const TooltipContentBox = styled(Box)`
  max-width: 300px;
`;

export const PluginBadge = styled.div`
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
