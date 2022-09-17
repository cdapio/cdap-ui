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
import MyDataPrepApi from 'api/dataprep';
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import DataPrepStore from 'components/DataPrep/store';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import LoadingSVG from 'components/shared/LoadingSVG';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { objectQuery } from 'services/helpers';
import BreadCrumb from './components/Breadcrumb';
import GridHeaderCell from './components/GridHeaderCell';
import GridKPICell from './components/GridKPICell';
import GridTextCell from './components/GridTextCell';
import Box from '@material-ui/core/Box';
import { useStyles } from './styles';
import { flatMap } from 'rxjs/operators';
import { IExecuteAPIResponse, IDataTypeOfColumns, IDataOfStatistics, IParams } from './types';
import ToolBarList from './components/AaToolbar';
import { getDirective } from './directives';
import ParsingDrawer from 'components/ParsingDrawer';
import AddTransformation from 'components/AddTransformation';
import { OPTION_WITH_NO_INPUT, OPTION_WITH_TWO_INPUT } from './constants';
import Snackbar from 'components/SnackbarComponent';

export default function GridTable() {
  const { wid } = useParams() as any;
  const params = useParams() as any;
  const classes = useStyles();

  const [headersNamesList, setHeadersNamesList] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState({} as IExecuteAPIResponse);
  const [missingDataList, setMissingDataList] = useState([]);
  const [dataQuality, setDataQuality] = useState({});
  const [optionSelected, setOptionSelected] = useState(null);
  const [toast, setToast] = useState(false);
  const [invalidCountArray, setInvalidCountArray] = useState([
    {
      label: 'Invalid',
      count: '0',
    },
  ]);
  const [columnSelected, setColumnSelected] = useState('');
  const [directiveFunction, setDirectiveFunction] = useState('');

  const [connectorType, setConnectorType] = useState(null);

  useEffect(() => {
    const { dataprep } = DataPrepStore.getState();
    setConnectorType(dataprep.connectorType);
  }, []);

  const getWorkSpaceData = (params: IParams, workspaceId: string) => {
    let gridParams = {};
    setLoading(true);
    DataPrepStore.dispatch({
      type: DataPrepActions.setWorkspaceId,
      payload: {
        workspaceId,
        loading: true,
      },
    });
    MyDataPrepApi.getWorkspace(params)
      .pipe(
        flatMap((res: any) => {
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
          return MyDataPrepApi.execute(params, requestBody);
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
        setLoading(false);
      });
  };

  const applyDirectiveAPICall = (newDirective) => {
    const { dataprep } = DataPrepStore.getState();
    const { workspaceId, workspaceUri, directives, insights } = dataprep;
    let gridParams = {};
    const updatedDirectives = directives.concat(newDirective);
    const requestBody = directiveRequestBodyCreator(updatedDirectives);

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
            headers: response.headers,
            types: response.types,
            ...gridParams,
          },
        });
        setLoading(false);
        setGridData(response);
        setDirectiveFunction('');
        setColumnSelected('');
      },
      (err) => {
        setToast(true);
        setLoading(false);
      }
    );
  };

  const applyDirective = (option, columnSelected, value_1?, value_2?) => {
    setLoading(true);
    setOptionSelected(option);
    if (OPTION_WITH_NO_INPUT.includes(option)) {
      const newDirective = getDirective(option, columnSelected);
      if (!Boolean(newDirective) || !Boolean(columnSelected)) {
        setDirectiveFunction(option);
        setLoading(false);
        return;
      } else {
        applyDirectiveAPICall(newDirective);
      }
    }
  };

  useEffect(() => {
    // Get DATA from URL paramteres to get data of workspace
    const payload = {
      context: params.namespace,
      workspaceId: params.wid,
    };
    getWorkSpaceData(payload, wid);
  }, [wid]);

  // ------------@createHeadersData Function is used for creating data of Table Header
  const createHeadersData = (columnNamesList: string[], columnTypesList: IDataTypeOfColumns) => {
    if (Array.isArray(columnNamesList)) {
      return columnNamesList.map((eachColumnName: string) => {
        return {
          name: eachColumnName,
          label: eachColumnName,
          type: [columnTypesList[eachColumnName]],
        };
      });
    }
  };

  // ------------@convertNonNullPercent Function is used for calculation of Missing/Null value
  const convertNonNullPercent = (nonNullValue) => {
    const lengthOfData: number = gridData?.values.length;
    let nullValueCount: number = 0;
    if (lengthOfData) {
      nullValueCount = nonNullValue.null
        ? (((nonNullValue.null || 0) + (nonNullValue.empty || 0)) / 100) * lengthOfData
        : 0;
    }
    return nullValueCount;
  };

  // ------------@checkFrequentlyOccuredValues Function is used for checking which value appears maximum time in a column if that column doesn't have missing/null value
  const checkFrequentlyOccuredValues = (key) => {
    const valueOfKey = gridData.values.map((el) => el[key]);
    let mostfrequentItem: number = 1;
    let mostFrequentItemCount: number = 0;
    let mostfrequentItemValue: string = '';
    const mostFrequentDataItem = {
      name: '',
      count: 0,
    };
    if (Array.isArray(valueOfKey) && valueOfKey.length) {
      valueOfKey.map((item, index) => {
        valueOfKey.map((value, valueIndex) => {
          if (item == value) {
            mostFrequentItemCount++;
          }
          if (mostfrequentItem < mostFrequentItemCount) {
            mostfrequentItem = mostFrequentItemCount;
            mostfrequentItemValue = item;
          }
        });
        mostFrequentItemCount = 0;
        mostfrequentItemValue = mostfrequentItemValue == '' ? item : mostfrequentItemValue;
      });
    }
    mostFrequentDataItem.name = mostfrequentItemValue;
    mostFrequentDataItem.count = mostFrequentItemCount;
    return mostFrequentDataItem;
  };

  // ------------@createMissingData Function is used for preparing data for second row of Table which shows Missing/Null Value
  const createMissingData = (statistics: IDataOfStatistics) => {
    const statisticObjectToArray = Object.entries(statistics);
    const metricArray = [];
    statisticObjectToArray.forEach(([key, value]) => {
      const headerKeyTypeArray = Object.entries(value);
      const arrayForMissingValue = [];
      headerKeyTypeArray.forEach(([vKey, vValue]) => {
        if (vKey !== 'types') {
          arrayForMissingValue.push({
            label:
              convertNonNullPercent(vValue) == 0
                ? checkFrequentlyOccuredValues(key).name
                : 'Missing/Null',
            count:
              convertNonNullPercent(vValue) == 0
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
  };

  useEffect(() => {
    getGridTableData();
  }, [gridData]);

  const handleColumnSelect = (columnName) =>
    setColumnSelected((prevColumn) => (prevColumn === columnName ? '' : columnName));

  // Redux store
  const { dataprep } = DataPrepStore.getState();
  const { data, headers, types } = dataprep;
  console.log(columnSelected, directiveFunction);

  return (
    <Box className={classes.wrapper}>
      <BreadCrumb datasetName={wid} />
      <ToolBarList submitMenuOption={(option) => applyDirective(option, columnSelected)} />
      <ParsingDrawer />
      {directiveFunction && (
        <AddTransformation
          functionName={directiveFunction}
          setLoading={setLoading}
          columnData={headersNamesList}
          missingDataList={dataQuality}
          applyTransformation={(selectedColumn, value) => {
            setColumnSelected(selectedColumn);
            applyDirective(optionSelected, selectedColumn, value);
          }}
          callBack={(response) => {
            setGridData(response);
            setColumnSelected('');
            setDirectiveFunction('');
          }}
        />
      )}
      <Table aria-label="simple table" className="test">
        <TableHead>
          <TableRow>
            {headers.map((eachHeader) => (
              <GridHeaderCell
                label={eachHeader}
                type={types[eachHeader]}
                key={eachHeader}
                columnSelected={columnSelected}
                setColumnSelected={handleColumnSelect}
              />
            ))}
          </TableRow>
          <TableRow>
            {Array.isArray(missingDataList) &&
              Array.isArray(headers) &&
              headers.map((each, index) => {
                return missingDataList.map((item, itemIndex) => {
                  if (item.name === each) {
                    return <GridKPICell metricData={item} key={item.name} />;
                  }
                });
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((eachRow, rowIndex) => {
            return (
              <TableRow key={`row-${rowIndex}`}>
                {headers.map((eachKey, eachIndex) => {
                  return (
                    <GridTextCell
                      cellValue={eachRow[eachKey] || '--'}
                      key={`${eachKey}-${eachIndex}`}
                    />
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {toast && <Snackbar handleCloseError={() => setToast(false)} />}
      {loading && (
        <div className={classes.loadingContainer}>
          <LoadingSVG />
        </div>
      )}
    </Box>
  );
}
