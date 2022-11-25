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

import { Box, TableBody, TableCell, TableRow } from '@material-ui/core';
import DataQualityCircularProgressBar from 'components/ColumnViewPanel/components/DataQualityCircularProgressBar';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ISelectColumnsTableRowProps } from 'components/ColumnViewPanel/components/SelectColumnsList/types';

const CommonCustomTableBodyCell = styled(TableCell)`
  padding-top: 10px;
  padding-bottom: 10px;
  color: #5f6368;
  font-size: 14px;
`;

const CustomTableBodyColumnTypeCell = styled(CommonCustomTableBodyCell)`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 30px;
  &.MuiTableCell-root {
    padding: 10px 0px 10px 30px;
  }
`;

const CustomTableBodyNullValuesCell = styled(CommonCustomTableBodyCell)`
  width: 134px;
  padding-left: 0;
`;

const NormalSelectedRow = styled(TableRow)`
  & .MuiTableCell-root {
    border-bottom: 1px solid rgba(224, 224, 224, 1);
  }
  cursor: pointer;
`;

const SelectedColumnRow = styled(TableRow)`
  & .MuiTableRow-root {
    border-left: 1px solid #2196F3; !important;
    border-right: 1px solid #2196F3; !important;
    outline: 1px solid #2196F3; !important;
  }
  & .MuiTableCell-root {
    border-bottom: 1px solid #2196F3; !important;
    border-top: 1px solid #2196F3; !important;
  }
`;

const getColumnRowStyle = (isSelected) => {
  return isSelected ? SelectedColumnRow : NormalSelectedRow;
};

export default function({
  eachFilteredColumn,
  filteredColumnIndex,
  dataQualityList,
  setColumnSelected,
  onColumnSelection,
  selectedColumn,
  handleCoumnDeSelect,
}: ISelectColumnsTableRowProps) {
  const [selectedRow, setSelectedRow] = useState<boolean>(false);

  useEffect(() => {
    if (eachFilteredColumn?.label === selectedColumn) {
      setSelectedRow(true);
    } else {
      setSelectedRow(false);
    }
  }, [selectedColumn, eachFilteredColumn?.label]);

  const handleRowClick = () => {
    if (eachFilteredColumn?.label === selectedColumn) {
      handleCoumnDeSelect();
    } else {
      setColumnSelected(eachFilteredColumn?.label);
      onColumnSelection(eachFilteredColumn?.label);
    }
  };
  const ColumnRowStyleWrapper = getColumnRowStyle(selectedRow);
  return (
    <TableBody data-testid="table-parent-wrapper">
      <ColumnRowStyleWrapper
        key={filteredColumnIndex}
        onClick={() => handleRowClick()}
        data-testid="table-column-row-wrapper"
      >
        <CustomTableBodyColumnTypeCell
          data-testid={`each-column-label-type-${filteredColumnIndex}`}
        >
          <Box data-testid="filtered-column-label-type">
            {eachFilteredColumn?.label}

            <br />
            {eachFilteredColumn?.type}
          </Box>
        </CustomTableBodyColumnTypeCell>
        <CustomTableBodyNullValuesCell>
          <DataQualityCircularProgressBar
            wrapperComponentData={{
              dataQualityList,
              filteredColumnIndex,
            }}
            dataQualityPercentValue={dataQualityList[filteredColumnIndex]?.value}
          />
        </CustomTableBodyNullValuesCell>
      </ColumnRowStyleWrapper>
    </TableBody>
  );
}
