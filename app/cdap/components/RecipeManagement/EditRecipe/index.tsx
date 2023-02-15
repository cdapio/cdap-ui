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

import React, { useState, ChangeEvent, useRef, FormEvent, useEffect } from 'react';
import { debounce } from 'lodash';
import styled from 'styled-components';
import T from 'i18n-react';

import RecipeForm from 'components/RecipeManagement/RecipeForm';
import {
  IEditRecipeProps,
  IRecipeData,
  IRecipeNameErrorData,
} from 'components/RecipeManagement/types';
import { ActionType } from 'components/RecipeList/types';
import MyDataPrepApi from 'api/dataprep';
import { getCurrentNamespace } from 'services/NamespaceStore';
import useFetch from 'services/react/customHooks/useFetch';

const StyledEditFormWrapper = styled.div`
  margin-top: 30px;
`;

const PREFIX = 'features.WranglerNewUI.RecipeForm.labels';

/*
 * This regular expression which validates the recipe name
 * should only allow alpha numeric and should not allow special characters
 * for e.g. recipe1 - will be allowed , recipe@ - will not be allowed
 */
const recipeNameRegEx = /^[a-z\d\s]+$/i;

const noErrorState: IRecipeNameErrorData = {
  isRecipeNameError: false,
  recipeNameErrorMessage: '',
};

export default function({
  selectedRecipe,
  onCancelClick,
  setSnackbar,
  setRecipeFormOpen,
  setIsRecipeListUpdated,
}: IEditRecipeProps) {
  const [apiParams, setApiParams] = useState({
    getRecipeByNameParams: {
      context: '',
      recipeName: '',
    },
    updateRecipeParams: {
      context: '',
      recipe_id: '',
    },
  });

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [recipeFormData, setRecipeFormData] = useState({
    recipeName: '',
    description: '',
    directives: [],
  });
  const [recipeNameErrorData, setRecipeNameErrorDataState] = useState(noErrorState);

  const { response: recipeByNameResponse, error: recipeByNameError } = useFetch(
    MyDataPrepApi.getRecipeByName,
    apiParams.getRecipeByNameParams
  );

  const { response: updateRecipeResponse, error: updateRecipeError } = useFetch(
    MyDataPrepApi.updateRecipe,
    apiParams.updateRecipeParams,
    {
      recipeName: recipeFormData.recipeName,
      description: recipeFormData.description,
      directives: recipeFormData.directives,
    }
  );

  // This useEffect is for handling getRecipeByName API call response
  useEffect(() => {
    if (recipeByNameResponse) {
      updateRecipeNameErrorData(
        {
          isRecipeNameError: true,
          recipeNameErrorMessage: T.translate(`${PREFIX}.sameNameErrorMessage`).toString(),
        },
        recipeFormData
      );
    }
  }, [recipeByNameResponse]);

  // This useEffect is for handling getRecipeByName API call error
  useEffect(() => {
    if (recipeByNameError) {
      if (recipeByNameError.statusCode === 404) {
        updateRecipeNameErrorData(noErrorState, recipeFormData);
      } else {
        setSnackbar({
          open: true,
          isSuccess: false,
          message: (recipeByNameError.response as Record<string, string>).message,
        });
      }
    }
  }, [recipeByNameError]);

  // This useEffect is for handling updateRecipe API call response
  useEffect(() => {
    if (updateRecipeResponse) {
      updateRecipeNameErrorData(noErrorState);
      setRecipeFormOpen(false);
      setSnackbar({
        open: true,
        isSuccess: true,
        message: `${recipeFormData.directives.length} ${T.translate(
          `${PREFIX}.recipeUpdateSuccessMessage`
        )}`,
      });
      setIsRecipeListUpdated(true);
    }
  }, [updateRecipeResponse]);

  // This useEffect is for handling updateRecipe API call error
  useEffect(() => {
    if (updateRecipeError) {
      setRecipeFormOpen(false);
      setSnackbar({
        open: true,
        isSuccess: false,
        message: (updateRecipeError as Record<string, string>).message,
      });
    }
  }, [updateRecipeError]);

  useEffect(() => {
    if (selectedRecipe) {
      recipeFormData.recipeName = selectedRecipe.recipeName;
      recipeFormData.description = selectedRecipe.description;
      recipeFormData.directives = selectedRecipe.directives;
      setRecipeFormData((prevState) => ({ ...prevState, recipeFormData }));
    }
  }, [selectedRecipe]);

  const updateRecipeNameErrorData = (
    recipeNameError: IRecipeNameErrorData,
    formData: IRecipeData = recipeFormData
  ) => {
    setRecipeNameErrorDataState(recipeNameError);
    handleSaveButtonMode(formData, recipeNameError);
  };

  const handleSaveButtonMode = (
    formData: IRecipeData,
    nameErrorData: IRecipeNameErrorData = recipeNameErrorData
  ) => {
    const shouldDisableSaveButton =
      formData.recipeName === '' ||
      formData.description === '' ||
      formData.recipeName?.trim().length === 0 ||
      formData.description?.trim().length === 0 ||
      nameErrorData.isRecipeNameError;
    setIsSaveDisabled(shouldDisableSaveButton);
  };

  const handleRecipeFormData = (formData: IRecipeData) => {
    setRecipeFormData(formData);
    handleSaveButtonMode(formData);
  };

  const onRecipeNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleRecipeFormData({
      ...recipeFormData,
      recipeName: event.target.value,
    });
    validateIfRecipeNameExists.current({
      recipeName: event.target.value,
      description: recipeFormData.description,
    });
  };

  /*
   * In this function we are validating recipe name input field by storing
   * debounce function in a ref so that it can persist across renders
   * and not get recreated on each render
   * (whether recipe name already exists or not and recipe name without alphanumeric characters)
   * and based on the result we are showing the helper text
   */

  const validateIfRecipeNameExists = useRef(
    debounce((formData: IRecipeData) => {
      if (formData.recipeName && !recipeNameRegEx.test(formData.recipeName)) {
        updateRecipeNameErrorData({
          isRecipeNameError: true,
          recipeNameErrorMessage: T.translate(`${PREFIX}.validationErrorMessage`).toString(),
        });
      } else {
        if (formData.recipeName) {
          setApiParams({
            ...apiParams,
            getRecipeByNameParams: {
              context: getCurrentNamespace(),
              recipeName: formData.recipeName,
            },
          });
        } else {
          updateRecipeNameErrorData(noErrorState, formData);
        }
      }
    }, 500)
  );

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiParams({
      ...apiParams,
      updateRecipeParams: {
        context: getCurrentNamespace(),
        recipe_id: selectedRecipe.recipeId.recipeId,
      },
    });
  };

  const onRecipeDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    handleRecipeFormData({
      ...recipeFormData,
      description: event.target.value,
    });
  };

  return (
    <StyledEditFormWrapper>
      {recipeFormData && (
        <RecipeForm
          isRecipeNameError={recipeNameErrorData.isRecipeNameError}
          isSaveDisabled={isSaveDisabled}
          onCancel={onCancelClick}
          onFormSubmit={onFormSubmit}
          onRecipeDescriptionChange={onRecipeDescriptionChange}
          onRecipeNameChange={onRecipeNameChange}
          recipeFormData={recipeFormData}
          recipeFormAction={ActionType.EDIT_RECIPE}
          recipeNameErrorMessage={recipeNameErrorData.recipeNameErrorMessage}
        />
      )}
    </StyledEditFormWrapper>
  );
}
