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

import RenderLabel from 'components/FooterPanel/Components/common/RenderLabel';
import TabWrapper from 'components/FooterPanel/Components/common/TabWrapper';
import { IRecipeStepsTabProps } from 'components/FooterPanel/Components/RecipeStepsTab/types';
import { PREFIX } from 'components/FooterPanel/constants';
import T from 'i18n-react';
import React from 'react';

export default function({ recipeStepsCount }: IRecipeStepsTabProps) {
  return (
    <TabWrapper size="medium" width={13.5} dataTestID="footer-panel-recipe-steps-tab">
      <>
        <RenderLabel type="simple">
          <>{`${T.translate(`${PREFIX}.recipeSteps`)}`}</>
        </RenderLabel>
        <RenderLabel type="outlined">
          <>{recipeStepsCount}</>
        </RenderLabel>
      </>
    </TabWrapper>
  );
}
