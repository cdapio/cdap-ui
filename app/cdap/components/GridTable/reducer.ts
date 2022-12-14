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

export const initialGridTableState = {
  isFirstWrangle: false,
  connectorType: null,
  directivePanelIsOpen: false,
  snackbarIsOpen: false,
  snackbarData: {
    open: false,
    isSuccess: false,
    message: ''
  },
  tableMetaInfo: {
    columnCount: 0,
    rowCount: 0,
  },
};

enum IGridTableActions {
  IS_FIRST_WRANGLE,
  CONNECTOR_TYPE,
  IS_DIRECTIVE_PANEL_OPEN,
  IS_SNACKBAR_OPEN,
  SNACKBAR_DATA,
  TABLE_META_INFO,
}

export const reducer = (state, action) => {
  switch (action.type) {
    case IGridTableActions.IS_FIRST_WRANGLE:
      return {
        ...state,
        isFirstWrangle: action.payload,
      };
    case IGridTableActions.CONNECTOR_TYPE:
      return {
        ...state,
        connectorType: action.payload,
      };
    case IGridTableActions.IS_DIRECTIVE_PANEL_OPEN:
      return {
        ...state,
        directivePanelIsOpen: action.payload,
      };
    case IGridTableActions.IS_SNACKBAR_OPEN:
      return {
        ...state,
        snackbarIsOpen: action.payload,
      };
    case IGridTableActions.SNACKBAR_DATA:
      return {
        ...state,
        snackbarData: action.payload,
      };
    case IGridTableActions.TABLE_META_INFO:
      return {
        ...state,
        tableMetaInfo: action.payload,
      };
    default:
      return state;
  }
};
