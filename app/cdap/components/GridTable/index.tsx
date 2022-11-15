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
import { useStyles } from 'components/GridTable/styles';
import {
  IExecuteAPIResponse,
  IHeaderNamesList,
  IParams,
  IRecords,
} from 'components/GridTable/types';
import ImportSchema from 'components/ImportSchema';
import NoRecordScreen from 'components/NoRecordScreen';
import LoadingSVG from 'components/shared/LoadingSVG';
import { IValues } from 'components/WrangleHome/Components/OngoingDataExploration/types';
import T from 'i18n-react';
import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router';
import { flatMap } from 'rxjs/operators';
import { objectQuery } from 'services/helpers';
import PositionedSnackbar from 'components/Snackbar';
import { ConnectionsContext } from 'components/Connections/ConnectionsContext';
import { createWorkspace } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import styled from 'styled-components';

const ApplyButton = styled(Button)`
  margin-left: 20px;
  margin-bottom: 15px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  opacity: 0.5;
  background: white;
  position: absolute;
  top: 0px;
  width: 100%;
  z-ndex: 2000;
`;

export default function GridTable() {
  const { wid } = useParams() as IRecords;
  const params = useParams() as IRecords;

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

  const [successUpload, setSuccessUpload] = useState({ open: false, message: '' });
  const [schemaValue, setSchemaValue] = useState(null);
  const [schemaApplied, setSchemaApplied] = useState(false);
  const [failureSchema, setFailureSchemaStatus] = useState<boolean>(false);
  const defaultErrorOnTransformations = {
    open: false,
    message: '',
  };

  const defaultConnectionPayload = {
    path: '',
    connection: '',
    sampleRequest: {
      properties: {
        format: '',
        fileEncoding: '',
        skipHeader: false,
        enableQuotedValues: false,
        schema: null,
        _pluginName: null,
      },
      limit: 1000,
    },
  };

  const defaultProperties = {
    format: 'csv',
    fileEncoding: 'UTF-8',
    enableQuotedValues: false,
    skipHeader: false,
  };

  const [errorOnTransformation, setErrorOnTransformation] = useState(defaultErrorOnTransformations);
  const [connectionPayload, setConnectionPayload] = useState(defaultConnectionPayload);
  const [properties, setProperties] = useState(defaultProperties);

  const [toaster, setToaster] = useState({ lastValue: null });
  const { dataprep } = DataPrepStore.getState();
  const { onWorkspaceCreate } = useContext(ConnectionsContext);

  useEffect(() => {
    setConnectionPayload({
      path: dataprep.insights.path,

      connection: dataprep.insights.name,
      sampleRequest: {
        properties: {
          ...properties,
          schema: schemaValue != null ? JSON.stringify(schemaValue) : null,
          _pluginName: null,
        },
        limit: 1000,
      },
    });
  }, [dataprep, properties, schemaValue]);

  useEffect(() => {
    if (failureSchema && toaster.lastValue !== 'fail') {
      setToaster({ lastValue: 'fail' });
    } else if (successUpload.open && toaster.lastValue !== 'success') {
      setToaster({ lastValue: 'success' });
    }
  }, [failureSchema, successUpload.open]);

  useEffect(() => {
    if (errorOnTransformation.open) {
      setFailureSchemaStatus(true);
      setSuccessUpload({ open: false, message: '' });
    }
    if (successUpload.open) {
      setFailureSchemaStatus(false);
    }
  }, [errorOnTransformation, successUpload.open]);

  useEffect(() => {
    if (successUpload.open) {
      setSchemaApplied(true);
    }
  }, [successUpload]);

  const createWorkspaceInternal = async (entity, parseConfig = {}) => {
    try {
      setLoading(true);
      const wid = await createWorkspace({
        entity,
        connection: dataprep.insights.name,
        properties: connectionPayload.sampleRequest.properties,
      });
      if (onWorkspaceCreate) {
        return onWorkspaceCreate(wid);
      }
      updateDataTranformation(wid);
    } catch (err) {
      setErrorOnTransformation({
        open: true,
        message: T.translate(
          'features.WranglerNewUI.WranglerNewParsingDrawer.transformationErrorMessage1'
        ).toString(),
      });
      setLoading(false);
    }
  };

  const onConfirm = async (parseConfig) => {
    try {
      await createWorkspaceInternal(connectionPayload, parseConfig);
    } catch (e) {
      setLoading(false);
    }
    setSchemaApplied(false);
  };

  const updateDataTranformation = (wid: string) => {
    const payload: IParams = {
      context: params.namespace,
      workspaceId: wid,
    };
    getWorkSpaceData(payload, wid);
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
    <Box data-testid="grid-table-container">
      <BreadCrumb datasetName={wid} />
      <ImportSchema
        setSuccessUpload={setSuccessUpload}
        handleSchemaUpload={(schema) => setSchemaValue(schema)}
        setErrorOnTransformation={setErrorOnTransformation}
      />
      {schemaApplied && (
        <ApplyButton variant="outlined" onClick={() => onConfirm(connectionPayload)}>
          {T.translate('features.WranglerNewUI.ImportSchema.Apply')}
        </ApplyButton>
      )}
      {Array.isArray(gridData?.headers) && gridData?.headers.length === 0 ? (
        <NoRecordScreen
          title={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.title')}
          subtitle={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.subtitle')}
        />
      ) : (
        <Table aria-label="simple table" className="test">
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
      )}
      {errorOnTransformation.open && (
        <PositionedSnackbar
          handleCloseError={() =>
            setErrorOnTransformation({
              open: false,
              message: T.translate(
                'features.WranglerNewUI.WranglerNewParsingDrawer.transformationErrorMessage2'
              ).toString(),
            })
          }
          description={errorOnTransformation.message}
          isSuccess={false}
          snackbarAction="failure"
        />
      )}
      {successUpload.open && (
        <PositionedSnackbar
          handleCloseError={() =>
            setErrorOnTransformation({
              open: false,
              message: '',
            })
          }
          description={successUpload.message}
          isSuccess={true}
          snackbarAction="success"
        />
      )}
      {loading && (
        <LoadingContainer>
          <LoadingSVG />
        </LoadingContainer>
      )}
    </Box>
  );
}
