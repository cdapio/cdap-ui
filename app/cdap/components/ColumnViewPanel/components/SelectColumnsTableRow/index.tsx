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
import React from 'react';
import styled from 'styled-components';
import { ISelectColumnsTableRowProps } from 'components/ColumnViewPanel/components/SelectColumnsList';

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

export default function({
  eachFilteredColumn,
  filteredColumnIndex,
  dataQualityList,
}: ISelectColumnsTableRowProps) {
  return (
    <TableBody>
      <TableRow key={filteredColumnIndex}>
        <CustomTableBodyColumnTypeCell
          data-testid={`each-column-label-type-${filteredColumnIndex}`}
        >
          <Box>
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
      </TableRow>
    </TableBody>
  );
}
