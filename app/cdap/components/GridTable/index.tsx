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

import { Table, TableBody, TableHead, TableRow } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import MyDataPrepApi from 'api/dataprep';
import Breadcrumb from 'components/Breadcrumb';
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import DirectiveInput from 'components/DirectiveInput';
import FooterPanel from 'components/FooterPanel';
import GridHeaderCell from 'components/GridTable/components/GridHeaderCell';
import GridKPICell from 'components/GridTable/components/GridKPICell';
import GridTextCell from 'components/GridTable/components/GridTextCell';
import { initialGridTableState, reducer } from 'components/GridTable/reducer';
import { applyDirectives, getAPIRequestPayload } from 'components/GridTable/services';
import { useStyles } from 'components/GridTable/styles';
import {
  IApiPayload,
  IExecuteAPIResponse,
  IGridParams,
  IHeaderNamesList,
  IParams,
  IRecords,
  IGeneralStatistics
} from 'components/GridTable/types';
import NoRecordScreen from 'components/NoRecordScreen';
import LoadingSVG from 'components/shared/LoadingSVG';
import Snackbar from 'components/Snackbar';
import { IValues } from 'components/WrangleHome/Components/OngoingDataExploration/types';
import ToolBarList from 'components/WranglerGrid/TransformationToolbar';
import T from 'i18n-react';
import React, { useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router';
import { flatMap } from 'rxjs/operators';
import { objectQuery } from 'services/helpers';
import styled from 'styled-components';
import { getWrangleGridBreadcrumbOptions } from 'components/GridTable/utils';
import { useLocation } from 'react-router';
import useSnackbar from 'components/Snackbar/useSnackbar';

export const TableWrapper = styled(Box)`
  width: 100%;
`;

const GridTableWrapper = styled(Box)`
  max-width: 100%;
  overflow-x: auto;
  max-height: 76vh;
`;

export default function GridTable() {
  const { wid } = useParams() as IRecords;
  const params = useParams() as IRecords;
  const classes = useStyles();
  const location = useLocation();

  const [workspaceName, setWorkspaceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [headersNamesList, setHeadersNamesList] = useState<IHeaderNamesList[]>([]);
  const [rowsDataList, setRowsDataList] = useState([]);
  const [gridData, setGridData] = useState({} as IExecuteAPIResponse);
  const [missingDataList, setMissingDataList] = useState([]);
  const [showBreadCrumb, setShowBreadCrumb] = useState<boolean>(true);
  const [showGridTable, setShowGridTable] = useState(false);
  const [invalidCountArray, setInvalidCountArray] = useState([
    {
      label: 'Invalid',
      count: '0',
    },
  ]);

  const { dataprep } = DataPrepStore.getState();
  const [gridTableState, dispatch] = useReducer(reducer, initialGridTableState);
  enum IGridTableActions {
    IS_FIRST_WRANGLE,
    CONNECTOR_TYPE,
    IS_DIRECTIVE_PANEL_OPEN,
    IS_SNACKBAR_OPEN,
    SNACKBAR_DATA,
    TABLE_META_INFO,
  }
  const {
    isFirstWrangle,
    connectorType,
    directivePanelIsOpen,
    snackbarIsOpen,
    snackbarData,
    tableMetaInfo,
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
  const [columnType, setColumnType] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

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
          setWorkspaceName(res?.workspaceName);
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
        dispatch({
          type: IGridTableActions.SNACKBAR_DATA,
          payload: {
            message: 'Data loaded successfully',
            isSuccess: true,
            open: true,
          },
        });
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
  const createMissingData = (statistics: Record<string, IGeneralStatistics>) => {
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
    const rowData =
      rawData &&
      rawData.values &&
      Array.isArray(rawData.values) &&
      rawData.values.map((eachRow) => {
        const { body, ...rest } = eachRow;
        return rest;
      });
    dispatch({
      type: IGridTableActions.TABLE_META_INFO,
      payload: {
        columnCount: rawData.headers?.length,
        rowCount: rawData.values?.length - 1,
      },
    });
    setRowsDataList(rowData);
  };

  const isParsingPanel =
    dataprep?.insights?.name &&
    isFirstWrangle &&
    connectorType === 'File' &&
    Array.isArray(gridData?.headers) &&
    gridData?.headers.length !== 0;

  useEffect(() => {
    getGridTableData();
    setShowGridTable(Array.isArray(gridData?.headers) && gridData?.headers.length !== 0);
  }, [gridData]);

  const addDirectives = (directive: string) => {
    setLoading(true);
    if (directive) {
      const apiPayload: IApiPayload = getAPIRequestPayload(params, directive, '');
      addDirectiveAPICall(apiPayload);
    }
  };

  useEffect(() => {
    if (snackbarData.open) {
      setTimeout(() => {
        dispatch({
          type: IGridTableActions.SNACKBAR_DATA,
          payload: {
            open: false,
            isSuccess: false,
            message: '',
          },
        });
      }, 5000);
    }
  }, [snackbarData.open]);

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
          type: IGridTableActions.SNACKBAR_DATA,
          payload: {
            message: 'Directive applied successfully',
            isSuccess: true,
            open: true,
          },
        });
        setLoading(false);
        setGridData(response);
        dispatch({
          type: IGridTableActions.IS_DIRECTIVE_PANEL_OPEN,
          payload: false,
        });
      },
      (err) => {
        setLoading(false);
        dispatch({
          type: IGridTableActions.SNACKBAR_DATA,
          payload: {
            message: 'Directive not applied',
            isSuccess: false,
            open: true,
          },
        });
        dispatch({
          type: IGridTableActions.IS_DIRECTIVE_PANEL_OPEN,
          payload: false,
        });
      }
    );
  };

  const handleColumnSelect = (columnName) => {
    setSelectedColumn((prevColumn) => (prevColumn === columnName ? '' : columnName));
    setColumnType(gridData?.types[columnName]);
  };

  return (
    <>
      {showBreadCrumb && (
        <Breadcrumb breadcrumbsList={getWrangleGridBreadcrumbOptions(workspaceName, location)} />
      )}
      <ToolBarList
        setShowBreadCrumb={setShowBreadCrumb}
        showBreadCrumb={showBreadCrumb}
        columnType={columnType}
        submitMenuOption={(option, datatype) => {
          dispatch({
            type: IGridTableActions.SNACKBAR_DATA,
            payload: {
              message: 'Function selected',
              isSuccess: true,
              open: true,
            },
          });
          return false;
          // TODO: will integrate with add transformation panel later
        }}
        disableToolbarIcon={gridData?.headers?.length > 0 ? false : true}
      />
      <GridTableWrapper data-testid="grid-table-container">
        <TableWrapper>
          {!showGridTable && (
            <NoRecordScreen
              title={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.title')}
              subtitle={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.subtitle')}
            />
          )}
          {showGridTable && (
            <TableWrapper>
              <Table aria-label="simple table" className="test">
                <TableHead>
                  <TableRow>
                    {headersNamesList?.length &&
                      headersNamesList.map((eachHeader, index) => (
                        <GridHeaderCell
                          label={eachHeader.label}
                          types={eachHeader.type}
                          key={eachHeader.name}
                          columnSelected={selectedColumn}
                          setColumnSelected={handleColumnSelect}
                          index={index}
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
                                dataTestId={`table-cell-${rowIndex}${eachIndex}`}
                              />
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableWrapper>
          )}
        </TableWrapper>
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
          recipeStepsCount={0}
          gridMetaInfo={tableMetaInfo}
          setDirectivePanelIsOpen={(boolean_value) =>
            dispatch({
              type: IGridTableActions.IS_DIRECTIVE_PANEL_OPEN,
              payload: boolean_value,
            })
          }
          directivePanelIsOpen={directivePanelIsOpen}
        />
        {loading && (
          <div className={classes.loadingContainer}>
            <LoadingSVG />
          </div>
        )}
      </GridTableWrapper>
      <Snackbar
        handleClose={() =>
          dispatch({
            type: IGridTableActions.SNACKBAR_DATA,
            payload: {
              open: false,
              isSuccess: false,
              message: '',
            },
          })
        }
        open={snackbarData.open}
        message={snackbarData.message}
        isSuccess={snackbarData.isSuccess}
      />
    </>
  );
}
