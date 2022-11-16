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
import DrawerWidget from 'components/DrawerWidget';
import React, { useEffect, useState } from 'react';
import RecipeHeaderActionTemplate from './RecipeHeaderActionTemplate';
import RecipeStepsEmptyScreen from './RecipeStepsEmptyScreen';
import RecipeStepsTableComponent from './RecipeStepsTableComponent';
import { useStyles } from './styles';
import T from 'i18n-react';
import { IRecipesSteps, IRecipeStepsProps } from './types';
import { IRecipeStepTebleProps } from './RecipeStepsTableComponent/types';

const recipes = [
  {
    actionType: 'Parse Column',
    description: "'Body' with delimiter 'comma' and set 'first row as header'",
  },
  {
    actionType: 'Delete Column',
    description: "'Body'",
  },
];

const recipe_steps = ['uppercase: body1', 'titlecase: body2'];

export default function({ setShowRecipePanel, showRecipePanel }: IRecipeStepsProps) {
  const [recipeSteps, setRecipeSteps] = useState<string[]>(recipe_steps);

  const classes = useStyles();

  const closeClickHandler = () => {
    setShowRecipePanel(false);
  };

  return (
    <DrawerWidget
      headingText={T.translate('features.WranglerNewRecipeSteps.labels.recipe')}
      openDrawer={showRecipePanel}
      showDivider={true}
      headerActionTemplate={<RecipeHeaderActionTemplate />}
      closeClickHandler={closeClickHandler}
    >
      <Container className={classes.RecipeStepsBodyStyles}>
        {Array.isArray(recipeSteps) && recipeSteps.length ? (
          <RecipeStepsTableComponent recipeSteps={recipeSteps} />
        ) : (
          <RecipeStepsEmptyScreen />
        )}
      </Container>
    </DrawerWidget>
  );
}
