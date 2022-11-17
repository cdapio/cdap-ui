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
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import BreadCrumb from 'components/GridTable/components/Breadcrumb';
import GridHeaderCell from 'components/GridTable/components/GridHeaderCell';
import GridKPICell from 'components/GridTable/components/GridKPICell';
import GridTextCell from 'components/GridTable/components/GridTextCell';
import DirectiveInput from 'components/DirectiveInput';
import { applyDirectives, getAPIRequestPayload } from 'components/GridTable/services';
import { useStyles } from 'components/GridTable/styles';
import NoRecordScreen from 'components/NoRecordScreen';
import LoadingSVG from 'components/shared/LoadingSVG';
import { IValues } from 'components/WrangleHome/Components/OngoingDataExploration/types';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
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
import FooterPanel from 'components/FooterPanel';

const RecipeStepsButton = styled(Button)`
  margin-left: 30px;
  margin-bottom: 10px;
`;

export default function GridTable() {
  const { wid } = useParams() as IRecords;
  const params = useParams() as IRecords;
  const classes = useStyles();
  const { dataprep } = DataPrepStore.getState();
  const [isFirstWrangle, setIsFirstWrangle] = useState<boolean>(false);
  const [connectorType, setConnectorType] = useState<string | null>(null);
  const [openDirectivePanel, setDirectivePanel] = useState<boolean>(true);
  const [toaster, setToaster] = useState({
    open: false,
    message: '',
    isSuccess: false,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [headersNamesList, setHeadersNamesList] = useState<IHeaderNamesList[]>([]);
  const [rowsDataList, setRowsDataList] = useState<IRowData[]>([]);
  const [showRecipePanel, setShowRecipePanel] = useState<boolean>(false);
  const [gridData, setGridData] = useState({} as IExecuteAPIResponse);
  const [missingDataList, setMissingDataList] = useState<IMissingListData[]>([]);
  const [invalidCountArray, setInvalidCountArray] = useState<Array<Record<string, string>>>([
    {
      label: 'Invalid',
      count: '0',
    },
  ]);
  const [tableMetaInfo, setTableMetaInfo] = useState({
    columnCount: 0,
    rowCount: 0,
  });

  useEffect(() => {
    setIsFirstWrangle(true);
    setConnectorType(dataprep.connectorType);
  }, []);

  const { directives } = dataprep;
  const addDirectives = (directive: string) => {
    setLoading(true);
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
        setLoading(false);
        setGridData(response);
        setToaster({
          open: true,
          message: `Transformation successfully added`,
          isSuccess: true,
        });
      },
      (err) => {
        setLoading(false);
        setToaster({
          open: true,
          message: `Failed to add transformation`,
          isSuccess: false,
        });
      }
    );
  };

  const getWorkSpaceData = (payload: IParams, workspaceId: string) => {
    let gridParams = {};
    setLoading(true);
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
        setLoading(false);
        setGridData(response);
      });
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
    setHeadersNamesList(headersData);
    if (rawData && rawData.summary && rawData.summary.statistics) {
      const missingData = createMissingData(gridData?.summary.statistics);
      setMissingDataList(missingData);
    }
    const rowData: IRowData[] =
      rawData &&
      rawData.values &&
      Array.isArray(rawData?.values) &&
      (rawData?.values.map((eachRow: IRecords) => {
        const { ...rest } = eachRow;
        return rest;
      }) as IRowData[]);
    setTableMetaInfo({
      columnCount: rawData?.headers?.length,
      rowCount: rawData?.values?.length - 1,
    });
    setRowsDataList(rowData);
  };

  const showRecipePanelHandler = () => {
    setShowRecipePanel((prev) => !prev);
  };

  const applyDirectiveAPICall = (newDirective, action, removed_arr, from) => {
    setLoading(true);
    const { dataprep } = DataPrepStore.getState();
    const { workspaceId, workspaceUri, directives, insights } = dataprep;
    let gridParams = {};
    const updatedDirectives = action === 'add' ? directives.concat(newDirective) : newDirective;
    const requestBody = directiveRequestBodyCreator(updatedDirectives);
    const arr = JSON.parse(JSON.stringify(newDirective));
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
        setLoading(false);
        setGridData(response);
        setShowRecipePanel(false);
        setToaster({
          open: true,
          message:
            action === 'add'
              ? `Transformation ${arr} successfully added`
              : from === 'undo' || arr?.length === 0
              ? 'Transformation successfully deleted'
              : `${removed_arr?.length} transformation successfully deleted from ${
                  arr[arr.length - 1]
                }`,
          isSuccess: true,
        });
        setTimeout(() => {
          setToaster({
            open: false,
            message: ``,
            isSuccess: false,
          });
        }, 5000);
      },
      (err) => {
        setToaster({
          open: true,
          message: `Failed to transform ${newDirective}`,
          isSuccess: false,
        });
        setLoading(false);
        setShowRecipePanel(false);
      }
    );
  };

  const deleteRecipes = (new_arr, remaining_arr) => {
    applyDirectiveAPICall(new_arr, 'delete', remaining_arr, 'panel');
    DataPrepStore.dispatch({
      type: DataPrepActions.setUndoDirective,
      payload: {
        undoDirectives: [],
      },
    });
  };

  useEffect(() => {
    getGridTableData();
  }, [gridData]);

  const handleCloseSnackbar = () => {
    setToaster({
      open: false,
      message: '',
      isSuccess: false,
    });
  };

  return (
    <Box data-testid="grid-table-container">
      <BreadCrumb datasetName={wid} />
      {showRecipePanel && (
        <RecipeSteps
          setShowRecipePanel={setShowRecipePanel}
          showRecipePanel={showRecipePanel}
          deleteRecipes={deleteRecipes}
        />
      )}
      {Array.isArray(gridData?.headers) && gridData?.headers.length === 0 ? (
        <NoRecordScreen
          title={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.title')}
          subtitle={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.subtitle')}
        />
      ) : (
        <Box className={classes.gridTableWrapper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {headersNamesList?.length &&
                  headersNamesList.map((eachHeader) => (
                    <GridHeaderCell
                      label={eachHeader.label}
                      types={eachHeader.type}
                      key={eachHeader.name}
                    />
                  ))}
              </TableRow>
              <TableRow>
                {missingDataList?.length &&
                  headersNamesList.length &&
                  headersNamesList.map((each, index) => {
                    return missingDataList.map((item, itemIndex) => {
                      if (item.name === each.name) {
                        return <GridKPICell metricData={item} key={item.name} />;
                      }
                    });
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsDataList?.length &&
                rowsDataList.map((eachRow, rowIndex) => {
                  return (
                    <TableRow key={`row-${rowIndex}`}>
                      {headersNamesList.map((eachKey, eachIndex) => {
                        return (
                          <GridTextCell
                            cellValue={eachRow[eachKey.name] || '--'}
                            key={`${eachKey.name}-${eachIndex}`}
                          />
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      )}
      {openDirectivePanel && (
        <DirectiveInput
          columnNamesList={headersNamesList}
          onDirectiveInputHandler={(directive) => {
            addDirectives(directive);
          }}
          onClose={() => setDirectivePanel(false)}
          openDirectivePanel={openDirectivePanel}
        />
      )}
      {toaster.open && (
        <Snackbar
          handleCloseError={handleCloseSnackbar}
          description={toaster.message}
          isSuccess={toaster.isSuccess}
        />
      )}
      {loading && (
        <div className={classes.loadingContainer}>
          <LoadingSVG />
        </div>
      )}
      <FooterPanel
        recipeStepsCount={directives?.length}
        gridMetaInfo={tableMetaInfo}
        handleShowRecipePanelHandler={showRecipePanelHandler}
      />
    </Box>
  );
}
