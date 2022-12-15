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

import { Container } from '@material-ui/core';
import DataPrepStore from 'components/DataPrep/store';
import RecipeHeaderActionTemplate from 'components/RecipeSteps/RecipeHeaderActionTemplate';
import RecipeStepsEmptyScreen from 'components/RecipeSteps/RecipeStepsEmptyScreen';
import RecipeStepsTableComponent from 'components/RecipeSteps/RecipeStepsTableComponent';
import RecipeStepWidget from 'components/RecipeSteps/RecipeStepWidget';
import { IRecipeStepsProps } from 'components/RecipeSteps/types';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const RecipeStepsBody = styled(Container)`
  height: calc(100% - 100px);
  padding: 0px;
`;

export default function({ setShowRecipePanel, onDeleteRecipeSteps }: IRecipeStepsProps) {
  const [recipeSteps, setRecipeSteps] = useState<string[]>([]);

  const { dataprep } = DataPrepStore.getState();

  useEffect(() => {
    setRecipeSteps(dataprep.directives);
  }, [dataprep]);

  const onCloseClick = () => {
    setShowRecipePanel(false);
  };

  const getRecipeStepsTable = () => {
    return (
      <RecipeStepsTableComponent
        recipeSteps={recipeSteps}
        onDeleteRecipeSteps={onDeleteRecipeSteps}
      />
    );
  };

  const getNoDataScreen = () => {
    return <RecipeStepsEmptyScreen />;
  };

  return (
    <>
      <RecipeStepWidget
        headingText={T.translate(
          'features.WranglerNewUI.WranglerNewRecipeSteps.labels.recipe'
        ).toString()}
        onClose={onCloseClick}
        showDivider={true}
        headerActionTemplate={<RecipeHeaderActionTemplate />}
      >
        <RecipeStepsBody>
          {Array.isArray(recipeSteps) && recipeSteps.length
            ? getRecipeStepsTable()
            : getNoDataScreen()}
        </RecipeStepsBody>
      </RecipeStepWidget>
    </>
  );
}
