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
import styled from 'styled-components';

interface IRecipeStepWidgetProps {
  headingText: string;
  onClose: () => void;
  showDivider: boolean;
  children: JSX.Element;
  templateActions: any;
  position: 'left' | 'right';
}

export interface ITemplateActionMethod {
  string: string | (() => JSX.Element);
}

const DrawerContainerStyle = styled(Box)`
  width: 500px;
  height: calc(100vh - 232px);
  min-height: 300px;
  border-right: 1px solid #e0e0e0;
  padding-left: 20px;
  padding-right: 10px;
  overflow-y: scroll;
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
            <IconComponent data-testid={`icon-${testId}`} />
          </StyledButton>
        );
      })}
    </DownloadMenuActionWrapper>
  );
};

export default function InlayDrawerWidget({
  headingText,
  onClose,
  showDivider,
  children,
  templateActions,
}: IRecipeStepWidgetProps) {
  return (
    <DrawerContainerStyle role="presentation" data-testid="column-view-panel-parent">
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
    </DrawerContainerStyle>
  );
}
