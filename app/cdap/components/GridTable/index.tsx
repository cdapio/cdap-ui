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
import { default as React, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { objectQuery } from 'services/helpers';
import BreadCrumb from './components/Breadcrumb';
import { GridHeaderCell } from './components/GridHeaderCell';
import { GridKPICell } from './components/GridKPICell';
import { GridTextCell } from './components/GridTextCell';

interface ExecuteAPIResponse {
  headers: [];
  types: {};
  values: [];
  summary: { statistics: {}; validations: {} };
}

const GridTable = () => {
  const { datasetName } = useParams() as any;
  const params = useParams() as any;

  const [headersNamesList, setHeadersNamesList] = React.useState([]);
  const [rowsDataList, setRowsDataList] = React.useState([]);
  const [gridData, setGridData] = useState({} as ExecuteAPIResponse);
  const [missingDataList, setMissingDataList] = useState([]);
  const [invalidCountArray, setInvalidCountArray] = useState([
    {
      label: 'Invalid',
      count: '0',
    },
  ]);

  const getWorkSpaceData = (params, workspaceId) => {
    DataPrepStore.dispatch({
      type: DataPrepActions.setWorkspaceId,
      payload: {
        workspaceId,
        loading: true,
      },
    });
    MyDataPrepApi.getWorkspace(params).subscribe((res) => {
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

      MyDataPrepApi.execute(params, requestBody).subscribe((response) => {
        DataPrepStore.dispatch({
          type: DataPrepActions.setWorkspace,
          payload: {
            data: response.values,
            headers: response.headers,
            types: response.types,
            directives,
            workspaceId,
            workspaceUri,
            workspaceInfo,
            insights,
          },
        });
        setGridData(response);
      });
    });
  };

  useEffect(() => {
    const payload = {
      context: params.namespace,
      workspaceId: params.datasetName,
    };
    getWorkSpaceData(payload, datasetName);
  }, []);

  const createHeadersData = (columnNamesList: [], columnLabelsList, columnTypesList) => {
    if (Array.isArray(columnNamesList)) {
      return columnNamesList.map((eachColumnName) => {
        return {
          name: eachColumnName,
          label: eachColumnName,
          type: [columnTypesList[eachColumnName]],
        };
      });
    }
  };

  const convertNonNullPercent = (key, nonNullValue) => {
    const lengthOfData: number = gridData.values.length;
    let count: number = 0;
    let nonNullCount: number = 0;
    let emptyCount: number = 0;
    let nullValueCount: number = 0;
    if (lengthOfData) {
      nonNullCount = nonNullValue['non-null'] ? (nonNullValue['non-null'] / 100) * lengthOfData : 0;
      nullValueCount = nonNullValue.null ? (nonNullValue.null / 100) * lengthOfData : 0;
      emptyCount = nonNullValue.empty ? (nonNullValue.empty / 100) * lengthOfData : 0;
      count = parseInt(nullValueCount.toFixed(0) + emptyCount.toFixed(0));
    }
    return count;
  };

  const checkFrequentlyOccuredValues = (key) => {
    const valueOfHeaderKey = gridData.values.map((el) => el[key]);
    let mostfrequentItemCount: number = 1;
    let count: number = 0;
    let mostfrequentItemValue: string = '';
    const mostFrequentOccuredData = {
      name: '',
      count: 0,
    };
    for (let i = 0; i < valueOfHeaderKey.length; i++) {
      for (let j = i; j < valueOfHeaderKey.length; j++) {
        if (valueOfHeaderKey[i] == valueOfHeaderKey[j]) {
          count++;
        }
        if (mostfrequentItemCount < count) {
          mostfrequentItemCount = count;
          mostfrequentItemValue = valueOfHeaderKey[i];
        }
      }
      count = 0;
      mostfrequentItemValue =
        mostfrequentItemValue == '' ? valueOfHeaderKey[i] : mostfrequentItemValue;
    }
    mostFrequentOccuredData.name = mostfrequentItemValue;
    mostFrequentOccuredData.count = mostfrequentItemCount;
    return mostFrequentOccuredData;
  };

  const createMissingData = (statistics) => {
    const statisticObjectToArray = Object.entries(statistics);
    const metricArray = [];
    statisticObjectToArray.forEach(([key, value]) => {
      const headerKeyTypeArray = Object.entries(value);
      const typeArrayOfMissingValue = [];
      headerKeyTypeArray.forEach(([vKey, vValue]) => {
        typeArrayOfMissingValue.push({
          label:
            vKey == 'general' && convertNonNullPercent(key, vValue) == 0
              ? checkFrequentlyOccuredValues(key).name
              : vKey == 'general'
              ? 'Missing/Null'
              : vKey == 'types'
              ? ''
              : '',
          count:
            vKey == 'types'
              ? ''
              : convertNonNullPercent(key, vValue) == 0
              ? checkFrequentlyOccuredValues(key).count
              : convertNonNullPercent(key, vValue),
        });
      }),
        metricArray.push({
          name: key,
          values: typeArrayOfMissingValue.concat(invalidCountArray),
        });
    });
    return metricArray;
  };

  const getGridTableData = async () => {
    const rawData: ExecuteAPIResponse = gridData;
    const headersData = createHeadersData(rawData.headers, rawData.headers, rawData.types);
    setHeadersNamesList(headersData);
    if (rawData && rawData.summary && rawData.summary?.statistics) {
      const missingData = createMissingData(gridData.summary?.statistics);
      setMissingDataList(missingData);
    }
    const rowData =
      rawData &&
      rawData.values &&
      Array.isArray(rawData.values) &&
      rawData.values.map((eachRow: {}) => {
        const { ...rest } = eachRow;
        return rest;
      });
    setRowsDataList(rowData);
  };

  useEffect(() => {
    getGridTableData();
  }, [gridData]);

  return (
    <>
      <BreadCrumb datasetName={datasetName} />
      {Array.isArray(headersNamesList) && headersNamesList.length === 0 && (
        <p style={{ textAlign: 'center' }}>No rows to display</p>
      )}
      <Table aria-label="simple table" className="test">
        <TableHead>
          <TableRow>
            {Array.isArray(headersNamesList) &&
              headersNamesList.map((eachHeader) => (
                <GridHeaderCell
                  label={eachHeader.label}
                  types={eachHeader.type}
                  key={eachHeader.name}
                />
              ))}
          </TableRow>
          <TableRow>
            {Array.isArray(missingDataList) &&
              Array.isArray(headersNamesList) &&
              headersNamesList.map((each, index) => {
                return missingDataList.map((item, itemIndex) => {
                  if (item.name == each.name) {
                    return <GridKPICell metricData={item} key={item.name} />;
                  }
                });
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(rowsDataList) &&
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
    </>
  );
};

export default GridTable;
