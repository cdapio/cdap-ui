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

import React from 'react';
import { UiActions } from './actions';

interface IUiState {
  modalShown: boolean;
  modalToRender?: React.ReactNode;
  modalOnClose?: () => void;
  // fill in
}

export const uiInitialState: IUiState = {
  modalShown: false,
  modalToRender: null,
  // fill in
};

export const uiState = (state: IUiState = uiInitialState, action?): IUiState => {
  switch (action.type) {
    case UiActions.OPEN_MODAL:
      return {
        ...state,
        modalShown: true,
        modalToRender: action.payload.render,
        modalOnClose: action.payload.onClose,
      };

    case UiActions.CLOSE_MODAL:
      return {
        ...state,
        modalShown: false,
        modalToRender: null,
        modalOnClose: null,
      };

    default:
      return state;
  }
};
