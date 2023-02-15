/*
 *  Copyright © 2023 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import React from 'react';
import T from 'i18n-react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import RecipeDetails, { PREFIX } from 'components/RecipeManagement/RecipeDetails';

const recipeDetailsMockData = {
  recipeId: {
    namespace: {
      name: 'default',
      generation: '0',
    },
    recipeId: 'c5e51202-808e-4ead-b61f-83f280f3fdac',
  },
  recipeName: 'RecipeABC101',
  description: 'Recipe for cleansing empolyee information',
  directives: ['set-column :body_2_copy body_2 + \u0027text\u0027', 'trim :body_2'],
  createdTimeMillis: 1670584496578,
  updatedTimeMillis: 1670584496578,
  recipeStepsCount: 2,
};

describe('Test RecipeDetails Component', () => {
  beforeEach(() => {
    render(<RecipeDetails selectedRecipe={recipeDetailsMockData} />);
  });

  it('should check if the recipe name is as expected', () => {
    const recipeNameElement = screen.getByTestId(/selected-recipe-name/i);
    expect(recipeNameElement).toBeInTheDocument();
    expect(recipeNameElement).toHaveTextContent('RecipeABC101');
  });

  it('should check if the recipe count and date is as expected', () => {
    const recipeCountDateElement = screen.getByTestId(/selected-recipe-count-and-date/i);
    expect(recipeCountDateElement).toBeInTheDocument();
    expect(recipeCountDateElement).toHaveTextContent(
      `2 ${T.translate(`${PREFIX}.common.tableHeaders.recipeStep`)}`
    );
  });

  it('should check if the recipe description is as expected', () => {
    const recipeDescriptionElement = screen.getByTestId(/selected-recipe-description/i);
    expect(recipeDescriptionElement).toBeInTheDocument();
    expect(recipeDescriptionElement).toHaveTextContent('Recipe for cleansing empolyee information');
  });

  it('should check if the recipe steps text is as expected', () => {
    const recipeStepTextElement = screen.getByTestId(/selected-recipe-step-text-0/i);
    expect(recipeStepTextElement).toBeInTheDocument();
    expect(recipeStepTextElement).toHaveTextContent(
      `set-column :body_2_copy body_2 + \u0027text\u0027`
    );
  });
});
