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

import React, { useEffect, useState } from 'react';
import { RecipesTable } from './RecipesTable';
import PaginationStepper from 'components/shared/PaginationStepper';
import { RecipeTableDiv, PaginationContainer } from './styles';
import { IRecipe, SortBy, SortOrder } from './types';
import {
  nextPage,
  prevPage,
  reset,
  getSavedRecipes,
  setInitialState,
} from 'components/RecipeList/store/ActionCreator';
import { useSelector } from 'react-redux';
import Store from 'components/RecipeList/store';

import { Provider } from 'react-redux';

const PREFIX = 'features.WranglerNewUI.Recipe';

interface IRecipeListProps {
  isOpen: boolean;
  isShowAllColumns?: boolean;
  isShowActions?: boolean;
  showPagination?: boolean;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  pageSize?: number;
  viewHandler?: (IRecipe) => void;
  editHandler?: (IRecipe) => void;
  selectHandler?: (IRecipe) => void;
}

const RecipeList = ({
  isOpen,
  isShowAllColumns,
  isShowActions,
  showPagination,
  sortBy,
  sortOrder,
  pageSize,
  viewHandler,
  editHandler,
  selectHandler,
}: IRecipeListProps) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState('');

  const { sortedOrder, sortColumn, recipes } = useSelector(({ recipeList }) => recipeList);

  const Pagination = ({}) => {
    const { prevDisabled, nextDisabled } = useSelector(({ recipeList }) => ({
      prevDisabled: !recipeList.previousTokens.length,
      nextDisabled: !recipeList.nextPageToken,
    }));

    return (
      <PaginationContainer className="float-left">
        <div>
          <PaginationStepper
            onNext={nextPage}
            onPrev={prevPage}
            nextDisabled={nextDisabled}
            prevDisabled={prevDisabled}
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
    setInitialState(pageSize, sortBy, sortOrder);
    getSavedRecipes();
  }, []);

  // on unmount
  React.useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return (
    <RecipeTableDiv isShowAllColumns={isShowAllColumns} isShowActions={isShowActions}>
      {isOpen && (
        <>
          <RecipesTable
            allRecipies={recipes}
            isShowAllColumns={isShowAllColumns}
            isShowActions={isShowActions}
            viewHandler={viewRecipeHandler}
            editHandler={editRecipeHanlder}
            selectHandler={selectRecipeHanlder}
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
  showActions = true,
  showPagination = true,
  sortBy = SortBy.NAME,
  sortOrder = SortOrder.ASCENDING,
  pageSize = 10,
}) => (
  <Provider store={Store}>
    <RecipeList
      isOpen={isOpen}
      isShowAllColumns={isShowAllColumns}
      viewHandler={viewHandler}
      editHandler={editHandler}
      selectHandler={selectHandler}
      isShowActions={showActions}
      showPagination={showPagination}
      sortBy={sortBy}
      sortOrder={sortOrder}
      pageSize={pageSize}
    />
  </Provider>
);

export default RecipeListOuter;
