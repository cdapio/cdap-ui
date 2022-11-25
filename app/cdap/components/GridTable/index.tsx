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
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import BreadCrumb from 'components/GridTable/components/Breadcrumb';
import ColumnViewPanel from 'components/ColumnViewPanel';
import GridHeaderCell from 'components/GridTable/components/GridHeaderCell';
import GridKPICell from 'components/GridTable/components/GridKPICell';
import GridTextCell from 'components/GridTable/components/GridTextCell';
import { useStyles } from 'components/GridTable/styles';
import {
  IExecuteAPIResponse,
  IHeaderNamesList,
  IParams,
  IRecords,
  IType,
} from 'components/GridTable/types';
import NoRecordScreen from 'components/NoRecordScreen';
import LoadingSVG from 'components/shared/LoadingSVG';
import PositionedSnackbar from 'components/SnackbarComponent';
import { IValues } from 'components/WrangleHome/Components/OngoingDataExploration/types';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { flatMap } from 'rxjs/operators';
import { objectQuery } from 'services/helpers';
import FooterPanel from 'components/FooterPanel';
import { IDataQuality } from 'components/ColumnViewPanel/components/SelectColumnsList/types';
import { IFooterMetaInfo } from 'components/GridTable/types';
import {
  calculateDistinctValues,
  calculateDistributionGraphData,
  calculateEmptyValueCount,
  characterCount,
  checkAlphaNumericAndSpaces,
  convertNonNullPercentForColumnSelected,
  getColumnNames,
} from 'components/GridTable/utils';
import ColumnInsightsInlayPanel from 'components/ColumnInsightsPanel';

export default function GridTable() {
  const { wid } = useParams() as IRecords;
  const params = useParams() as IRecords;
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [headersNamesList, setHeadersNamesList] = useState<IHeaderNamesList[]>([]);
  const [rowsDataList, setRowsDataList] = useState([]);
  const [gridData, setGridData] = useState({} as IExecuteAPIResponse);
  const [missingDataList, setMissingDataList] = useState([]);
  const [invalidCountArray, setInvalidCountArray] = useState([
    {
      label: 'Invalid',
      count: '0',
    },
  ]);
  const [openColumnView, setOpenColumnView] = useState<boolean>(false);
  const [dataQuality, setDataQuality] = useState<IDataQuality>({});
  const [tableMetaInfo, setTableMetaInfo] = useState<IFooterMetaInfo>({
    columnCount: 0,
    rowCount: 0,
  });
  const { dataprep } = DataPrepStore.getState();
  const [columnType, setColumnType] = useState<string>('');
  const [toaster, setToaster] = useState({
    open: false,
    message: '',
    isSuccess: false,
  });
  const [columnSelected, setColumnSelected] = useState<string>('');
  const [insightDrawer, setInsightDrawer] = useState({
    open: false,
    columnName: '',
    distinctValues: 0,
    characterCount: {
      min: 0,
      max: 0,
    },
    dataQuality: {
      nullValueCount: 0,
      nullValuePercentage: 0,
      emptyValueCount: 0,
      emptyValuePercentage: 0,
    },
    dataQualityBar: {},
    dataTypeString: '',
    dataDistributionGraphData: [],
    columnNamesList: [],
  });
  const { types } = dataprep;

  useEffect(() => {
    if (insightDrawer.open) {
      onColumnSelection(columnSelected);
    }
    setLoading(false);
  }, [rowsDataList]);

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

  const handleCoumnDeSelect = () => {
    setInsightDrawer({
      open: false,
      columnName: '',
      distinctValues: 0,
      characterCount: { min: 0, max: 0 },
      dataQuality: {
        nullValueCount: 0,
        nullValuePercentage: 0,
        emptyValueCount: 0,
        emptyValuePercentage: 0,
      },
      dataQualityBar: {},
      dataTypeString: '',
      dataDistributionGraphData: [],
      columnNamesList: [],
    });
    setColumnSelected('');
  };

  const handleColumnSelect = (columnName: string) => {
    setColumnSelected((prevColumn) => (prevColumn === columnName ? '' : columnName));
    setColumnType(types[columnName]);
  };

  const renameColumnNameHandler = (oldColumnName: string, newColumnName: string) => {
    const directive = `rename ${oldColumnName} ${newColumnName}`;
    setColumnSelected(newColumnName);
    applyDirectiveAPICall(directive, 'add', [], 'insightsPanel');
  };

  const applyDirectiveAPICall = (newDirective: string, action, removed_arr, from) => {
    setLoading(true);
    const { dataprep } = DataPrepStore.getState();
    const { workspaceId, workspaceUri, directives, insights } = dataprep;
    let gridParams = {};
    const updatedDirectives = directives.concat(newDirective);
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
        setGridData(response);
        if (!insightDrawer.open) {
          setColumnSelected('');
        } else {
          setLoading(true);
        }
        setLoading(false);
      },
      (err) => {
        setToaster({
          open: true,
          message: `Failed to transform ${newDirective}`,
          isSuccess: false,
        });
        setLoading(false);
      }
    );
    setToaster({
      open: false,
      message: '',
      isSuccess: false,
    });
  };

  const dataTypeHandler = (dataType: string) => {
    const newDirective = `set-type ${columnSelected} ${dataType}`;
    applyDirectiveAPICall(newDirective, 'add', [], 'insightsPanel');
  };

  const onColumnSelection = (columnName: string) => {
    const getDistinctValue = calculateDistinctValues(rowsDataList, columnName);
    const getCharacterCountOfCell = characterCount(rowsDataList, columnName);
    const getNullValueCount =
      convertNonNullPercentForColumnSelected(
        gridData?.values,
        (gridData?.summary?.statistics?.columnName as Record<string, IType>)?.general
      ) || 0;
    const getDataTypeString = checkAlphaNumericAndSpaces(rowsDataList, columnName);
    setInsightDrawer({
      open: true,
      columnName,
      distinctValues: getDistinctValue,
      characterCount: getCharacterCountOfCell,
      dataQuality: {
        nullValueCount: Number(getNullValueCount),
        nullValuePercentage: Number(
          ((Number(Number(getNullValueCount).toFixed(0)) / rowsDataList?.length) * 100).toFixed(0)
        ),
        emptyValueCount: calculateEmptyValueCount(rowsDataList, columnName),
        emptyValuePercentage: Number(
          (
            (Number(Number(calculateEmptyValueCount(rowsDataList, columnName)).toFixed(0)) /
              rowsDataList?.length) *
            100
          ).toFixed(0)
        ),
      },
      dataQualityBar: gridData?.summary?.statistics[columnName],
      dataTypeString: getDataTypeString,
      dataDistributionGraphData: calculateDistributionGraphData(rowsDataList, columnName),
      columnNamesList: getColumnNames(rowsDataList),
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
      setDataQuality(gridData.summary.statistics);
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
      rowCount: rawData?.values?.length,
      columnCount: rawData?.headers?.length,
    });
    setRowsDataList(rowData);
  };

  useEffect(() => {
    getGridTableData();
  }, [gridData]);

  const handleColumnViewClose = () => {
    setOpenColumnView(false);
    if (insightDrawer.open) {
      setInsightDrawer({
        open: false,
        columnName: '',
        distinctValues: 0,
        characterCount: { min: 0, max: 0 },
        dataQuality: {
          nullValueCount: 0,
          nullValuePercentage: 0,
          emptyValueCount: 0,
          emptyValuePercentage: 0,
        },
        dataQualityBar: {},
        dataTypeString: '',
        dataDistributionGraphData: [],
        columnNamesList: [],
      });
      setColumnSelected('');
    }
  };

  return (
    <Box data-testid="grid-table-container">
      <BreadCrumb datasetName={wid} />
      <Box className={classes.columnViewContainer}>
        {openColumnView && (
          <Box className={classes.columnViewDrawer}>
            <ColumnViewPanel
              columnData={headersNamesList}
              dataQuality={dataQuality}
              closeClickHandler={() => handleColumnViewClose()}
              setColumnSelected={handleColumnSelect}
              onColumnSelection={(column) => onColumnSelection(column)}
              selectedColumn={columnSelected}
              handleCoumnDeSelect={handleCoumnDeSelect}
            />
          </Box>
        )}
        {insightDrawer.open && (
          <Box className={classes.columnInsightsDrawer}>
            <ColumnInsightsInlayPanel
              columnType={columnType}
              columnData={insightDrawer}
              renameColumnNameHandler={renameColumnNameHandler}
              dataTypeHandler={dataTypeHandler}
              onClose={() => {
                setInsightDrawer({
                  open: false,
                  columnName: '',
                  distinctValues: 0,
                  characterCount: { min: 0, max: 0 },
                  dataQuality: {
                    nullValueCount: 0,
                    nullValuePercentage: 0,
                    emptyValueCount: 0,
                    emptyValuePercentage: 0,
                  },
                  dataQualityBar: {},
                  dataTypeString: '',
                  dataDistributionGraphData: [],
                  columnNamesList: [],
                });
                setColumnSelected('');
              }}
            />
          </Box>
        )}
        {Array.isArray(gridData?.headers) && gridData?.headers.length > 0 ? (
          <Box className={classes.gridTableWrapper}>
            <Table aria-label="simple table" className="test" data-testid="grid-table">
              <TableHead>
                <TableRow>
                  {headersNamesList?.length &&
                    headersNamesList.map((eachHeader, eachHeaderIndex) => (
                      <GridHeaderCell
                        label={eachHeader.label}
                        types={eachHeader.type as string[]}
                        key={eachHeader.name}
                        columnSelected={columnSelected}
                        setColumnSelected={handleColumnSelect}
                        onColumnSelection={(column) => onColumnSelection(column)}
                        eachHeaderIndex={eachHeaderIndex}
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
        ) : (
          <NoRecordScreen
            title={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.title')}
            subtitle={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.subtitle')}
          />
        )}
      </Box>
      <FooterPanel
        recipeStepsCount={0}
        gridMetaInfo={tableMetaInfo}
        setOpenColumnViewHandler={() => setOpenColumnView((prev) => !prev)}
      />
      {toaster.open && (
        <PositionedSnackbar messageToDisplay={toaster.message} isSuccess={toaster.isSuccess} />
      )}
      {loading && (
        <div className={classes.loadingContainer}>
          <LoadingSVG />
        </div>
      )}
    </Box>
  );
}
