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

import { combineReducers, createStore } from 'redux';
import { composeEnhancers } from 'services/helpers';
import { Reducer, Store as StoreInterface } from 'redux';
import { IAction } from 'services/redux-helpers';
import { IRecipe, SortOrder } from '../types';

interface IState {
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

interface IStore {
  recipeList: IState;
}

const Actions = {
  setRecipes: 'SET_RECIPES',
  prevPage: 'RECIPE_PREV_PAGE',
  nextPage: 'RECIPE_NEXT_PAGE',
  setSort: 'RECIPE_SET_SORT',
  reset: 'RECIPE_RESET',
  setInitValues: 'RECIPE_SET_INIT_VALUES',
};

const defaultInitialState: IState = {
  recipes: null,
  ready: false,
  nextPageToken: null,
  previousTokens: [],
  pageToken: null,
  pageLimit: 10,
  sortColumn: 'name',
  sortedOrder: SortOrder.ASCENDING,
};

const recipeList: Reducer<IState> = (state = defaultInitialState, action: IAction) => {
  // alert('in Reducer');
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

const Store: StoreInterface<IStore> = createStore(
  combineReducers({
    recipeList,
  }),
  {
    recipeList: defaultInitialState,
  },
  composeEnhancers('RecipesStore')()
);

export default Store;
export { Actions, IStore };
