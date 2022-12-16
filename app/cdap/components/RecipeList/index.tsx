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

import React, { useEffect, useReducer } from 'react';
import { RecipesTable } from './RecipesTable';
import PaginationStepper from 'components/shared/PaginationStepper';
import { RecipeTableDiv, PaginationContainer } from './styles';
import { IRecipe, SortBy, SortOrder } from './types';
import {
  reducer,
  nextPage,
  prevPage,
  reset,
  getSavedRecipes,
  defaultInitialState,
} from './reducer';

const PREFIX = 'features.WranglerNewUI.Recipe';

interface IRecipeListProps {
  isOpen: boolean;
  isShowAllColumns?: boolean;
  isShowActions?: boolean;
  showPagination?: boolean;
  enableSorting?: boolean;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  pageSize?: number;
  viewHandler?: (selectedRecipe: IRecipe) => void;
  editHandler?: (selectedRecipe: IRecipe) => void;
  selectHandler?: (selectedRecipe: IRecipe) => void;
}

const RecipeList = ({
  isOpen,
  isShowAllColumns,
  isShowActions,
  showPagination,
  enableSorting,
  sortBy,
  sortOrder,
  pageSize,
  viewHandler,
  editHandler,
  selectHandler,
}: IRecipeListProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultInitialState,
    pageLimit: pageSize,
    sortColumn: sortBy,
    sortedOrder: sortOrder,
  });

  const { recipes } = state;

  const Pagination = ({}) => {
    return (
      <PaginationContainer className="float-left">
        <div>
          <PaginationStepper
            onNext={() => nextPage(dispatch, state)}
            onPrev={() => prevPage(dispatch, state)}
            nextDisabled={!state.nextPageToken}
            prevDisabled={!state.previousTokens.length}
          />
        </div>
      </PaginationContainer>
    );
  };

  const viewRecipeHandler = (selectedRecipeObject: IRecipe) => {
    if (viewHandler) {
      viewHandler(selectedRecipeObject);
    }
  };

  const editRecipeHanlder = (selectedRecipeObject: IRecipe) => {
    if (editHandler) {
      editHandler(selectedRecipeObject);
    }
  };

  const selectRecipeHanlder = (selectedRecipeObject: IRecipe) => {
    if (selectHandler) {
      selectHandler(selectedRecipeObject);
    }
  };

  useEffect(() => {
    getSavedRecipes(dispatch, state);
  }, []);

  return (
    <RecipeTableDiv
      showallcolumns={isShowAllColumns ? 1 : 0}
      showactions={isShowActions ? 1 : 0}
      data-testid="recipe-table-container"
    >
      {isOpen && (
        <>
          <RecipesTable
            allRecipies={recipes}
            isShowAllColumns={isShowAllColumns}
            isShowActions={isShowActions}
            enableSorting={enableSorting}
            viewHandler={viewRecipeHandler}
            editHandler={editRecipeHanlder}
            selectHandler={selectRecipeHanlder}
            state={state}
            dispatch={dispatch}
          />
          {showPagination && <Pagination />}
        </>
      )}
    </RecipeTableDiv>
  );
};

const RecipeListOuter = ({
  isOpen = true,
  isShowAllColumns = true,
  viewHandler = null,
  editHandler = null,
  selectHandler = null,
  isShowActions = true,
  showPagination = true,
  sortBy = SortBy.NAME,
  sortOrder = SortOrder.ASCENDING,
  pageSize = 10,
  enableSorting = true,
}) => (
  <RecipeList
    isOpen={isOpen}
    isShowAllColumns={isShowAllColumns}
    viewHandler={viewHandler}
    editHandler={editHandler}
    selectHandler={selectHandler}
    isShowActions={isShowActions}
    showPagination={showPagination}
    sortBy={sortBy}
    sortOrder={sortOrder}
    pageSize={pageSize}
    enableSorting={enableSorting}
  />
);

export default RecipeListOuter;
