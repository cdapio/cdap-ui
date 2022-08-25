import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { default as React, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import BreadCumb from './components/Breadcrumb';
import { GridHeaderCell } from './components/GridHeaderCell';
import { GridKPICell } from './components/GridKPICell';
import { GridTextCell } from './components/GridTextCell';
import mockJSON from './mock/apiMock';
import metricsJSON from './mock/metrics';
import MyDataPrepApi from 'api/dataprep';
import DataPrepStore from 'components/DataPrep/store';
import { objectQuery } from 'services/helpers';
import DataPrepActions from 'components/DataPrep/store/DataPrepActions';
import { directiveRequestBodyCreator } from 'components/DataPrep/helper';
import { valueFromAST } from 'graphql';

const GridTable = () => {
  const { datasetName } = useParams() as any;
  const params = useParams() as any;

  const [headersNamesList, setHeadersNamesList] = React.useState([]);
  const [rowsDataList, setRowsDataList] = React.useState([]);
  const [gridData, setGridData] = useState<any>({});
  const [missingDataList, setMissingDataList] = useState([]);

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
        console.log('response', response);
      });
    });
  };

  useEffect(() => {
    // -----------------Get DATA from URL paramteres to get data of workspace
    const payload = {
      context: params.namespace,
      workspaceId: params.datasetName,
    };
    getWorkSpaceData(payload, datasetName);
  }, []);

  const createHeadersData = (columnNamesList: any, columnLabelsList, columnTypesList) => {
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
    const lengthOfData = gridData.values.length;
    let count = 0;
    let nonNull: any = 0;
    let empty: any = 0;
    let nullValue: any = 0;
    if (lengthOfData) {
      nonNull = nonNullValue['non-null'] ? (nonNullValue['non-null'] / 100) * lengthOfData : 0;
      nullValue = nonNullValue.null ? (nonNullValue.null / 100) * lengthOfData : 0;
      empty = nonNullValue.empty ? (nonNullValue.empty / 100) * lengthOfData : 0;
      count = parseInt(nullValue + empty);
    }
    return count;
  };

  const checkFrequentlyOccuredValues = (key) => {
    const valueOfKey = gridData.values.map((el) => el[key]);
    let mostfrequentItem = 1;
    let count = 0;
    let item = '';
    const data = {
      name: '',
      count: 0,
    };
    for (let i = 0; i < valueOfKey.length; i++) {
      for (let j = i; j < valueOfKey.length; j++) {
        if (valueOfKey[i] == valueOfKey[j]) {
          count++;
        }
        if (mostfrequentItem < count) {
          mostfrequentItem = count;
          item = valueOfKey[i];
        }
      }
      count = 0;
      item = item == '' ? valueOfKey[i] : item;
    }
    data.name = item;
    data.count = mostfrequentItem;
    return data;
  };

  const createMissingData = (statistics) => {
    const objectArray = Object.entries(statistics);
    const metricArray = [];
    objectArray.forEach(([key, value]) => {
      const valueToArray = Object.entries(value);
      const tempArray = [];
      valueToArray.forEach(([vKey, vValue]) => {
        tempArray.push({
          label:
            vKey == 'general' && convertNonNullPercent(key, vValue) == 0
              ? checkFrequentlyOccuredValues(key).name
              : vKey == 'general'
              ? 'Missing/Null'
              : vKey,
          count:
            convertNonNullPercent(key, vValue) == 0
              ? checkFrequentlyOccuredValues(key).count
              : convertNonNullPercent(key, vValue),
        });
      }),
        metricArray.push({
          name: key,
          values: tempArray,
        });
    });
    return metricArray;
  };

  const getGridTableData = async () => {
    const rawData: any = gridData;
    const headersData = createHeadersData(rawData.headers, rawData.headers, rawData.types);
    setHeadersNamesList(headersData);
    if (rawData && rawData.summary && rawData.summary.statistics) {
      const missingData = createMissingData(gridData.summary.statistics);
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

    setRowsDataList(rowData);
  };

  useEffect(() => {
    getGridTableData();
  }, [gridData]);

  return (
    <>
      <BreadCumb datasetName={datasetName} />
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
                        cellValue={eachRow[eachKey.name]}
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
