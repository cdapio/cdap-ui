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
import { ReactNode } from 'react';
import RecipeWidgetHeading from 'components/RecipeSteps/RecipeWidgetHeading';

export interface IColumnViewWidget {
  headingText: ReactNode;
  onClose: () => void;
  onSearchTermChange: (searchedTerm: string) => void;
  children: JSX.Element;
  searchValue: string;
  showDivider: boolean;
}

const DrawerContainerStyle = styled(Box)`
  width: 460px;
  height: calc(100vh - 190px);
  border-right: 1px solid #e0e0e0;
  padding-left: 20px;
  padding-right: 20px;
`;

const HeaderStyle = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTextWithBackIcon = styled.div`
  display: flex;
  align-items: center;
  padding-left: 30px;
`;

const CloseButtonStyle = styled(IconButton)`
  cursor: pointer;
  display: flex;
  justify-content: flex-end !important;
`;

const Divider = styled.div`
  width: 1px;
  height: 28px;
  background-color: #dadce0;
  margin-left: 10px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const HeaderIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

export default function({ headingText, onClose, showDivider, headerActionTemplate, children }) {
  return (
    <DrawerContainerStyle role="presentation" data-testid="column-view-panel-parent">
      <HeaderStyle>
        <HeaderTextWithBackIcon>
          <RecipeWidgetHeading headingText={headingText} />
        </HeaderTextWithBackIcon>
        <HeaderIconWrapper>
          {headerActionTemplate && <Typography component="div">{headerActionTemplate}</Typography>}
          {showDivider && <Divider />}
          <CloseButtonStyle
            data-testid="drawer-widget-close-round-icon"
            aria-label="close-icon"
            onClick={onClose}
          >
            <CloseRoundedIcon color="action" />
          </CloseButtonStyle>
        </HeaderIconWrapper>
      </HeaderStyle>
      <>{children}</>
    </DrawerContainerStyle>
  );
}
