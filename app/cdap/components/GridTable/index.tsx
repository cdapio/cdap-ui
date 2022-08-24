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
import metricsJSON from './mock/metrics';

const GridTable = () => {
  const { datasetName } = useParams() as any;
  const params = useParams() as any;
  const [headersNamesList, setHeadersNamesList] = React.useState([]);
  const [rowsDataList, setRowsDataList] = React.useState([]);
  const [gridData, setGridData] = useState({});

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
    /**
     * Get DATA from URL paramteres to get data of workspace
     */
    const payload = {
      context: params.namespace,
      workspaceId: params.datasetName,
    };
    getWorkSpaceData(payload, datasetName);
  }, []);

  const createHeadersData = (columnNamesList, columnLabelsList, columnTypesList) => {
    return columnNamesList.map((eachColumnName) => {
      return {
        name: eachColumnName,
        label: eachColumnName,
        type: [columnTypesList[eachColumnName]],
      };
    });
  };

  const getGridTableData = async () => {
    const rawData: any = gridData;
    const headersData = createHeadersData(rawData.headers, rawData.headers, rawData.types);
    setHeadersNamesList(headersData);

    const rowData = rawData.values.map((eachRow) => {
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
      <BreadCrumb datasetName={datasetName} />

      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {headersNamesList.map((eachHeader) => (
              <GridHeaderCell
                label={eachHeader.label}
                types={eachHeader.type}
                key={eachHeader.name}
              />
            ))}
          </TableRow>
          <TableRow>
            {metricsJSON.map((each, index) => {
              if (index <= headersNamesList.length - 1) {
                return <GridKPICell metricData={each} key={each.name} />;
              }
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsDataList.map((eachRow, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Object.keys(eachRow).map((eachKey, keyIndex) => {
                const keyWithRespectToHeader =
                  headersNamesList[keyIndex] && headersNamesList[keyIndex].name
                    ? headersNamesList[keyIndex].name
                    : '';
                return (
                  <GridTextCell
                    cellValue={
                      eachRow[keyWithRespectToHeader] ? eachRow[keyWithRespectToHeader] : ''
                    }
                    key={`${eachKey}-${keyIndex}`}
                  />
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default GridTable;
