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

import { Box, Table, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import SelectColumnsTableRow from 'components/ColumnViewPanel/components/SelectColumnsTableRow';
import NoRecordScreen from 'components/NoRecordScreen';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ISelectColumnsListProps,
  IDataQuality,
  IDataQualityRecord,
} from 'components/ColumnViewPanel/components/SelectColumnsList/types';

const COLUMNS = T.translate('features.WranglerNewUI.ColumnViewPanel.columns');
const NULL_VALUES = T.translate('features.WranglerNewUI.ColumnViewPanel.nullValues');

import { IHeaderNamesList } from 'components/GridTable/types';

const CustomTableContainer = styled(TableContainer)`
  &.MuiTableContainer-root {
    height: calc(100% - 43px);
    overflow: scroll;
    padding: 0;
    position: relative;
  }
`;

const CustomTableColumnHeaderCell = styled(TableCell)`
  background-color: #ffffff;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.15px;
  padding-left: 30px;
`;

const CustomTableNullValuesHeaderCell = styled(CustomTableColumnHeaderCell)`
  padding-left: 0;
`;

const CustomTableHeaderRow = styled(TableRow)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.15px;
`;

const SelectColumnsListSection = styled.section`
  width: 100%;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.15px;
  color: #5f6368;
  height: calc(100vh - 211px);
  overflow: scroll;
`;

export const prepareDataQualtiy = (statistics: IDataQuality, columnList: IHeaderNamesList[]) => {
  const dataQualityToArray = statistics && Object.entries(statistics);
  const dataQuality = [];
  columnList?.map((eachColumnName: IHeaderNamesList) => {
    dataQualityToArray?.forEach(([key, value]) => {
      if (eachColumnName.name == key) {
        const generalValues = Object.entries(value);
        Array.isArray(generalValues) &&
          generalValues.length !== 0 &&
          generalValues.forEach(([vKey, vValue]) => {
            if (vKey == 'general') {
              if (vValue.null) {
                const nullCount = vValue.null || 0;
                const totalNullEmpty = nullCount;
                dataQuality.push({
                  label: key,
                  value: totalNullEmpty,
                });
              } else {
                dataQuality.push({
                  label: key,
                  value: 0,
                });
              }
            }
          });
      }
    });
  });
  return dataQuality;
};

const getTableBody = (
  filteredColumns: IHeaderNamesList[],
  dataQualityList: IDataQualityRecord[],
  setColumnSelected,
  onColumnSelection,
  selectedColumn,
  handleCoumnDeSelect
) => {
  {
    return filteredColumns.length !== 0 ? (
      filteredColumns.map((eachFilteredColumn: IHeaderNamesList, filteredColumnIndex: number) => {
        return (
          <SelectColumnsTableRow
            eachFilteredColumn={eachFilteredColumn}
            filteredColumnIndex={filteredColumnIndex}
            dataQualityList={dataQualityList}
            setColumnSelected={setColumnSelected}
            onColumnSelection={onColumnSelection}
            selectedColumn={selectedColumn}
            handleCoumnDeSelect={handleCoumnDeSelect}
          />
        );
      })
    ) : (
      <NoRecordScreen
        title={T.translate('features.WranglerNewUI.ColumnViewPanel.noRecordScreen.title')}
        subtitle={T.translate('features.WranglerNewUI.ColumnViewPanel.noRecordScreen.subtitle')}
      />
    );
  }
};

export default function({
  columnData,
  dataQuality,
  searchTerm,
  setColumnSelected,
  onColumnSelection,
  selectedColumn,
  handleCoumnDeSelect,
}: ISelectColumnsListProps) {
  const [filteredColumns, setFilteredColumns] = useState<IHeaderNamesList[]>(columnData);
  const [dataQualityList, setDataQualityList] = useState<IDataQualityRecord[]>([]);

  useEffect(() => {
    setDataQualityList(prepareDataQualtiy(dataQuality, columnData));
  }, []);

  useEffect(() => {
    if (columnData && columnData.length) {
      setFilteredColumns(columnData);
    }
  }, [columnData]);

  useEffect(() => {
    if (searchTerm) {
      const filteredColumn =
        columnData.length !== 0 &&
        columnData.filter((el) => el?.label.toLowerCase().includes(searchTerm.toLowerCase()));
      if (filteredColumn?.length) {
        setFilteredColumns(filteredColumn);
      } else {
        setFilteredColumns([]);
      }
    } else {
      setFilteredColumns(columnData);
    }
  }, [searchTerm]);

  return (
    <SelectColumnsListSection>
      <CustomTableContainer component={Box}>
        <Table aria-label="recipe steps table" stickyHeader>
          {filteredColumns.length !== 0 && (
            <TableHead>
              <CustomTableHeaderRow>
                <CustomTableColumnHeaderCell data-testid="column-name-header">
                  {`${COLUMNS} (${filteredColumns?.length})`}
                </CustomTableColumnHeaderCell>
                <CustomTableNullValuesHeaderCell data-testid="null-values-header">
                  {NULL_VALUES}
                </CustomTableNullValuesHeaderCell>
              </CustomTableHeaderRow>
            </TableHead>
          )}
          {getTableBody(
            filteredColumns,
            dataQualityList,
            setColumnSelected,
            onColumnSelection,
            selectedColumn,
            handleCoumnDeSelect
          )}
        </Table>
      </CustomTableContainer>
    </SelectColumnsListSection>
  );
}
