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

import { Box, Container, Drawer } from '@material-ui/core';
import React, { Fragment } from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DrawerWidgetHeading from 'components/DrawerWidget/DrawerWidgetHeading';
import { IDrawerWidgetProps } from 'components/DrawerWidget/types';
import { BackIcon } from 'components/DrawerWidget/IconStore/BackIcon';
import styled from 'styled-components';

const DrawerContainer = styled(Container)`
  width: 460px;
  height: 100%;
  padding-left: 30px;
`;

const Header = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  padding-right: 0px;
`;

const HeaderTextIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const BackIconStyle = styled(Box)`
  cursor: pointer;
`;

const HeaderIconWrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 28px;
  background-color: #dadce0;
  margin: 0 15px;
`;

const CloseIcon = styled(CloseRoundedIcon)`
  cursor: pointer;
`;

const PaperDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    top: 46px;
    height: calc(100vh - 47px);
  }
`;

const StyledDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    top: 46px;
    height: calc(100vh - 47px);
    width: 500px;
  }
`;

export default function({
  headingText,
  openDrawer,
  showDivider,
  headerActionTemplate,
  children,
  closeClickHandler,
  showBackIcon,
  anchor,
}: IDrawerWidgetProps) {
  return (
    <PaperDrawer
      anchor={anchor ? anchor : 'right'}
      open={openDrawer}
      data-testid="drawer-widget-parent"
    >
      <DrawerContainer role="presentation" data-testid="parsing-drawer-container">
        <Header>
          <HeaderTextIconWrapper>
            {showBackIcon && <BackIconStyle onClick={closeClickHandler}>{BackIcon}</BackIconStyle>}
            &nbsp;
            <DrawerWidgetHeading headingText={headingText} />
          </HeaderTextIconWrapper>
          <HeaderIconWrapper>
            {headerActionTemplate && <div>{headerActionTemplate}</div>}
            {showDivider && <Divider />}
            <CloseIcon
              color="action"
              fontSize="large"
              onClick={closeClickHandler}
              data-testid="drawer-widget-close-round-icon"
            />
          </HeaderIconWrapper>
        </Header>
        <Fragment>{children}</Fragment>
      </DrawerContainer>
    </PaperDrawer>
  );
}
