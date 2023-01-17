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

import { Box, Container, Drawer, DrawerProps, IconButton, Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface IDrawerWidgetProps extends DrawerProps {
  headingText?: ReactNode | string;
  showDivider?: boolean;
  headerActionTemplate?: ReactNode | JSX.Element;
  closeClickHandler?: () => void;
  showBackIcon?: boolean;
  onBackIconClick?: () => void;
  dataTestId: string;
  showHeaderSeparator?: boolean;
}

const BackIcon = styled(ChevronLeftRoundedIcon)`
  font-size: 40px;
  color: ${grey[600]};
`;

const CustomizedIconButton = styled(IconButton)`
  padding: 0px;
  margin-left: -1px;
`;

const CloseIcon = styled(CloseRoundedIcon)`
  font-size: 30px;
  cursor: pointer;
  margin: 5px;
`;

const CustomizedDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    top: 46px;
    height: calc(100vh - 47px);
    width: 500px;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 28px;
  background-color: #dadce0;
  margin: 0 15px;
`;

const DrawerContainer = styled(Container)`
  height: calc(100vh - 110px);
  padding: 0px 20px;
`;

const DrawerHeader = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
  padding-right: 12px;
  padding-top: 10px;
`;

const HeaderActions = styled(Box)`
  display: flex;
  align-items: center;
`;

const Label = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0.15px;
  color: #000000; /* Mui Colors not available */
`;

const LabelContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export default function DrawerWidget({
  headingText,
  open,
  showDivider,
  headerActionTemplate,
  children,
  closeClickHandler,
  showBackIcon,
  onBackIconClick,
  anchor = 'right',
  dataTestId,
  showHeaderSeparator = true,
}: IDrawerWidgetProps) {
  return (
    <CustomizedDrawer anchor={anchor} open={open} data-testid={dataTestId}>
      <DrawerHeader>
        <HeaderActions>
          {showBackIcon && (
            <CustomizedIconButton
              aria-label="back-icon"
              data-testid="back-icon"
              onClick={onBackIconClick}
            >
              <BackIcon />
            </CustomizedIconButton>
          )}
          <LabelContainer>
            <Label data-testid="widget-heading-text" component="span">
              {headingText}
            </Label>
            {showHeaderSeparator && <img src="/cdap_assets/img/underline" />}
          </LabelContainer>
        </HeaderActions>
        <HeaderActions>
          {headerActionTemplate}
          {showDivider && <Divider data-testid="divider" />}
          <CustomizedIconButton
            aria-label="close-icon"
            data-testid="close-icon"
            onClick={closeClickHandler}
          >
            <CloseIcon color="action" />
          </CustomizedIconButton>
        </HeaderActions>
      </DrawerHeader>
      <DrawerContainer role="presentation">{children}</DrawerContainer>
    </CustomizedDrawer>
  );
}
