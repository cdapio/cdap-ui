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
import { RecipeTableDiv, PaginationContainer, NoDataText } from './styles';
import { IRecipe, SortBy, SortOrder } from './types';
import { reducer, nextPage, prevPage, getSavedRecipes, defaultInitialState } from './reducer';
import T from 'i18n-react';

interface IRecipeListProps {
  isOpen: boolean;
  showAllColumns?: boolean;
  showActions?: boolean;
  showPagination?: boolean;
  enableSorting?: boolean;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  pageSize?: number;
  viewHandler?: (selectedRecipe: IRecipe) => void;
  editHandler?: (selectedRecipe: IRecipe) => void;
  selectHandler?: (selectedRecipe: IRecipe) => void;
}
export const PREFIX = 'features.WranglerNewUI.Recipe';

const RecipeList = ({
  isOpen,
  showAllColumns,
  showActions,
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
    sortOrder,
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
      showallcolumns={showAllColumns ? true : false}
      showactions={showActions ? true : false}
      data-testid="recipe-table-container"
    >
      {!recipes ||
        (recipes.length === 0 && (
          <NoDataText>{T.translate(`${PREFIX}.emptyListMessage`)}</NoDataText>
        ))}
      {isOpen && recipes && recipes.length > 0 && (
        <>
          <RecipesTable
            allRecipies={recipes}
            showAllColumns={showAllColumns}
            showActions={showActions}
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

export default RecipeList;
