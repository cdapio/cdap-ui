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

import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import T from 'i18n-react';
import { debounce } from 'lodash';

import MyDataPrepApi from 'api/dataprep';
import { ActionType } from 'components/RecipeList/types';
import RecipeForm from 'components/RecipeManagement/RecipeForm';
import {
  ICreateRecipeProps,
  IRecipeFormData,
  IRecipeNameErrorData,
} from 'components/RecipeManagement/types';
import { getCurrentNamespace } from 'services/NamespaceStore';
import useFetch from 'services/react/customHooks/useFetch';

const PREFIX = 'features.WranglerNewUI.RecipeForm.labels';

/*
 * This regular expression which validates the recipe name
 * should only allow alpha numeric and should not allow special characters
 * for e.g. recipe1 - will be allowed , recipe@ - will not be allowed
 */

const recipeNameRegEx = /^[a-z\d\s]+$/i;
export const noErrorState: IRecipeNameErrorData = {
  isRecipeNameError: false,
  recipeNameErrorMessage: '',
};

export default function CreateRecipe({ setShowRecipeForm, setSnackbar }: ICreateRecipeProps) {
  const [recipeFormData, setRecipeFormData] = useState({
    recipeName: '',
    description: '',
  });
  const [recipeNameErrorData, setRecipeNameErrorDataState] = useState(noErrorState);

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [apiParams, setApiParams] = useState({
    getRecipeByNameParams: {
      context: '',
      recipeName: '',
    },
    createRecipeParams: {
      context: '',
    },
  });

  /*
   * TODO: This static data has to be removed when we have actual API data,
   * then directly we will get that data from store as directives
   */
  const recipeSteps = ['uppercase: body1', 'titlecase: body2'];

  const { response: recipeByNameResponse, error: recipeByNameError } = useFetch(
    MyDataPrepApi.getRecipeByName,
    apiParams.getRecipeByNameParams
  );

  const { response: createRecipeResponse, error: createRecipeError } = useFetch(
    MyDataPrepApi.createRecipe,
    apiParams.createRecipeParams,
    {
      recipeName: recipeFormData.recipeName,
      description: recipeFormData.description,
      directives: recipeSteps,
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

  // This useEffect is for handling createRecipe API call response
  useEffect(() => {
    if (createRecipeResponse) {
      setShowRecipeForm(false);
      setSnackbar({
        open: true,
        isSuccess: true,
        message: `${recipeSteps.length} ${T.translate(`${PREFIX}.recipeSaveSuccessMessage`)}`,
      });
    }
  }, [createRecipeResponse]);

  // This useEffect is for handling createRecipe API call error
  useEffect(() => {
    if (createRecipeError) {
      setShowRecipeForm(false);
      setSnackbar({
        open: true,
        isSuccess: false,
        message: (createRecipeError.response as Record<string, string>).message,
      });
    }
  }, [createRecipeError]);

  const updateRecipeNameErrorData = (
    recipeNameError: IRecipeNameErrorData,
    formData: IRecipeFormData = recipeFormData
  ) => {
    setRecipeNameErrorDataState(recipeNameError);
    handleSaveButtonMode(formData, recipeNameError);
  };

  const handleSaveButtonMode = (
    formData: IRecipeFormData = recipeFormData,
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

  const handleRecipeFormData = (formData: IRecipeFormData) => {
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

  const onRecipeDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    handleRecipeFormData({
      ...recipeFormData,
      description: event.target.value,
    });
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiParams({
      ...apiParams,
      createRecipeParams: {
        context: getCurrentNamespace(),
      },
    });
  };

  const onCancel = () => {
    setShowRecipeForm(false);
  };

  /*
   * In this function we are validating recipe name input field by storing
   * debounce function in a ref so that it can persist across renders
   * and not get recreated on each render
   * (whether recipe name already exists or not and recipe name without alphanumeric characters)
   * and based on the result we are showing the helper text
   */
  const validateIfRecipeNameExists = useRef(
    debounce((formData: IRecipeFormData) => {
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
          updateRecipeNameErrorData(noErrorState);
        }
      }
    }, 500)
  );

  return (
    <RecipeForm
      recipeFormData={recipeFormData}
      isRecipeNameError={recipeNameErrorData.isRecipeNameError}
      recipeNameErrorMessage={recipeNameErrorData.recipeNameErrorMessage}
      onRecipeNameChange={onRecipeNameChange}
      onFormSubmit={onFormSubmit}
      onCancel={onCancel}
      isSaveDisabled={isSaveDisabled}
      recipeFormAction={ActionType.CREATE_RECIPE}
      onRecipeDescriptionChange={onRecipeDescriptionChange}
    />
  );
}
