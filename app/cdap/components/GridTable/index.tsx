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
import ParsingDrawer from 'components/ParsingDrawer';
import LoadingSVG from 'components/shared/LoadingSVG';
import { IValues } from 'components/WrangleHome/Components/OngoingDataExploration/types';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { flatMap } from 'rxjs/operators';
import { objectQuery } from 'services/helpers';
import BreadCrumb from './components/Breadcrumb';
import GridHeaderCell from './components/GridHeaderCell';
import GridKPICell from './components/GridKPICell';
import GridTextCell from './components/GridTextCell';
import NoDataScreen from './components/NoRecordScreen';
import { useStyles } from './styles';
import { IExecuteAPIResponse, IHeaderNamesList, IObject, IParams, IRecords } from './types';
import { convertNonNullPercent } from './utils';
import FooterPanel from 'components/FooterPanel';
import RecipeSteps from 'components/RecipeSteps';
import AddTransformation from 'components/AddTransformation';

export default function() {
  const { wid } = useParams() as IRecords;
  const params = useParams() as IRecords;
  const classes = useStyles();
  const location = useLocation();

  const [workspaceName, setWorkspaceName] = useState('');
  const [headersNamesList, setHeadersNamesList] = useState<IHeaderNamesList[]>([]);
  const [rowsDataList, setRowsDataList] = useState([]);
  const [gridData, setGridData] = useState({} as IExecuteAPIResponse);
  const [missingDataList, setMissingDataList] = useState([]);
  const { dataprep } = DataPrepStore.getState();
  const [isFirstWrangle, setIsFirstWrangle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidCountArray, setInvalidCountArray] = useState([
    {
      label: 'Invalid',
      count: '0',
    },
  ]);
  const [connectorType, setConnectorType] = useState(null);
  const [showRecipePanel, setShowRecipePanel] = useState(false);

  useEffect(() => {
    setIsFirstWrangle(true);
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
        flatMap((res: IValues) => {
          const { dataprep } = DataPrepStore.getState();
          setWorkspaceName(res.workspaceName);
          if (dataprep.workspaceId !== workspaceId) {
            return;
          }
          const directives = objectQuery(res, 'directives') || [];
          const requestBody = directiveRequestBodyCreator(directives);
          const sampleSpec = objectQuery(res, 'sampleSpec') || {};
          const visualization = objectQuery(res, 'insights', 'visualization') || {};

          const insights = {
            name: res?.sampleSpec?.connectionName,
            workspaceName: res.workspaceName,
            path: res?.sampleSpec?.path,
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
            values: response.values,
            headers: response.headers,
            types: response.types,
            ...gridParams,
          },
        });
        setLoading(false);
        setLoading(false);
        setGridData(response);
        setLoading(false);
      });
  };

  const updateDataTranformation = (wid: string) => {
    const payload = {
      context: params.namespace,
      workspaceId: wid,
    };
    getWorkSpaceData(payload, wid);
    setIsFirstWrangle(false);
  };

  useEffect(() => {
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
          type: [columnTypesList[eachColumnName]],
        };
      });
    }
  };

  const createMissingData = (statistics: IObject) => {
    const statisticObjectToArray = Object.entries(statistics);
    const metricArray = [];
    statisticObjectToArray.forEach(([key, value]) => {
      const headerKeyTypeArray = Object.entries(value);
      const typeArrayOfMissingValue = [];
      headerKeyTypeArray.forEach(([vKey, vValue]) => {
        typeArrayOfMissingValue.push({
          label: vKey == 'general' ? 'Missing/Null' : '',
          count: vKey == 'types' ? '' : convertNonNullPercent(gridData, vValue),
        });
      }),
        metricArray.push({
          name: key,
          values: typeArrayOfMissingValue.concat(invalidCountArray),
        });
    });
    return metricArray;
  };

  // ------------@getGridTableData Function is used for preparing data for entire grid-table
  // ------------@getGridTableData Function is used for preparing data for entire grid-table
  const getGridTableData = async () => {
    const rawData: IExecuteAPIResponse = gridData;
    const headersData = createHeadersData(rawData?.headers, rawData?.types);
    setHeadersNamesList(headersData);
    if (rawData && rawData.summary && rawData.summary?.statistics) {
      const missingData = createMissingData(gridData?.summary?.statistics);
      setMissingDataList(missingData);
    }
    const rowData =
      rawData &&
      rawData.values &&
      Array.isArray(rawData?.values) &&
      rawData?.values.map((eachRow: {}) => {
        return eachRow;
      });
    setRowsDataList(rowData);
  };

  useEffect(() => {
    getGridTableData();
  }, [gridData]);

  const showRecipePanelHandler = () => {
    setShowRecipePanel((prev) => !prev);
  };

  const [showAddTransformation, setSshowAddTransformation] = useState(false);
  const showAddTransformationHandler = () => {
    setSshowAddTransformation((prev) => !prev);
  };

  return (
    <Box>
      <BreadCrumb datasetName={workspaceName} location={location} />
      {Array.isArray(gridData?.headers) && gridData?.headers.length === 0 && <NoDataScreen />}
      {isFirstWrangle && connectorType === 'File' && (
        <ParsingDrawer
          updateDataTranformation={(wid) => updateDataTranformation(wid)}
          setLoading={setLoading}
        />
      )}
      {showRecipePanel && (
        <RecipeSteps setShowRecipePanel={setShowRecipePanel} showRecipePanel={showRecipePanel} />
      )}
      {showAddTransformation && (
        <AddTransformation
          functionName="Null"
          showAddTransformationHandler={showAddTransformationHandler}
        />
      )}
      <Table aria-label="simple table" className="test" data-testid="grid-table">
        <TableHead>
          <TableRow>
            {headersNamesList?.length > 0 &&
              headersNamesList.map((eachHeader) => (
                <GridHeaderCell
                  label={eachHeader.label}
                  types={eachHeader.type as string[]}
                  key={eachHeader.name}
                />
              ))}
          </TableRow>
          <TableRow>
            {missingDataList?.length > 0 &&
              headersNamesList.length > 0 &&
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
          {rowsDataList?.length > 0 &&
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
      <FooterPanel
        showRecipePanelHandler={showRecipePanelHandler}
        showAddTransformationHandler={showAddTransformationHandler}
      />
      {loading && (
        <div className={classes.loadingContainer}>
          <LoadingSVG />
        </div>
      )}
    </Box>
  );
}
