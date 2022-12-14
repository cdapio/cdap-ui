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

import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { UnderLine } from 'components/RecipeSteps/IconStore/Underline';
import { IDrawerWidgetHeadingProps } from 'components/RecipeSteps/RecipeWidgetHeading/types';
import styled from 'styled-components';

const DrawerWidgetTitleIconWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DrawerWidgetTitleLabel = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0.15;
  color: grey[900];
`;

export default function({ headingText }: IDrawerWidgetHeadingProps) {
  return (
    <DrawerWidgetTitleIconWrapper>
      <DrawerWidgetTitleLabel data-testid="drawer-widget-heading">
        {headingText}
      </DrawerWidgetTitleLabel>
      {UnderLine}
    </DrawerWidgetTitleIconWrapper>
  );
}

