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
import { IRecipe, SortOrder } from './types';
import { getCurrentNamespace } from 'services/NamespaceStore';
import MyDataPrepApi from 'api/dataprep';

export interface IState {
  deleteError?: string;
  sortColumn: string;
  sortedOrder: SortOrder;
  previousTokens: string[];
  nextPageToken: string;
  pageToken: string;
  pageLimit: number;
  recipes: IRecipe[];
  ready: boolean;
}

const Actions = {
  setRecipes: 'SET_RECIPES',
  prevPage: 'RECIPE_PREV_PAGE',
  nextPage: 'RECIPE_NEXT_PAGE',
  setSort: 'RECIPE_SET_SORT',
  reset: 'RECIPE_RESET',
  setInitValues: 'RECIPE_SET_INIT_VALUES',
};

export const defaultInitialState: IState = {
  recipes: null,
  ready: false,
  nextPageToken: null,
  previousTokens: [],
  pageToken: null,
  pageLimit: 10,
  sortColumn: 'name',
  sortedOrder: SortOrder.ASCENDING,
};

export const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case Actions.setInitValues:
      return {
        ...state,
        sortColumn: action.payload.sortBy,
        sortedOrder: action.payload.sortOrder,
        pageLimit: action.payload.pageSize,
      };
    case Actions.setSort:
      return {
        ...state,
        sortColumn: action.payload.sortColumn,
        sortedOrder: action.payload.sortOrder,
        pageToken: null,
        previousTokens: [],
        nextPageToken: null,
        ready: false,
      };
    case Actions.prevPage:
      const lastTokenIdx = state.previousTokens.length - 1;
      const lastToken = state.previousTokens[lastTokenIdx];
      return {
        ...state,
        previousTokens: state.previousTokens.slice(0, lastTokenIdx),
        nextPageToken: state.pageToken,
        pageToken: lastToken,
        ready: false,
      };
    case Actions.nextPage:
      return {
        ...state,
        previousTokens: [...state.previousTokens, state.pageToken],
        nextPageToken: null,
        pageToken: state.nextPageToken,
        ready: false,
      };
    case Actions.setRecipes:
      return {
        ...state,
        recipes: action.payload.recipes,
        nextPageToken: action.payload.nextPageToken,
        ready: true,
      };
    case Actions.reset:
      return { ...defaultInitialState, pageLimit: state.pageLimit };
    default:
      return state;
  }
};

export function reset(dispatch, state) {
  dispatch({
    type: Actions.reset,
  });
  getSavedRecipes(dispatch, { ...defaultInitialState, pageLimit: state.pageLimit });
}

export function getSavedRecipes(dispatch, state) {
  const { pageToken, sortedOrder, sortColumn, pageLimit } = state;

  MyDataPrepApi.getRecipeList({
    context: getCurrentNamespace(),
    pageToken,
    sortBy: sortColumn,
    pageSize: pageLimit,
    sortOrder: sortedOrder,
  }).subscribe((recipesResponse) => {
    dispatch({
      type: Actions.setRecipes,
      payload: {
        recipes: recipesResponse.values,
        nextPageToken: recipesResponse.nextPageToken,
      },
    });
  });
}

export function prevPage(dispatch, state) {
  const { previousTokens } = state;
  if (!previousTokens.length) {
    return;
  }
  dispatch({
    type: Actions.prevPage,
  });
  getSavedRecipes(dispatch, { ...state, pageToken: previousTokens[previousTokens.length - 1] });
}

export function nextPage(dispatch, state) {
  const { nextPageToken } = state;
  if (!nextPageToken) {
    return;
  }
  dispatch({
    type: Actions.nextPage,
  });
  getSavedRecipes(dispatch, { ...state, pageToken: nextPageToken });
}

export function setSort(dispatch, state, columnName: string) {
  const currentColumn = state.sortColumn;
  const currentSortOrder = state.sortedOrder;

  let sortOrder = SortOrder.ASCENDING;
  if (currentColumn === columnName && currentSortOrder === SortOrder.ASCENDING) {
    sortOrder = SortOrder.DESCENDING;
  }

  dispatch({
    type: Actions.setSort,
    payload: {
      sortColumn: columnName,
      sortOrder,
    },
  });
  getSavedRecipes(dispatch, {
    ...state,
    sortColumn: columnName,
    sortedOrder: sortOrder,
    pageToken: null,
  });
}
