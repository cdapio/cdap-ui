/*
 * Copyright © 2018 Cask Data, Inc.
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

import { getCurrentNamespace } from 'services/NamespaceStore';
import MyDataPrepApi from 'api/dataprep';
import Store, { Actions } from 'components/RecipeList/store';

import { SortOrder } from '../types';

// let initialState: IState;

export const setInitialState = (pageSize, sortBy, sortOrder) => {
  Store.dispatch({
    type: Actions.setInitValues,
    payload: {
      pageSize,
      sortBy,
      sortOrder,
    },
  });
};

export function reset() {
  Store.dispatch({
    type: Actions.reset,
  });
  getSavedRecipes();
}

export function getSavedRecipes() {
  const { pageToken, sortedOrder, sortColumn, pageLimit } = Store.getState().recipeList;

  MyDataPrepApi.getRecipeList({
    context: getCurrentNamespace(),
    pageToken,
    sortBy: sortColumn,
    pageSize: pageLimit,
    sortOrder: sortedOrder,
  }).subscribe((recipesResponse) => {
    Store.dispatch({
      type: Actions.setRecipes,
      payload: {
        recipes: recipesResponse.values,
        nextPageToken: recipesResponse.nextPageToken,
      },
    });
  });
}

export function setRecipes({ values, nextPageToken }) {
  Store.dispatch({
    type: Actions.setRecipes,
    payload: {
      values,
      nextPageToken,
    },
  });
}

export function prevPage() {
  const { previousTokens } = Store.getState().recipeList;
  if (!previousTokens.length) {
    return;
  }
  Store.dispatch({
    type: Actions.prevPage,
  });
  getSavedRecipes();
}

export function nextPage() {
  const { nextPageToken } = Store.getState().recipeList;
  if (!nextPageToken) {
    return;
  }
  Store.dispatch({
    type: Actions.nextPage,
  });
  getSavedRecipes();
}

export function setSort(columnName: string) {
  const state = Store.getState().recipeList;
  const currentColumn = state.sortColumn;
  const currentSortOrder = state.sortedOrder;

  let sortOrder = SortOrder.ASCENDING;
  if (currentColumn === columnName && currentSortOrder === SortOrder.ASCENDING) {
    sortOrder = SortOrder.DESCENDING;
  }

  Store.dispatch({
    type: Actions.setSort,
    payload: {
      sortColumn: columnName,
      sortOrder,
    },
  });
  getSavedRecipes();
}
