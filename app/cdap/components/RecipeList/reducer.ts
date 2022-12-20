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

import { IAction } from 'services/redux-helpers';
import { IRecipe, SortOrder, SortBy } from './types';
import { getCurrentNamespace } from 'services/NamespaceStore';
import MyDataPrepApi from 'api/dataprep';

export interface IState {
  deleteError?: string;
  sortColumn: SortBy;
  sortedOrder: SortOrder;
  previousTokens: string[];
  nextPageToken: string;
  pageToken: string;
  pageLimit: number;
  recipes: IRecipe[];
}

const Actions = {
  setRecipes: 'SET_RECIPES',
  prevPage: 'RECIPE_PREV_PAGE',
  nextPage: 'RECIPE_NEXT_PAGE',
  setSort: 'RECIPE_SET_SORT',
  reset: 'RECIPE_RESET',
};

export const defaultInitialState: IState = {
  recipes: null,
  nextPageToken: null,
  previousTokens: [],
  pageToken: null,
  pageLimit: 10,
  sortColumn: SortBy.UPDATED,
  sortedOrder: SortOrder.DESCENDING,
};

export const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case Actions.setSort:
      return {
        ...state,
        sortColumn: action.payload.sortColumn,
        sortedOrder: action.payload.sortOrder,
        pageToken: null,
        previousTokens: [],
        recipes: action.payload.recipes,
        nextPageToken: action.payload.nextPageToken,
      };
    case Actions.prevPage:
      const lastTokenIdx = state.previousTokens.length - 1;
      const lastToken = state.previousTokens[lastTokenIdx];
      return {
        ...state,
        previousTokens: state.previousTokens.slice(0, lastTokenIdx),
        pageToken: lastToken,
        recipes: action.payload.recipes,
        nextPageToken: action.payload.nextPageToken,
      };
    case Actions.nextPage:
      return {
        ...state,
        previousTokens: [...state.previousTokens, state.pageToken],
        pageToken: state.nextPageToken,
        recipes: action.payload.recipes,
        nextPageToken: action.payload.nextPageToken,
      };
    case Actions.setRecipes:
      return {
        ...state,
        recipes: action.payload.recipes,
        nextPageToken: action.payload.nextPageToken,
      };
    case Actions.reset:
      return {
        ...defaultInitialState,
        pageLimit: state.pageLimit,
        recipes: action.payload.recipes,
        nextPageToken: action.payload.nextPageToken,
      };
    default:
      return state;
  }
};

export function reset(dispatch, state) {
  getRecipes({ ...defaultInitialState, pageLimit: state.pageLimit }).subscribe((res) => {
    dispatch({
      type: Actions.reset,
      payload: {
        recipes: res.values,
        nextPageToken: res.nextPageToken,
      },
    });
  });
}

export function getSavedRecipes(dispatch, state) {
  getRecipes({ ...state }).subscribe((res) => {
    dispatch({
      type: Actions.setRecipes,
      payload: {
        recipes: res.values,
        nextPageToken: res.nextPageToken,
      },
    });
  });
}

export function prevPage(dispatch, state) {
  const { previousTokens } = state;
  if (!previousTokens.length) {
    return;
  }
  getRecipes({ ...state, pageToken: previousTokens[previousTokens.length - 1] }).subscribe(
    (res) => {
      dispatch({
        type: Actions.prevPage,
        payload: {
          recipes: res.values,
          nextPageToken: res.nextPageToken,
        },
      });
    }
  );
}

export function nextPage(dispatch, state) {
  const { nextPageToken } = state;
  if (!nextPageToken) {
    return;
  }

  getRecipes({ ...state, pageToken: nextPageToken }).subscribe((res) => {
    dispatch({
      type: Actions.nextPage,
      payload: {
        recipes: res.values,
        nextPageToken: res.nextPageToken,
      },
    });
  });
}

export function setSort(dispatch, state, columnName: string) {
  const currentColumn = state.sortColumn;
  const currentSortOrder = state.sortedOrder;

  let sortOrder = SortOrder.ASCENDING;
  if (currentColumn === columnName && currentSortOrder === SortOrder.ASCENDING) {
    sortOrder = SortOrder.DESCENDING;
  }

  getRecipes({
    ...state,
    sortColumn: columnName,
    sortedOrder: sortOrder,
    pageToken: null,
  }).subscribe((res) => {
    dispatch({
      type: Actions.setSort,
      payload: {
        sortColumn: columnName,
        sortOrder,
        recipes: res.values,
        nextPageToken: res.nextPageToken,
      },
    });
  });
}

function getRecipes(state) {
  const { pageToken, sortedOrder, sortColumn, pageLimit } = state;
  return MyDataPrepApi.getRecipeList({
    context: getCurrentNamespace(),
    pageToken,
    sortBy: sortColumn,
    pageSize: pageLimit,
    sortOrder: sortedOrder,
  });
}

export const getRecipeDetailsById = (recipeId, responseHandler) => {
  MyDataPrepApi.getRecipeById({
    context: getCurrentNamespace(),
    recipeId,
  }).subscribe((res) => {
    if (responseHandler) {
      responseHandler(res);
    }
  });
};

export const deleteRecipe = (recipeId, responseHandler, errorHandler) => {
  MyDataPrepApi.deleteRecipe({
    context: getCurrentNamespace(),
    recipeId,
  }).subscribe(
    () => {
      if (responseHandler) {
        responseHandler();
      }
    },
    (err) => {
      if (errorHandler) {
        errorHandler(err);
      }
    }
  );
};
