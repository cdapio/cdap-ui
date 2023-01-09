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
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import React from 'react';
import styled, { css } from 'styled-components';
import grey from '@material-ui/core/colors/grey';

interface IRecipeStepWidgetProps {
  headingText: string;
  onClose: () => void;
  showDivider: boolean;
  children: JSX.Element;
  templateActions: any;
  position?: 'left' | 'right';
}

export interface ITemplateActionMethod {
  string: string | (() => JSX.Element);
}

const borderLeftDrawer = css`
  border-left: 1px solid ${grey[300]};
`;

const borderRightDrawer = css`
  border-right: 1px solid ${grey[300]};
`;

const drawerContainerStyles = css`
  width: 500px;
  height: calc(100vh - 232px);
  min-height: 300px;
  padding-left: 20px;
  padding-right: 10px;
  overflow-y: scroll;
`;

const LeftContainer = styled(Box)`
  ${drawerContainerStyles}
  ${borderRightDrawer}
`;

const RightContainer = styled(Box)`
  ${drawerContainerStyles}
  ${borderLeftDrawer}
`;

const HeaderStyle = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledIconButton = styled(IconButton)`
  cursor: pointer;
  display: flex;
  justify-content: flex-end !important;
`;

const Divider = styled.div`
  width: 1px;
  height: 28px;
  background-color: #dadce0;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const HeaderIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

const DrawerWidgetTitleLabel = styled(Typography)`
  &.MuiTypography-body1 {
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: 0.15;
    color: grey[900];
  }
`;
const DownloadMenuActionWrapper = styled(Box)`
  display: flex;
`;

const StyledButton = styled(IconButton)`
  cursor: pointer;
  &.MuiIconButton-root {
    padding: 10px;
  }
`;

const getTestIdString = (label) =>
  label
    .trim()
    .split(' ')
    .join('-')
    .toLowerCase();

const TemplateActions = ({ templateActions }) => {
  return (
    <DownloadMenuActionWrapper data-testid="header-action-template-parent">
      {templateActions.map((eachTemplateAction) => {
        const { iconClickHandler: onIconButtonClick } = eachTemplateAction;
        const IconComponent = eachTemplateAction.getIconComponent();
        const testId = getTestIdString(eachTemplateAction.name);
        return (
          <StyledButton data-testid={`button-${testId}`} onClick={onIconButtonClick}>
            <IconComponent />
          </StyledButton>
        );
      })}
    </DownloadMenuActionWrapper>
  );
};

/**
 *
 * @param headingText - text to be displayed as header of the panel
 * @param onClose - handles event triggered when close icon is clicked
 * @param showDivider - when set to true, displays a divider to the left side of the close icon, generally used to separate close icon from other action icons
 * @param children - the child component to be rendered as body in this panel
 * @param templateActions - an array of object, that defines the action icons to generate the actions template
 * @param position - the position of the panel, either left or right, based on how components are positioned in parent. by default position is right
 * @returns InlayDrawerWidget component
 */
export default function InlayDrawerWidget({
  headingText,
  onClose,
  showDivider,
  children,
  templateActions,
  position = 'right',
}: IRecipeStepWidgetProps) {
  const Container = position === 'left' ? LeftContainer : RightContainer;
  return (
    <Container role="presentation" data-testid="column-view-panel-parent">
      <HeaderStyle>
        <DrawerWidgetTitleLabel data-testid="drawer-widget-heading">
          {headingText}
        </DrawerWidgetTitleLabel>
        <HeaderIconWrapper>
          {templateActions.length && <TemplateActions templateActions={templateActions} />}
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
      <>{children}</>
    </Container>
  );
}
