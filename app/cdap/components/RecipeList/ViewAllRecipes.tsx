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

import React, { useState, useEffect } from 'react';
import T from 'i18n-react';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

import { getCurrentNamespace } from 'services/NamespaceStore';
import { SortBy, SortOrder } from 'components/RecipeList/types';
import { IRecipe, ActionType } from 'components/RecipeList/types';
import DrawerWidget from 'components/common/DrawerWidget';
import EditRecipe from 'components/RecipeManagement/EditRecipe';
import RecipeList from 'components/RecipeList';
import Snackbar from 'components/Snackbar';
import useSnackbar from 'components/Snackbar/useSnackbar';

const PREFIX = 'features.WranglerNewUI.Recipe';

const redirectToObj = `/ns/${getCurrentNamespace()}/wrangle`;

export default function ViewAllRecipies() {
  const [actionType, setActionType] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isRecipeListUpdated, setIsRecipeListUpdated] = useState(false);
  const [recipe, setRecipe] = useState<IRecipe>();
  const [snackbarState, setSnackbar] = useSnackbar();
  const isViewRecipeAction = actionType === ActionType.VIEW_RECIPE;

  useEffect(() => {
    if (snackbarState.open) {
      const timer = setTimeout(() => {
        setSnackbar(() => ({
          open: false,
        }));
      }, 5000);
      return () => {
        clearTimeout(timer);
        setIsRecipeListUpdated(false);
      };
    }
  }, [snackbarState.open]);

  const toggleOpen = () => {
    setIsPanelOpen(!isPanelOpen);
    setRecipe(null);
  };

  const viewRecipeHandler = (selectedObject: any) => {
    // To do : Integrate view recipe details panel
  };

  const handleEditRecipe = (selectedObject: any) => {
    toggleOpen();
    setRecipe(selectedObject);
    setActionType(ActionType.EDIT_RECIPE);
  };

  const onCancel = () => {
    toggleOpen();
    setRecipe(null);
  };

  const getChildComponent = () => {
    if (recipe) {
      return (
        <EditRecipe
          onCancelClick={onCancel}
          selectedRecipe={recipe}
          setIsRecipeListUpdated={setIsRecipeListUpdated}
          setRecipeFormOpen={toggleOpen}
          setSnackbar={setSnackbar}
        />
      );
    }
    // TODO: Here we will render Recipe Detail component once we integrate Recipe Detail
    return null;
  };

  return (
    <>
      <DrawerWidget
        anchor="right"
        closeClickHandler={toggleOpen}
        headingText={
          isViewRecipeAction
            ? T.translate(`${PREFIX}.recipeDetails`)
            : T.translate(`${PREFIX}.editRecipe`)
        }
        showBackIcon={false}
        showDivider={isViewRecipeAction}
        open={isPanelOpen}
        headerActionTemplate={isViewRecipeAction && <></>}
        dataTestId={`${actionType
          .toLowerCase()
          .split(' ')
          .join('-')}-drawer-widget`}
      >
        {getChildComponent()}
      </DrawerWidget>
      <Box ml={4} m={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link underline="hover" key="2" color="inherit" to={redirectToObj}>
            {T.translate(`${PREFIX}.home`)}
          </Link>

          <Typography key="3">{T.translate(`${PREFIX}.savedRecipes`)}</Typography>
        </Breadcrumbs>
      </Box>
      <Box ml={4} mb={2}>
        <Typography variant="h5" key="3">
          {T.translate(`${PREFIX}.savedRecipes`)}
        </Typography>
      </Box>

      <Box ml={4} mr={4}>
        <RecipeList
          isOpen={true}
          showAllColumns={true}
          showActions={true}
          viewHandler={viewRecipeHandler}
          editHandler={handleEditRecipe}
          pageSize={12}
          sortBy={SortBy.UPDATED}
          sortOrder={SortOrder.DESCENDING}
          showPagination={true}
          enableSorting={true}
          isRecipeListUpdated={isRecipeListUpdated}
        />
      </Box>
      <Snackbar
        handleClose={() =>
          setSnackbar(() => ({
            open: false,
          }))
        }
        open={snackbarState.open}
        message={snackbarState.message}
        isSuccess={snackbarState.isSuccess}
      />
    </>
  );
}
