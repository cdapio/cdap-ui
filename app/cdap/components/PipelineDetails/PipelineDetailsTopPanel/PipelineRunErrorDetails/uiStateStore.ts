/*
 * Copyright © 2025 Cask Data, Inc.
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

import { createStore } from 'redux';

interface IErrorDetailsBannerUiState {
  detailsExpanded: boolean;
  highlightedStage: string;
}

const errorDetailsBannerUiState: IErrorDetailsBannerUiState = {
  detailsExpanded: false,
  highlightedStage: '',
};

const ACTION_PREFIX = 'ERROR_DETAILS_BANNER_ACTIONS';
export const ErrorDetailsBannerUiActions = {
  EXPAND_ERROR_DETAILS: `${ACTION_PREFIX}/EXPAND_ERROR_DETAILS`,
  COLLAPSE_ERROR_DETAILS: `${ACTION_PREFIX}/COLLAPSE_ERROR_DETAILS`,
  SET_HIGHLIGHTED_STAGE: `${ACTION_PREFIX}/SET_HIGHLIGHTED_STAGE`,
  RESET_HIGHLIGHTED_STAGE: `${ACTION_PREFIX}/RESET_HIGHLIGHTED_STAGE`,
  RESET: `${ACTION_PREFIX}/RESET`,
};

function errorDetailsBannerUiReducer(
  state: IErrorDetailsBannerUiState,
  action
): IErrorDetailsBannerUiState {
  switch (action.type) {
    case ErrorDetailsBannerUiActions.EXPAND_ERROR_DETAILS:
      return { ...state, detailsExpanded: true };
    case ErrorDetailsBannerUiActions.COLLAPSE_ERROR_DETAILS:
      return { ...state, detailsExpanded: false, highlightedStage: '' };
    case ErrorDetailsBannerUiActions.SET_HIGHLIGHTED_STAGE:
      return { ...state, highlightedStage: action.payload };
    case ErrorDetailsBannerUiActions.RESET_HIGHLIGHTED_STAGE:
      return { ...state, highlightedStage: '' };
    case ErrorDetailsBannerUiActions.RESET:
      return errorDetailsBannerUiState;
    default:
      return state;
  }
}

const ErrorDetailsBannerUiStore = createStore(
  errorDetailsBannerUiReducer,
  errorDetailsBannerUiState
);

export function expandErrorDetailsWithHighlightedStage(stageName: string) {
  ErrorDetailsBannerUiStore.dispatch({
    type: ErrorDetailsBannerUiActions.SET_HIGHLIGHTED_STAGE,
    payload: stageName,
  });
  ErrorDetailsBannerUiStore.dispatch({
    type: ErrorDetailsBannerUiActions.EXPAND_ERROR_DETAILS,
  });
}

export default ErrorDetailsBannerUiStore;
