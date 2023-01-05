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

import { Box, Container, IconButton } from '@material-ui/core';
import React from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import styled from 'styled-components';
import { FlexAlignCenter } from 'components/common/BoxContainer';
import { HeadFont } from 'components/common/TypographyText';
import T from 'i18n-react';
import { ADD_TRANSFORMATION_PREFIX } from 'components/WranglerGrid/SelectColumnPanel/constants';
import grey from '@material-ui/core/colors/grey';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';

interface IDrawerHeaderProps {
  closeClickHandler: () => void;
  isSingleSelection: boolean;
}

const BackIcon = styled(ChevronLeftRoundedIcon)`
  font-size: 40px;
  color: ${grey[600]};
`;

const DrawerContainerInnerFlex = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
`;

const DrawerHeadWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const FlexWrapper = styled(Box)`
  display: flex;
`;

export const StyledIconButton = styled(IconButton)`
  padding: 0px;
  width: 26px;
  justify-content: end;
  &.MuiIconButton-root:hover {
    background-color: transparent;
  }
  & .MuiTouchRipple-root {
    display: none;
  }
`;

const Wrapper = styled(Container)`
  padding-left: 0;
  padding-right: 0;
`;

export default function DrawerHeader({ closeClickHandler, isSingleSelection }: IDrawerHeaderProps) {
  return (
    <Wrapper data-testid="select-column-drawer">
      <DrawerContainerInnerFlex>
        <FlexAlignCenter>
          <StyledIconButton
            onClick={closeClickHandler}
            aria-label="back-icon"
            data-testid="back-icon-button"
          >
            <BackIcon />
          </StyledIconButton>
          <DrawerHeadWrapper>
            <HeadFont component="p" data-testid="drawer-heading">
              {isSingleSelection && T.translate(`${ADD_TRANSFORMATION_PREFIX}.selectColumnHeading`)}
              {!isSingleSelection &&
                T.translate(`${ADD_TRANSFORMATION_PREFIX}.selectMultiColumnsHeading`)}
            </HeadFont>
          </DrawerHeadWrapper>
        </FlexAlignCenter>
        <FlexWrapper>
          <StyledIconButton
            data-testid="select-column-drawer-close-icon-button"
            onClick={closeClickHandler}
          >
            <CloseRoundedIcon
              color="action"
              fontSize="large"
              data-testid="select-column-drawer-close-icon"
            />
          </StyledIconButton>
        </FlexWrapper>
      </DrawerContainerInnerFlex>
    </Wrapper>
  );
}
