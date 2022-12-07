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

import { Box, Table, TableBody, TableHead, TableRow } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import GridHeaderCell from 'components/GridTable/components/GridHeaderCell';
import GridKPICell from '../GridKPICell';
import GridTextCell from '../GridTextCell';

const TableWrapper = styled(Box)`
  height: calc(100vh - 193px);
  overflow-y: auto;
`;

export default function({ headersNamesList, missingDataList, rowsDataList }) {
  return (
    <>
      <TableWrapper>
        <Table aria-label="simple table">
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
      </TableWrapper>
    </>
  );
}
