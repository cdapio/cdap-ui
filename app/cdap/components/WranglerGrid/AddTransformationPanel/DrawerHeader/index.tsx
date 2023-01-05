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

import { Box, Container } from '@material-ui/core';
import React from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import styled from 'styled-components';
import { FlexAlignCenter, PointerBox } from 'components/common/BoxContainer';
import { HeadFont } from 'components/common/TypographyText';
import T from 'i18n-react';
import { ADD_TRANSFORMATION_PREFIX } from 'components/WranglerGrid/SelectColumnPanel/constants';
import { StyledIconButton } from 'components/WranglerGrid/SelectColumnPanel/DrawerHeader';

interface IDrawerHeaderProps {
  closeClickHandler: () => void;
}

const FlexWrapper = styled(Box)`
  display: flex;
`;

const DrawerContainer = styled(Container)`
  padding-left: 0;
  padding-right: 0;
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

export default function({ closeClickHandler }: IDrawerHeaderProps) {
  return (
    <DrawerContainer role="presentation" data-testid="add-transformation-drawer">
      <DrawerContainerInnerFlex>
        <FlexAlignCenter>
          <DrawerHeadWrapper>
            <HeadFont component="p" data-testid="drawer-heading">
              {T.translate(`${ADD_TRANSFORMATION_PREFIX}.addTransformation`)}
            </HeadFont>
          </DrawerHeadWrapper>
        </FlexAlignCenter>
        <FlexWrapper>
          <StyledIconButton
            onClick={closeClickHandler}
            data-testid="add-transformation-close-button"
          >
            <CloseRoundedIcon
              color="action"
              fontSize="large"
              data-testid="add-transformation-drawer-close-icon"
            />
          </StyledIconButton>
        </FlexWrapper>
      </DrawerContainerInnerFlex>
    </DrawerContainer>
  );
}
