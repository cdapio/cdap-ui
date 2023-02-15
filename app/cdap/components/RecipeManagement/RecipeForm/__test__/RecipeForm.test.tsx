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
import { fireEvent, render, screen } from '@testing-library/react';
import T from 'i18n-react';
import RecipeForm from 'components/RecipeManagement/RecipeForm';

describe('Test Recipe Form Component', () => {
  const mockOnFormSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    render(
      <RecipeForm
        recipeFormData={{
          recipeName: 'test',
          description: 'abc desc',
          directives: ['uppercase: body1', 'titlecase: body2'],
        }}
        isRecipeNameError={false}
        recipeNameErrorMessage={'error message'}
        onRecipeNameChange={jest.fn()}
        onFormSubmit={mockOnFormSubmit}
        onCancel={mockOnCancel}
        isSaveDisabled={false}
        recipeFormAction={'create recipe'}
        onRecipeDescriptionChange={jest.fn()}
      />
    );
  });

  it('should render Recipe Name Label', () => {
    const RecipeNameLabelElement = screen.getByTestId(/recipe-form-name-label/i);
    expect(RecipeNameLabelElement).toBeInTheDocument();
    expect(RecipeNameLabelElement).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.RecipeForm.labels.createRecipeNameLabel')}`
    );
  });

  it('should render Recipe Description Label', () => {
    const RecipeDescriptionLabelElement = screen.getByTestId(/recipe-form-description-label/i);
    expect(RecipeDescriptionLabelElement).toBeInTheDocument();
    expect(RecipeDescriptionLabelElement).toHaveTextContent(
      `${T.translate('features.WranglerNewUI.RecipeForm.labels.description')}`
    );
  });

  it('should render Recipe Name Field and trigger the change event as expected', () => {
    const RecipeNameElement = screen.getByTestId(/recipe-form-name-field/i);
    fireEvent.change(RecipeNameElement.firstChild.firstChild, { target: { value: 'test' } });
    expect(RecipeNameElement.firstChild.firstChild).toHaveValue('test');
  });

  it('should render Recipe Description Field', () => {
    const RecipeDescriptionElement = screen.getByTestId(/recipe-form-description-field/i);
    fireEvent.change(RecipeDescriptionElement, { target: { value: 'abc desc' } });
    expect(RecipeDescriptionElement).toHaveValue('abc desc');
  });

  it('should trigger onCancel event in recipe', () => {
    const cancelButtonElement = screen.getByTestId(/recipe-form-cancel-button/i);
    fireEvent.click(cancelButtonElement);
    expect(mockOnCancel).toBeCalled();
  });

  it('should trigger onSave event in recipe', () => {
    const saveButtonElement = screen.getByTestId(/recipe-form-save-button/i);
    fireEvent.click(saveButtonElement);
    expect(mockOnFormSubmit).toBeCalled();
  });
});
