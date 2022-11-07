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

import { Box } from '@material-ui/core';
import { PREFIX } from 'components/FooterPanel';
import T from 'i18n-react';
import React from 'react';
import styled from 'styled-components';
import OutlinedLabel from 'components/FooterPanel/Components/common/RenderLabel/OutlinedLabel';
import SimpleLabel from 'components/FooterPanel/Components/common/RenderLabel/SimpleLabel';

const ReciepeStepsBox = styled(Box)`
  text-align: center;
  padding: 9.5px 12px;
  gap: 8px;
  width: 13.5%;
  height: 40px;
  background: linear-gradient(180deg, #4681f400 0.85%, #4681f433 118.78%);
  border-left: 1px solid rgba(57, 148, 255, 0.4);
  cursor: pointer;
`;

export interface IRecipeStepsTabProps {
  recipeStepsCount: number;
}

export default function({ recipeStepsCount }: IRecipeStepsTabProps) {
  return (
    <ReciepeStepsBox data-testid="footer-panel-recipe-steps-tab">
      <>
        <SimpleLabel>
          <>{`${T.translate(`${PREFIX}.recipeSteps`)}`}</>
        </SimpleLabel>
        <OutlinedLabel>
          <>{recipeStepsCount}</>
        </OutlinedLabel>
      </>
    </ReciepeStepsBox>
  );
}
