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

import React, { useEffect, useState } from 'react';
import T from 'i18n-react';
import { useLocation, useParams } from 'react-router';
import styled from 'styled-components';
import { Table, TableBody, TableHead, TableRow } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Breadcrumb from 'components/Breadcrumb';
import { setWorkspace } from 'components/DataPrep/store/DataPrepActionCreator';
import FooterPanel from 'components/FooterPanel';
import GridHeaderCell from 'components/GridTable/components/GridHeaderCell';
import GridKPICell from 'components/GridTable/components/GridKPICell';
import GridTextCell from 'components/GridTable/components/GridTextCell';
import { useStyles } from 'components/GridTable/styles';
import { IAddTransformationItem, IGeneralStatistics, IRecords } from 'components/GridTable/types';
import { getWrangleGridBreadcrumbOptions } from 'components/GridTable/utils';
import NoRecordScreen from 'components/NoRecordScreen';
import LoadingSVG from 'components/shared/LoadingSVG';
import Snackbar from 'components/Snackbar';
import useSnackbar from 'components/Snackbar/useSnackbar';
import SelectColumnPanel from 'components/WranglerGrid/SelectColumnPanel';
import { FlexWrapper } from 'components/WranglerGrid/SelectColumnPanel/styles';
import ToolBarList from 'components/WranglerGrid/TransformationToolbar';

export const TableWrapper = styled(Box)`
  width: 100%;
`;

const GridTableWrapper = styled(Box)`
  height: calc(100% - 115px);
  max-height: 76vh;
  max-width: 100%;
  overflow-x: auto;
  width: 100%;
`;
const transformationOptions = ['undo', 'redo'];

export default function GridTable({ handleTransformationUpload, storeData }) {
  const { dataprep, columnsInformation } = storeData;
  const { wid } = useParams() as IRecords;
  const classes = useStyles();
  const location = useLocation();
  const [showBreadCrumb, setShowBreadCrumb] = useState<boolean>(true);
  const [addTransformationFunction, setAddTransformationFunction] = useState<
    IAddTransformationItem
  >({
    option: '',
    supportedDataType: [],
  });
  const [snackbarState, setSnackbar] = useSnackbar();
  const [selectedColumn, setSelectedColumn] = useState('');

  useEffect(() => {
    // Get DATA from URL paramteres to get data of workspace
    setWorkspace(wid).subscribe(() =>
      setSnackbar({
        open: true,
        isSuccess: true,
        message: T.translate(
          `features.WranglerNewUI.GridTable.snackbarLabels.datasetSuccess`
        ).toString(),
      })
    );
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
    const lengthOfData: number = dataprep?.data?.length;
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
    const valueOfKey = dataprep?.data?.map((el) => el[key]);
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
          values: arrayForMissingValue,
        });
    });
    return metricArray;
  };

  const handleColumnSelect = (columnName) => {
    setSelectedColumn((prevColumn) => (prevColumn === columnName ? '' : columnName));
    handleTransformationUpload('column', columnName);
  };

  const onMenuOptionSelection = (option: string, supportedDataType: string[]) => {
    handleTransformationUpload('function', { option, supportedDataType });
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

  const tableMetaInfo = {
    columnCount: dataprep.headers.length,
    rowCount: dataprep.data.length,
  };

  return (
    <>
      {showBreadCrumb && (
        <Breadcrumb
          breadcrumbsList={getWrangleGridBreadcrumbOptions(
            dataprep.insights.workspaceName,
            location
          )}
        />
      )}
      <ToolBarList
        setShowBreadCrumb={setShowBreadCrumb}
        showBreadCrumb={showBreadCrumb}
        columnType={dataprep.types[selectedColumn]}
        submitMenuOption={(option, datatype) =>
          !transformationOptions.includes(option) ? onMenuOptionSelection(option, datatype) : null
        }
        disableToolbarIcon={!Boolean(dataprep?.headers?.length)}
      />
      <GridTableWrapper data-testid="grid-table-container">
        {dataprep.headers.length ? (
          <TableWrapper>
            <Table aria-label="simple table" className="test">
              <TableHead>
                <TableRow>
                  {dataprep.headers.map((eachHeader) => (
                    <GridHeaderCell
                      label={eachHeader}
                      type={dataprep.types[eachHeader]}
                      key={eachHeader}
                      columnSelected={selectedColumn}
                      setColumnSelected={handleColumnSelect}
                    />
                  ))}
                </TableRow>
                <TableRow>
                  {dataprep.headers.map((each) => {
                    return createMissingData(columnsInformation.columns).map((item) => {
                      if (item.name === each) {
                        return <GridKPICell metricData={item} key={item.name} />;
                      }
                    });
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataprep.data.map((eachRow, rowIndex) => {
                  return (
                    <TableRow key={`row-${rowIndex}`}>
                      {dataprep.headers.map((eachKey, eachIndex) => {
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
          </TableWrapper>
        ) : (
          <FlexWrapper>
            <NoRecordScreen
              title={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.title')}
              subtitle={T.translate('features.WranglerNewUI.NoRecordScreen.gridTable.subtitle')}
            />
          </FlexWrapper>
        )}
        <FooterPanel recipeStepsCount={0} gridMetaInfo={tableMetaInfo} />
        {addTransformationFunction.option && (
          <SelectColumnPanel
            transformationName={addTransformationFunction.option}
            transformationDataType={addTransformationFunction.supportedDataType}
            columnsList={createHeadersData(dataprep.headers, dataprep.types)}
            missingItemsList={columnsInformation.columns}
            onCancel={() => {
              setAddTransformationFunction({
                option: '',
                supportedDataType: [],
              });
            }}
          />
        )}
        {dataprep.loading && (
          <div className={classes.loadingContainer}>
            <LoadingSVG />
          </div>
        )}
      </GridTableWrapper>
      {
        <Snackbar
          handleClose={() =>
            setSnackbar(() => ({
              open: false,
            }))
          }
          open={snackbarState.open}
          message={snackbarState.message}
          isSuccess={snackbarState.isSuccess}
        />
      }
    </>
  );
}
