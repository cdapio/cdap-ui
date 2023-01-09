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

import { Box, IconButton, Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Menu, { IActionsOptions } from 'components/common/InlayDrawerWidget/Menu';
import React from 'react';
import styled from 'styled-components';

interface IRecipeStepWidgetProps {
  headingText: string;
  onClose: () => void;
  showDivider: boolean;
  children: JSX.Element;
  actionsOptions: IActionsOptions[];
  position: 'left' | 'right';
}

const Container = styled(Box)`
  width: 500px;
  height: calc(100vh - 232px);
  padding-left: 20px;
  padding-right: 10px;
  overflow: scroll;
  border-left: 1px solid ${grey[300]};
`;

const Divider = styled.div`
  width: 1px;
  height: 28px;
  background-color: ${grey[300]};
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const DrawerWidgetTitleLabel = styled(Typography)`
  &.MuiTypography-body1 {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: 0.15;
    color: ${grey[900]};
  }
`;

const HeaderIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

const HeaderStyle = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftContainer = styled(Container)`
  border-left: none;
  border-right: 1px solid ${grey[300]};
`;

const StyledIconButton = styled(IconButton)`
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
`;

const getContainerComponent = (position: 'left' | 'right') => {
  if (position === 'left') {
    return LeftContainer;
  }
  return Container;
};

export const getTestIdString = (label: string) =>
  label
    .trim()
    .split(' ')
    .join('-')
    .toLowerCase();

/**
 *
 * @param headingText - text to be displayed as header of the panel
 * @param onClose - handles event triggered when close icon is clicked
 * @param showDivider - when set to true, displays a divider to the left side of the close icon, generally used to separate close icon from other action icons
 * @param children - the child component to be rendered as body in this panel
 * @param actionsOptions - the options to be rendered inside the actions dropdown, an array of objects
 * @param position - the position of the panel, either left or right, based on how components are positioned in parent. by default position is right
 * @returns InlayDrawerWidget component
 */

export default function InlayDrawerWidget({
  headingText,
  onClose,
  showDivider,
  children,
  actionsOptions,
  position = 'right',
}: IRecipeStepWidgetProps) {
  const PanelContainer = getContainerComponent(position);

  return (
    <PanelContainer role="presentation" data-testid="column-view-panel-parent">
      <HeaderStyle>
        <DrawerWidgetTitleLabel data-testid="drawer-widget-heading">
          {headingText}
        </DrawerWidgetTitleLabel>
        <HeaderIconWrapper>
          {actionsOptions.length && <Menu dropdownOptions={actionsOptions} />}
          {showDivider && <Divider />}
          <StyledIconButton
            data-testid="drawer-widget-close-round-icon"
            aria-label="close-icon"
            onClick={onClose}
          >
            <CloseRoundedIcon color="action" />
          </StyledIconButton>
        </HeaderIconWrapper>
      </HeaderStyle>
      {children}
    </PanelContainer>
  );
}
