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

import { Button, Table, TableBody, TableHead, TableRow } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MyDataPrepApi from 'api/dataprep';
import Breadcrumb from 'components/Breadcrumb';
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import FooterPanel from 'components/FooterPanel';
import NoRecordScreen from 'components/NoRecordScreen';
import LoadingSVG from 'components/shared/LoadingSVG';
import { IValues } from 'components/WrangleHome/Components/OngoingDataExploration/types';
import T from 'i18n-react';
import GridHeaderCell from 'components/GridTable/components/GridHeaderCell';
import GridKPICell from 'components/GridTable/components/GridKPICell';
import GridTextCell from 'components/GridTable/components/GridTextCell';
import DirectiveInput from 'components/DirectiveInput';
import { applyDirectives, getAPIRequestPayload } from 'components/GridTable/services';
import { useStyles } from 'components/GridTable/styles';
import React, { useEffect, useState, useReducer } from 'react';
import { useParams } from 'react-router';
import { flatMap } from 'rxjs/operators';
import { objectQuery } from 'services/helpers';
import RecipeSteps from 'components/RecipeSteps';
import Snackbar from 'components/Snackbar';
import {
  IExecuteAPIResponse,
  IApiPayload,
  IHeaderNamesList,
  IGridParams,
  IObject,
  IParams,
  IRecords,
  IRowData,
  IMissingListData,
} from 'components/GridTable/types';
import styled from 'styled-components';
import { reducer, initialGridTableState } from 'components/GridTable/reducer';
import ToolBarList from 'components/WranglerGrid/TransformationToolbar';
import { getWrangleGridBreadcrumbOptions } from 'components/GridTable/utils';
import useSnackbar from 'components/Snackbar/useSnackbar';
import { useLocation } from 'react-router';
import GridTableContainer from './components/GridTableContainer';

export const TableWrapper = styled(Box)`
  height: calc(100vh - 193px);
  overflow-y: auto;
  width: 100%;
`;

const TablePanelContainer = styled(Box)`
  display: flex;
  font-family: Roboto;
`;

const GridTableWrapper = styled(Box)`
  max-width: 100%;
  overflow-x: auto;
  max-height: calc(100vh - 190px);
`;

const RecipeStepPanel = styled(Box)`
  max-height: calc(100vh - 190px);
  box-shadow: -3px 4px 15px rgba(68, 132, 245, 0.25);
`;

export default function GridTable() {
  const { wid } = useParams() as IRecords;
  const params = useParams() as IRecords;
  const classes = useStyles();
  const location = useLocation();

  const { dataprep } = DataPrepStore.getState();
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

  const [gridTableState, dispatch] = useReducer(reducer, initialGridTableState);
  const {
    isFirstWrangle,
    connectorType,
    directivePanelIsOpen,
    snackbarIsOpen,
    snackbarData,
    tableMetaInfo,
    loading,
    headersNamesList,
    rowsDataList,
    gridData,
    missingDataList,
    workspaceName,
    showBreadCrumb,
    showGridTable,
    invalidCountArray,
    columnType,
    selectedColumn,
    n,
    showRecipePanel,
  } = gridTableState;

  useEffect(() => {
    dispatch({
      type: IGridTableActions.IS_FIRST_WRANGLE,
      payload: true,
    });
    dispatch({
      type: IGridTableActions.CONNECTOR_TYPE,
      payload: dataprep.connectorType,
    });
  }, []);

  const { directives } = dataprep;
  const addDirectives = (directive: string) => {
    dispatch({
      type: IGridTableActions.LOADING_STATUS,
      payload: true,
    });
    if (directive) {
      const apiPayload: IApiPayload = getAPIRequestPayload(params, directive, '');
      addDirectiveAPICall(apiPayload);
    }
  };

  const addDirectiveAPICall = (apiPayload: IApiPayload) => {
    const gridParams: IGridParams = apiPayload.gridParams;
    applyDirectives(wid, gridParams.directives).subscribe(
      (response) => {
        DataPrepStore.dispatch({
          type: DataPrepActions.setWorkspace,
          payload: {
            data: response.values,
            values: response.values,
            headers: response.headers,
            types: response.types,
            ...gridParams,
          },
        });

        dispatch({
          type: IGridTableActions.LOADER_GRID_DATA_AND_DIRECTIVE,
          payload: {
            loading: false,
            gridData: response,
            directivePanelIsOpen: false,
          },
        });
        dispatch({
          type: IGridTableActions.SNACKBAR_DATA,
          payload: {
            message: T.translate(`Transformation successfully added`).toString(),
            isSuccess: true,
            open: true,
          },
        });
      },
      (err) => {
        dispatch({
          type: IGridTableActions.LOADER_AND_DIRECTIVE_OPEN,
          payload: {
            loading: false,
            directivePanelIsOpen: false,
          },
        });
        dispatch({
          type: IGridTableActions.SNACKBAR_DATA,
          payload: {
            message: `Failed to add transformation`,
            isSuccess: false,
            open: true,
          },
        });
      }
    );
  };

  const getWorkSpaceData = (payload: IParams, workspaceId: string) => {
    let gridParams = {};
    dispatch({
      type: IGridTableActions.LOADING_STATUS,
      payload: true,
    });
    DataPrepStore.dispatch({
      type: DataPrepActions.setWorkspaceId,
      payload: {
        workspaceId,
        loading: true,
      },
    });
    MyDataPrepApi.getWorkspace(payload)
      .pipe(
        flatMap((res: IValues) => {
          const { dataprep } = DataPrepStore.getState();
          dispatch({
            type: IGridTableActions.SET_WORKSPACE_NAME,
            payload: res?.workspaceName,
          });
          if (dataprep.workspaceId !== workspaceId) {
            return;
          }
          const directives = objectQuery(res, 'directives') || [];
          const requestBody = directiveRequestBodyCreator(directives);
          const sampleSpec = objectQuery(res, 'sampleSpec') || {};
          const visualization = objectQuery(res, 'insights', 'visualization') || {};

          const insights = {
            name: sampleSpec.connectionName,
            workspaceName: res.workspaceName,
            path: sampleSpec.path,
            visualization,
          };
          requestBody.insights = insights;

          const workspaceUri = objectQuery(res, 'sampleSpec', 'path');
          const workspaceInfo = {
            properties: insights,
          };
          gridParams = {
            directives,
            workspaceId,
            workspaceUri,
            workspaceInfo,
            insights,
          };
          return MyDataPrepApi.execute(payload, requestBody);
        })
      )
      .subscribe((response) => {
        DataPrepStore.dispatch({
          type: DataPrepActions.setWorkspace,
          payload: {
            data: response.values,
            headers: response.headers,
            types: response.types,
            ...gridParams,
          },
        });

        dispatch({
          type: IGridTableActions.LOADER_AND_GRID_DATA,
          payload: {
            loader: false,
            gridData: response,
          },
        });
      });
  };

  const snackbarString = (action, arr, removedDirectiveListLength, from) => {
    if (action === 'add') {
      return `Transformation ${arr} successfully added`;
    } else if (from === 'undo' || arr?.length === 0) {
      return 'Transformation successfully deleted';
    } else {
      return `${removedDirectiveListLength} transformation successfully deleted from ${
        arr[arr.length - 1]
      }`;
    }
  };

  useEffect(() => {
    // Get DATA from URL paramteres to get data of workspace
    const payload = {
      context: params.namespace,
      workspaceId: params.wid,
    };
    getWorkSpaceData(payload as IParams, wid as string);
  }, [wid]);

  // ------------@createHeadersData Function is used for creating data of Table Header
  const createHeadersData = (columnNamesList: string[], columnTypesList: IRecords) => {
    if (Array.isArray(columnNamesList)) {
      return columnNamesList.map((eachColumnName: string) => {
        return {
          name: eachColumnName,
          label: eachColumnName,
          type: [columnTypesList[eachColumnName]] as string[],
        };
      });
    }
  };

  // ------------@convertNonNullPercent Function is used for calculation of Missing/Null value
  const convertNonNullPercent = (nonNullValue) => {
    const lengthOfData: number = gridData?.values.length;
    let count: number = 0;
    let emptyCount: number = 0;
    let nullValueCount: number = 0;
    if (lengthOfData) {
      nullValueCount = nonNullValue.null ? (nonNullValue.null / 100) * lengthOfData : 0;
      emptyCount = nonNullValue.empty ? (nonNullValue.empty / 100) * lengthOfData : 0;
      count = parseInt(nullValueCount.toFixed(0) + emptyCount.toFixed(0), 2);
    }
    return count;
  };

  // ------------@checkFrequentlyOccuredValues Function is used for checking which value appears maximum time in a column if that column doesn't have missing/null value
  const checkFrequentlyOccuredValues = (key) => {
    const valueOfKey = gridData.values.map((el) => el[key]);
    let mostFrequentItem: number = 1;
    let mostFrequentItemCount: number = 0;
    let mostFrequentItemValue: string = '';
    const mostFrequentDataItem = {
      name: '',
      count: 0,
    };
    if (Array.isArray(valueOfKey) && valueOfKey.length) {
      valueOfKey.map((item, index) => {
        valueOfKey.map((value, valueIndex) => {
          if (item === value) {
            mostFrequentItemCount++;
          }
          if (mostFrequentItem < mostFrequentItemCount) {
            mostFrequentItem = mostFrequentItemCount;
            mostFrequentItemValue = item as string;
          }
        });
        mostFrequentItemCount = 0;
        mostFrequentItemValue =
          mostFrequentItemValue === '' ? (item as string) : mostFrequentItemValue;
      });
    }
    mostFrequentDataItem.name = mostFrequentItemValue;
    mostFrequentDataItem.count = mostFrequentItemCount;
    return mostFrequentDataItem;
  };

  // ------------@createMissingData Function is used for preparing data for second row of Table which shows Missing/Null Value
  const createMissingData = (statistics: IRecords) => {
    const statisticObjectToArray = Object.entries(statistics);
    const metricArray = [];
    statisticObjectToArray.forEach(([key, value]) => {
      const headerKeyTypeArray = Object.entries(value);
      const arrayForMissingValue = [];
      headerKeyTypeArray.forEach(([vKey, vValue]) => {
        if (vKey !== 'types') {
          arrayForMissingValue.push({
            label:
              convertNonNullPercent(vValue) === 0
                ? checkFrequentlyOccuredValues(key).name
                : 'Missing/Null',
            count:
              convertNonNullPercent(vValue) === 0
                ? checkFrequentlyOccuredValues(key).count
                : convertNonNullPercent(vValue),
          });
        }
      }),
        metricArray.push({
          name: key,
          values: arrayForMissingValue.concat(invalidCountArray),
        });
    });
    return metricArray;
  };

  // ------------@getGridTableData Function is used for preparing data for entire grid-table
  const getGridTableData = async () => {
    const rawData: IExecuteAPIResponse = gridData;
    const headersData = createHeadersData(rawData.headers, rawData.types);
    dispatch({
      type: IGridTableActions.HEADER_NAMES,
      payload: headersData,
    });
    if (rawData && rawData.summary && rawData.summary.statistics) {
      const missingData = createMissingData(gridData?.summary.statistics);
      dispatch({
        type: IGridTableActions.MISSING_DATA_LIST,
        payload: missingData,
      });
    }
    const rowData: IRowData[] =
      rawData &&
      rawData.values &&
      Array.isArray(rawData?.values) &&
      (rawData?.values.map((eachRow: IRecords) => {
        const { ...rest } = eachRow;
        return rest;
      }) as IRowData[]);

    dispatch({
      type: IGridTableActions.TABLE_META_INFO_AND_ROWS_DATA,
      payload: {
        tableMetaInfo: {
          columnCount: rawData?.headers?.length,
          rowCount: rawData?.values?.length - 1,
        },
        rowsDataList: rowData,
      },
    });
  };

  const isParsingPanel =
    dataprep?.insights?.name &&
    isFirstWrangle &&
    connectorType === 'File' &&
    Array.isArray(gridData?.headers) &&
    gridData?.headers.length !== 0;

  const showRecipePanelHandler = () => {
    dispatch({
      type: IGridTableActions.SHOW_RECIPE_PANEL,
      payload: !showRecipePanel,
    });
  };

  const applyDirectiveAPICall = (newDirectiveList, action, removedDirectiveList, from) => {
    dispatch({
      type: IGridTableActions.LOADING_STATUS,
      payload: true,
    });
    const { dataprep } = DataPrepStore.getState();
    const { workspaceId, workspaceUri, directives, insights } = dataprep;
    let gridParams = {};
    const updatedDirectives =
      action === 'add' ? directives.concat(newDirectiveList) : newDirectiveList;
    const requestBody = directiveRequestBodyCreator(updatedDirectives);
    const arr = JSON.parse(JSON.stringify(newDirectiveList));
    requestBody.insights = insights;

    const workspaceInfo = {
      properties: insights,
    };
    gridParams = {
      directives: updatedDirectives,
      workspaceId,
      workspaceUri,
      workspaceInfo,
      insights,
    };
    const payload = {
      context: params.namespace,
      workspaceId: params.wid,
    };
    MyDataPrepApi.execute(payload, requestBody).subscribe(
      (response) => {
        DataPrepStore.dispatch({
          type: DataPrepActions.setWorkspace,
          payload: {
            data: response.values,
            values: response.values,
            headers: response.headers,
            types: response.types,
            ...gridParams,
          },
        });
        dispatch({
          type: IGridTableActions.SET_GRID_DATA_AND_LOADER,
          payload: {
            loading: false,
            gridData: response,
          },
        });
        dispatch({
          type: IGridTableActions.SHOW_RECIPE_PANEL,
          payload: false,
        });
        dispatch({
          type: IGridTableActions.SNACKBAR_DATA,
          payload: {
            message: snackbarString(action, arr, removedDirectiveList.length, from),
            isSuccess: true,
            open: true,
          },
        });
      },
      (err) => {
        dispatch({
          type: IGridTableActions.SNACKBAR_DATA,
          payload: {
            message: `Failed to transform ${newDirectiveList}`,
            isSuccess: false,
            open: true,
          },
        });
        dispatch({
          type: IGridTableActions.LOADING_STATUS,
          payload: {
            loading: false,
          },
        });
        dispatch({
          type: IGridTableActions.SHOW_RECIPE_PANEL,
          payload: false,
        });
      }
    );
  };

  const onDeleteRecipeSteps = (newRecipeStepList, removedRecipeStepList) => {
    applyDirectiveAPICall(newRecipeStepList, 'delete', removedRecipeStepList, 'panel');
    DataPrepStore.dispatch({
      type: DataPrepActions.setUndoDirective,
      payload: {
        undoDirectives: [],
      },
    });
  };

  useEffect(() => {
    getGridTableData();
    dispatch({
      type: IGridTableActions.SHOW_GRID_TABLE,
      payload: Array.isArray(gridData?.headers) && gridData?.headers.length !== 0,
    });
  }, [gridData]);

  const getColumnSelectPayload = (columnName) => (selectedColumn === columnName ? '' : columnName);

  const handleColumnSelect = (columnName) => {
    dispatch({
      type: IGridTableActions.SELECTED_COLUMN,
      payload: getColumnSelectPayload(columnName),
    });
    dispatch({
      type: IGridTableActions.COLUMN_TYPE,
      payload: gridData?.types[columnName],
    });
  };

  const handleCloseSnackbar = () => {
    dispatch({
      type: IGridTableActions.SNACKBAR_DATA,
      payload: {
        open: false,
        isSuccess: false,
        message: '',
      },
    });
  };

  useEffect(() => {
    if (snackbarData.open) {
      setTimeout(() => {
        dispatch({
          type: IGridTableActions.SNACKBAR_DATA,
          payload: {
            open: false,
          },
        });
      }, 5000);
    }
  }, [snackbarData.open]);

  return (
    <>
      {showBreadCrumb && (
        <Breadcrumb breadcrumbsList={getWrangleGridBreadcrumbOptions(workspaceName, location)} />
      )}
      <ToolBarList
        setShowBreadCrumb={(isBreadCrumbOpen: boolean) => {
          dispatch({
            type: IGridTableActions.SHOW_BREADCRUMB,
            payload: isBreadCrumbOpen,
          });
        }}
        showBreadCrumb={showBreadCrumb}
        columnType={columnType}
        submitMenuOption={(option, datatype) => {
          dispatch({
            type: IGridTableActions.SNACKBAR_DATA,
            payload: {
              open: true,
              isSuccess: true,
              message: 'Function Selected',
            },
          });
          return false;
          // TODO: will integrate with add transformation panel later
        }}
        disableToolbarIcon={gridData?.headers?.length > 0 ? false : true}
      />
      <GridTableWrapper data-testid="grid-table-container">
        <TablePanelContainer>
          {!showGridTable && (
            <NoRecordScreen
              title={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.title')}
              subtitle={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.subtitle')}
            />
          )}
          {showGridTable && (
            <GridTableContainer
              headersNamesList={headersNamesList}
              missingDataList={missingDataList}
              rowsDataList={rowsDataList}
            />
          )}
          {showRecipePanel && (
            <RecipeStepPanel>
              <RecipeSteps
                setShowRecipePanel={(isRecipePanelOpen: boolean) => {
                  dispatch({
                    type: IGridTableActions.SHOW_RECIPE_PANEL,
                    payload: isRecipePanelOpen,
                  });
                }}
                onDeleteRecipeSteps={onDeleteRecipeSteps}
              />
            </RecipeStepPanel>
          )}
        </TablePanelContainer>
        {directivePanelIsOpen && (
          <DirectiveInput
            columnNamesList={headersNamesList}
            onDirectiveInputHandler={(directive) => {
              addDirectives(directive);
              dispatch({
                type: IGridTableActions.IS_DIRECTIVE_PANEL_OPEN,
                payload: false,
              });
            }}
            onClose={() =>
              dispatch({
                type: IGridTableActions.IS_DIRECTIVE_PANEL_OPEN,
                payload: false,
              })
            }
            openDirectivePanel={directivePanelIsOpen}
          />
        )}
        <FooterPanel
          recipeStepsCount={directives?.length}
          gridMetaInfo={tableMetaInfo}
          onRecipePanelButtonClick={showRecipePanelHandler}
          setDirectivePanelIsOpen={(boolean_value) => {
            dispatch({
              type: IGridTableActions.IS_DIRECTIVE_PANEL_OPEN,
              payload: boolean_value,
            });
          }}
          directivePanelIsOpen={directivePanelIsOpen}
        />
        {loading && (
          <div className={classes.loadingContainer}>
            <LoadingSVG />
          </div>
        )}
      </GridTableWrapper>
      {snackbarData.open && (
        <Snackbar
          handleClose={handleCloseSnackbar}
          message={snackbarData.message}
          isSuccess={snackbarData.isSuccess}
          open={snackbarData.open}
        />
      )}
    </>
  );
}
