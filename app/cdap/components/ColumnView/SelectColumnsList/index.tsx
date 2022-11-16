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
import { COLUMNS, NULL_VALUES } from 'components/ColumnView/constants';
import SelectColumnsTableRow from 'components/ColumnView/SelectColumnsList/SelectColumnsTableRow';
import {
  IDataQualityRecord,
  ISelectColumnsListProps,
} from 'components/ColumnView/SelectColumnsList/types';
import { prepareDataQualtiy } from 'components/ColumnView/SelectColumnsList/utils';
import { IHeaderNamesList } from 'components/GridTable/types';
import NoRecordScreen from 'components/NoRecordScreen';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CustomTableContainer = styled(TableContainer)`
  &.MuiTableContainer-root {
    height: calc(100% - 43px);
    overflow: scroll;
    padding: 0;
    position: relative;
  }
`;

const CustomTableHeaderCell = styled(TableCell)`
  background-color: #ffffff;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  letter-spacing: 0.15px;
  padding-left: 30px;
`;

const CustomTableHeaderRightCell = styled(CustomTableHeaderCell)`
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

const getTableBody = (
  filteredColumns: IHeaderNamesList[],
  dataQualityList: IDataQualityRecord[]
) => {
  {
    filteredColumns.length !== 0 ? (
      filteredColumns.map((eachFilteredColumn: IHeaderNamesList, filteredColumnIndex: number) => (
        <SelectColumnsTableRow
          eachFilteredColumn={eachFilteredColumn}
          filteredColumnIndex={filteredColumnIndex}
          dataQualityList={dataQualityList}
        />
      ))
    ) : (
      <NoRecordScreen
        title={T.translate('features.WranglerNewUI.ColumnViewPanel.noRecordScreen.title')}
        subtitle={T.translate('features.WranglerNewUI.ColumnViewPanel.noRecordScreen.subtitle')}
      />
    );
  }
};

export default function({ columnData, dataQuality, searchTerm }: ISelectColumnsListProps) {
  const [filteredColumns, setFilteredColumns] = useState<IHeaderNamesList[]>(columnData);
  const [dataQualityList, setDataQualityList] = useState<IDataQualityRecord[]>([]);

  useEffect(() => {
    setDataQualityList(prepareDataQualtiy(dataQuality, columnData));
  }, []);

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
                <CustomTableHeaderCell data-testid="column-name-header">
                  {`${COLUMNS} (${columnData?.length})`}
                </CustomTableHeaderCell>
                <CustomTableHeaderRightCell data-testid="null-values-header">
                  {NULL_VALUES}
                </CustomTableHeaderRightCell>
              </CustomTableHeaderRow>
            </TableHead>
          )}
          {getTableBody(filteredColumns, dataQualityList)}
        </Table>
      </CustomTableContainer>
    </SelectColumnsListSection>
  );
}
