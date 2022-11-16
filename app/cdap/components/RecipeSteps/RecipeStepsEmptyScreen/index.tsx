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

import { Container, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import { useStyles } from 'components/RecipeSteps/styles';
import T from 'i18n-react';
import { InfoGraphicData } from 'components/RecipeSteps/iconStore';
import styled from 'styled-components';

const EmptyScreenContainer = styled(Container)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-iems: center;
  justify-content: center;
`;

const EmptyScreenText = styled(Typography)`
  font-style: normal;
  font-weight: 400px;
  font-size: 20px;
  line-height: 150%;
  letter-spacing: 0.15;
  color: grey[900];
`;

const EmptyScreenInfoText = styled(Typography)`
  font-syle: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.15;
  color: grey[700];
`;

export default function() {
  const classes = useStyles();

  return (
    <EmptyScreenContainer data-testid="recipe-steps-empty-screen-parent">
      {InfoGraphicData}
      <EmptyScreenText data-testid="start-wrangle-title">
        {T.translate('features.WranglerNewRecipeSteps.startWrangleTitle')}
      </EmptyScreenText>
      <EmptyScreenInfoText data-testid="start-wrangle-sub-title">
        {T.translate('features.WranglerNewRecipeSteps.startWrangleSubTitle')}
      </EmptyScreenInfoText>
    </EmptyScreenContainer>
  );
}
