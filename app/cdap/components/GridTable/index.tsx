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
import FooterPanel from 'components/FooterPanel';
import GridHeaderCell from 'components/GridTable/components/GridHeaderCell';
import GridKPICell from 'components/GridTable/components/GridKPICell';
import GridTextCell from 'components/GridTable/components/GridTextCell';
import { useStyles } from 'components/GridTable/styles';
import {
  IAddTransformationItem,
  IApiPayload,
  IExecuteAPIResponse,
  IGeneralStatistics,
  IGridParams,
  IHeaderNamesList,
  IParams,
  IRecords,
} from 'components/GridTable/types';
import NoRecordScreen from 'components/NoRecordScreen';
import LoadingSVG from 'components/shared/LoadingSVG';
import { IValues } from 'components/WrangleHome/Components/OngoingDataExploration/types';
import ToolBarList from 'components/WranglerGrid/TransformationToolbar';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { flatMap } from 'rxjs/operators';
import { objectQuery } from 'services/helpers';

import styled from 'styled-components';

import { getWrangleGridBreadcrumbOptions } from 'components/GridTable/utils';
import Snackbar from 'components/Snackbar';
import useSnackbar from 'components/Snackbar/useSnackbar';
import { useLocation } from 'react-router';
import { NO_INPUT_REQUIRED_TRANSFORMATION } from './constants';
import { getDirective } from 'components/WranglerGrid/AddTransformationPanel/utils';
import { applyDirectives, getAPIRequestPayload } from './services';
import AddTransformationPanel from 'components/WranglerGrid/AddTransformationPanel';

const transformationOptions = ['undo', 'redo'];

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
  const [tableMetaInfo, setTableMetaInfo] = useState({
    columnCount: 0,
    rowCount: 0,
  });

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
  const [addTransformationFunction, setAddTransformationFunction] = useState<
    IAddTransformationItem
  >({
    option: '',
    supportedDataType: [],
    infoLink: '',
  });
  const [dataQuality, setDataQuality] = useState<Record<string, IGeneralStatistics>>();
  const [columnType, setColumnType] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [snackbarState, setSnackbar] = useSnackbar();

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
        setSnackbar({
          open: true,
          isSuccess: true,
          message: T.translate(
            `features.WranglerNewUI.GridTable.snackbarLabels.datasetSuccess`
          ).toString(),
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
      setDataQuality(gridData?.summary?.statistics);
    }
    const rowData =
      rawData &&
      rawData.values &&
      Array.isArray(rawData.values) &&
      rawData.values.map((eachRow) => {
        const { body, ...rest } = eachRow;
        return rest;
      });

    setTableMetaInfo({
      columnCount: rawData.headers?.length,
      rowCount: rawData.values?.length - 1,
    });
    setRowsDataList(rowData);
  };

  useEffect(() => {
    getGridTableData();
    setShowGridTable(Array.isArray(gridData?.headers) && gridData?.headers.length !== 0);
  }, [gridData]);

  const onMenuOptionSelection = (option: string, supportedDataType: string[], infoLink: string) => {
    if (selectedColumn) {
      if (NO_INPUT_REQUIRED_TRANSFORMATION.includes(option)) {
        const directive = getDirective(option, selectedColumn);
        addDirectives(directive);
      }
    } else {
      setAddTransformationFunction({
        option,
        supportedDataType,
        infoLink,
      });
    }
  };

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
        setSnackbar({
          open: true,
          isSuccess: true,
          message: T.translate(
            `features.WranglerNewUI.GridTable.snackbarLabels.datasetSuccess`
          ).toString(),
        });
        setLoading(false);
        setGridData(response);
        setAddTransformationFunction({
          option: '',
          supportedDataType: [],
        });
        setSelectedColumn('');
        setColumnType('');
      },
      (error) => {
        setLoading(false);
        setSnackbar({
          open: true,
          isSuccess: false,
          message: error.message,
        });
        setAddTransformationFunction({
          option: '',
          supportedDataType: [],
        });
        setSelectedColumn('');
        setColumnType('');
      }
    );
  };

  const handleColumnSelect = (columnName) => {
    setSelectedColumn((prevColumn) => (prevColumn === columnName ? '' : columnName));
    setColumnType(gridData?.types[columnName]);
  };

  useEffect(() => {
    if (snackbarState.open) {
      setTimeout(() => {
        setSnackbar(() => ({
          open: false,
        }));
      }, 5000);
    }
  }, [snackbarState.open]);

  return (
    <>
      {showBreadCrumb && (
        <Breadcrumb breadcrumbsList={getWrangleGridBreadcrumbOptions(workspaceName, location)} />
      )}
      <ToolBarList
        setShowBreadCrumb={setShowBreadCrumb}
        showBreadCrumb={showBreadCrumb}
        columnType={columnType}
        submitMenuOption={(option, datatype, infoLink) => {
          !transformationOptions.includes(option)
            ? onMenuOptionSelection(option, datatype, infoLink)
            : null;
        }}
        disableToolbarIcon={gridData?.headers?.length > 0 ? false : true}
      />
      <GridTableWrapper data-testid="grid-table-container">
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
                    headersNamesList.map((eachHeader) => (
                      <GridHeaderCell
                        label={eachHeader.label}
                        types={eachHeader.type}
                        key={eachHeader.name}
                        columnSelected={selectedColumn}
                        setColumnSelected={handleColumnSelect}
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
          </TableWrapper>
        )}
      </GridTableWrapper>
      <FooterPanel recipeStepsCount={0} gridMetaInfo={tableMetaInfo} />

      {addTransformationFunction.option && (
        <AddTransformationPanel
          transformationName={addTransformationFunction.option}
          transformationLink={addTransformationFunction.infoLink}
          transformationDataType={addTransformationFunction.supportedDataType}
          columnsList={headersNamesList}
          missingItemsList={dataQuality}
          onCancel={() => {
            setAddTransformationFunction({
              option: '',
              supportedDataType: [],
            });
          }}
          applyTransformation={(directive: string) => {
            addDirectives(directive);
          }}
        />
      )}
      {loading && (
        <div className={classes.loadingContainer}>
          <LoadingSVG />
        </div>
      )}
      <Snackbar // TODO: This snackbar is just for the feature demo purpose. Will be removed in the further development.
        handleClose={() =>
          setSnackbar(() => ({
            open: false,
          }))
        }
        open={snackbarState.open}
        message={snackbarState.message}
        isSuccess={snackbarState.isSuccess}
      />
    </>
  );
}
