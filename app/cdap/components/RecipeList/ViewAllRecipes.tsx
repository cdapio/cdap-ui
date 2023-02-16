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

import React, { useState } from 'react';
import T from 'i18n-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { getTestIdString } from 'components/RecipeList/RecipeTableRow';
import RecipeList from 'components/RecipeList';
import { SortBy, SortOrder } from 'components/RecipeList/types';
import RecipeDetails from 'components/RecipeManagement/RecipeDetails';
import { IRecipe, ActionType } from 'components/RecipeList/types';
import DrawerWidget from 'components/common/DrawerWidget';
import ActionsPopover, { IAction } from 'components/shared/ActionsPopover';
import { PREFIX } from 'components/RecipeList';

const ActionsWrapper = styled(Box)`
  display: flex;
  align-items: center;
`;

const actions: IAction[] = [
  {
    label: T.translate(`${PREFIX}.edit`),
  },
  {
    label: T.translate(`${PREFIX}.download`),
  },
  {
    label: T.translate(`${PREFIX}.delete`),
  },
];

const redirectToObj = `/ns/${getCurrentNamespace()}/wrangle`;

export default function ViewAllRecipies() {
  const [actionType, setActionType] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [recipe, setRecipe] = useState<IRecipe>();

  const isViewRecipeAction = actionType === ActionType.VIEW_RECIPE;

  const toggleOpen = () => setIsPanelOpen(!isPanelOpen);

  const viewRecipeHandler = (selectedObject: any) => {
    toggleOpen();
    setRecipe(selectedObject);
    setActionType(ActionType.VIEW_RECIPE);
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const handleEditRecipe = (selectedObject: any) => {
    // To do : Integrate Edit recipe details panel
  };

  const getDrawerWidgetChildComponent = () => {
    if (isViewRecipeAction) {
      return <RecipeDetails selectedRecipe={recipe} />;
    }

    // TODO: Here we will render Edit Recipe Component once we integrate edit recipe
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
        headerActionTemplate={
          isViewRecipeAction && (
            <ActionsWrapper>
              <ActionsPopover
                actions={actions}
                showPopover={showPopover}
                togglePopover={togglePopover}
              />
            </ActionsWrapper>
          )
        }
        dataTestId={`${getTestIdString(actionType)}-drawer-widget`}
      >
        {getDrawerWidgetChildComponent()}
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
        />
      </Box>
    </>
  );
}
