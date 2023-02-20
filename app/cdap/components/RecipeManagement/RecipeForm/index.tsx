/*
 * Copyright © 2023 Cask Data, Inc.
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

import React from 'react';
import { FormControl } from '@material-ui/core';
import T from 'i18n-react';
import {
  CancelButton,
  CreateRecipeFormButtonWrapper,
  EditRecipeFormButtonWrapper,
  ErrorLabel,
  ErrorTextField,
  FormFieldWrapper,
  Label,
  NormalTextField,
  SaveButton,
  StyledTextAreaAutosize,
} from 'components/RecipeManagement/RecipeForm/styles';
import { IRecipeFormProps } from 'components/RecipeManagement/types';
import { ActionType } from 'components/RecipeList/types';

const PREFIX = 'features.WranglerNewUI.RecipeForm.labels';

export default function RecipeForm({
  recipeFormData,
  isRecipeNameError,
  recipeNameErrorMessage,
  onRecipeNameChange,
  onFormSubmit,
  onCancel,
  isSaveDisabled,
  recipeFormAction,
  onRecipeDescriptionChange,
  regEx,
}: IRecipeFormProps) {
  const StyledLabel = isRecipeNameError ? ErrorLabel : Label;
  const StyledTextField = isRecipeNameError ? ErrorTextField : NormalTextField;
  const isCreateRecipeAction = recipeFormAction === ActionType.CREATE_RECIPE;
  const StyledFormButtonWrapper = isCreateRecipeAction
    ? CreateRecipeFormButtonWrapper
    : EditRecipeFormButtonWrapper;

  return (
    <>
      <form onSubmit={onFormSubmit} data-testid="recipe-form-parent">
        <FormFieldWrapper>
          <StyledLabel
            data-testid="recipe-form-name-label"
            component="label"
            htmlFor="recipe-form-name-field"
          >
            {isCreateRecipeAction && T.translate(`${PREFIX}.createRecipeNameLabel`)}
            {!isCreateRecipeAction && T.translate(`${PREFIX}.editRecipeNameLabel`)}
          </StyledLabel>
          <StyledTextField
            id="recipe-form-name-field"
            autoFocus={true}
            aria-label="Recipe Name"
            data-testid="recipe-form-name-field"
            defaultValue={recipeFormData.recipeName}
            error={isRecipeNameError}
            fullWidth
            helperText={isRecipeNameError ? recipeNameErrorMessage : ''}
            onChange={onRecipeNameChange}
            placeholder={T.translate(`${PREFIX}.namePlaceholder`)}
            required
            value={recipeFormData.recipeName}
            variant="outlined"
            pattern={regEx.recipeNameRegEx}
          />
        </FormFieldWrapper>
        <FormFieldWrapper>
          <FormControl variant="outlined">
            <Label
              data-testid="recipe-form-description-label"
              component="label"
              htmlFor="recipe-form-description-field"
            >
              {T.translate(`${PREFIX}.description`)}
            </Label>
            <StyledTextAreaAutosize
              id="recipe-form-description-field"
              aria-label="Recipe Description"
              data-testid="recipe-form-description-field"
              defaultValue={recipeFormData.description}
              minRows={4}
              onChange={onRecipeDescriptionChange}
              placeholder={T.translate(`${PREFIX}.descriptionPlaceholder`)}
              required
              value={recipeFormData.description}
              pattern={regEx.descriptionRegEx}
            />
          </FormControl>
        </FormFieldWrapper>
        <StyledFormButtonWrapper>
          <SaveButton
            variant="contained"
            type="submit"
            data-testid="recipe-form-save-button"
            disabled={isSaveDisabled}
          >
            {T.translate(`${PREFIX}.save`)}
          </SaveButton>
          <CancelButton
            variant="outlined"
            onClick={onCancel}
            data-testid="recipe-form-cancel-button"
          >
            {T.translate(`${PREFIX}.cancel`)}
          </CancelButton>
        </StyledFormButtonWrapper>
      </form>
    </>
  );
}
