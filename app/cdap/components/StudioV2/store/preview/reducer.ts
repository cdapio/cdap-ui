/*
 * Copyright © 2024 Cask Data, Inc.
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

import { PreviewActions } from './actions';

interface IPreviewState {
  isPreviewModeEnabled?: boolean;
  startTime?: any;
  status?: any;
  previewId?: string;
  previewData?: any;
  macros?: any;
  userRuntimeArguments?: any;
  // `runtimeArgsForDisplay` combines `macros` map and `userRuntimeArguments` map
  // to create an object that can be used as a prop to the KeyValuePairs component
  runtimeArgsForDisplay?: any;
  timeoutInMinutes?: number;
}

export const previewInitialState: IPreviewState = {
  isPreviewModeEnabled: false,
  startTime: null,
  status: null,
  previewId: null,
  previewData: false,
  macros: {},
  userRuntimeArguments: {},
  runtimeArgsForDisplay: {},
  timeoutInMinutes: 2,
};

export const preview = (state: IPreviewState = previewInitialState, action?): IPreviewState => {
  switch (action.type) {
    case PreviewActions.TOGGLE_PREVIEW_MODE:
      const { isPreviewModeEnabled } = action.payload;
      return { ...state, isPreviewModeEnabled };

    case PreviewActions.SET_PREVIEW_START_TIME:
      const { startTime } = action.payload;
      return { ...state, startTime };

    case PreviewActions.SET_PREVIEW_STATUS:
      const { status } = action.payload;
      return { ...state, status };

    case PreviewActions.SET_PREVIEW_ID:
      const { previewId } = action.payload;
      return { ...state, previewId };

    case PreviewActions.SET_MACROS:
      const macros = action.payload.macrosMap;
      return { ...state, macros };

    case PreviewActions.SET_USER_RUNTIME_ARGUMENTS:
      const userRuntimeArguments = action.payload.userRuntimeArgumentsMap;
      return { ...state, userRuntimeArguments };

    case PreviewActions.SET_RUNTIME_ARGS_FOR_DISPLAY:
      const runtimeArgsForDisplay = action.payload.args;
      return { ...state, runtimeArgsForDisplay };

    case PreviewActions.SET_TIMEOUT_IN_MINUTES:
      const { timeoutInMinutes } = action.payload;
      return { ...state, timeoutInMinutes };

    case PreviewActions.SET_PREVIEW_DATA:
      return { ...state, previewData: action.payload };

    case PreviewActions.RESET_PREVIEW_DATA:
      return { ...state, previewData: false };

    case PreviewActions.PREVIEW_RESET:
      return previewInitialState;

    default:
      return state;
  }
};
