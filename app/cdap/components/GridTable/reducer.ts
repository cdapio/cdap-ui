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
  directivePanelIsOpen: false,
  tableMetaInfo: {
    columnCount: 0,
    rowCount: 0,
  },
  snackbarIsOpen: false,
  snackbarData: {
    open: false,
    isSuccess: false,
    message: '',
  },
  loading: false,
  headersNamesList: [],
  rowsDataList: [],
  showRecipePanel: false,
  gridData: {},
  missingDataList: [],
  invalidCountArray: [
    {
      label: 'Invalid',
      count: '0',
    },
  ],
  snackbarState: {},
  workspaceName: '',
  showBreadCrumb: true,
  showGridTable: false,
  columnType: '',
  selectedColumn: '',
};

enum IGridTableActions {
  IS_FIRST_WRANGLE,
  CONNECTOR_TYPE,
  IS_DIRECTIVE_PANEL_OPEN,
  IS_SNACKBAR_OPEN,
  SNACKBAR_DATA,
  TABLE_META_INFO,
  LOADING_STATUS,
  HEADER_NAMES,
  ROWS_DATA,
  SHOW_RECIPE_PANEL,
  GRID_DATA,
  MISSING_DATA_LIST,
  INVALID_COUNT_ARRAY,
  SET_GRID_DATA_AND_LOADER,
  TABLE_META_INFO_AND_ROWS_DATA,
  LOADER_AND_GRID_DATA,
  LOADER_AND_DIRECTIVE_OPEN,
  LOADER_GRID_DATA_AND_DIRECTIVE,
  SET_WORKSPACE_NAME,
  SHOW_BREADCRUMB,
  SHOW_GRID_TABLE,
  COLUMN_TYPE,
  SELECTED_COLUMN,
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
    case IGridTableActions.LOADING_STATUS:
      return {
        ...state,
        loading: action.payload,
      };
    case IGridTableActions.HEADER_NAMES:
      return {
        ...state,
        headersNamesList: action.payload,
      };
    case IGridTableActions.ROWS_DATA:
      return {
        ...state,
        rowsDataList: action.payload,
      };
    case IGridTableActions.SHOW_RECIPE_PANEL:
      return {
        ...state,
        showRecipePanel: action.payload,
      };
    case IGridTableActions.GRID_DATA:
      return {
        ...state,
        gridData: action.payload,
      };
    case IGridTableActions.MISSING_DATA_LIST:
      return {
        ...state,
        missingDataList: action.payload,
      };
    case IGridTableActions.INVALID_COUNT_ARRAY:
      return {
        ...state,
        invalidCountArray: action.payload,
      };
    case IGridTableActions.SET_GRID_DATA_AND_LOADER:
      return {
        ...state,
        loading: action.payload.loading,
        gridData: action.payload.gridData,
      };
    case IGridTableActions.TABLE_META_INFO_AND_ROWS_DATA:
      return {
        ...state,
        tableMetaInfo: action.payload.tableMetaInfo,
        rowsDataList: action.payload.rowsDataList,
      };
    case IGridTableActions.LOADER_AND_GRID_DATA:
      return {
        ...state,
        loading: action.payload.loading,
        gridData: action.payload.gridData,
      };

    case IGridTableActions.LOADER_AND_DIRECTIVE_OPEN:
      return {
        ...state,
        loading: action.payload.loading,
        directivePanelIsOpen: action.payload.directivePanelIsOpen,
      };
    case IGridTableActions.LOADER_GRID_DATA_AND_DIRECTIVE:
      return {
        ...state,
        loading: action.payload.loading,
        gridData: action.payload.gridData,
        directivePanelIsOpen: action.payload.directivePanelIsOpen,
      };
    case IGridTableActions.SET_WORKSPACE_NAME:
      return {
        ...state,
        workspaceName: action.payload,
      };

    case IGridTableActions.SHOW_BREADCRUMB:
      return {
        ...state,
        showBreadCrumb: action.payload,
      };
    case IGridTableActions.SHOW_GRID_TABLE:
      return {
        ...state,
        showGridTable: action.payload,
      };
    case IGridTableActions.COLUMN_TYPE:
      return {
        ...state,
        columnType: action.payload,
      };
    case IGridTableActions.SELECTED_COLUMN:
      return {
        ...state,
        selectedColumn: action.payload,
      };

    default:
      return state;
  }
};
