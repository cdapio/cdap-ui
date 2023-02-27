/*
 * Copyright © 2023 Cask Data, Inc.
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

import React from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import styled, { css, StyledComponent } from 'styled-components';

export interface IColumn {
  name: string;
  value: string;
  getCellRenderer: ({ value, row }: { value: string; row?: IRow }) => () => JSX.Element;
}

interface IDataTableProps {
  rows: IRow[];
  columns: IColumn[];
  Container: StyledComponent<typeof TableContainer, {}>;
  getTableHeaderCell: (label: string) => () => JSX.Element;
}

export interface IRow {
  serialNumber: string;
  recipeStep: string;
}

const typographyBodyVariantStyles = css`
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  text-align: left;
`;

export const DataTableContainer: StyledComponent<typeof TableContainer, {}> = styled(
  TableContainer
)`
  &&& {
    max-height: 100%;
    max-width: 100%;
    overflow: auto;
  }
  .MuiTableCell-root {
    padding: 14px 16px;
  }
  .MuiTableHead-root {
    background-color: ${grey[100]};
    .MuiTypography-body1 {
      font-size: 12px;
      font-weight: 700;
      line-height: 20px;
      letter-spacing: 0.4px;
      text-align: left;
    }
  }
  .MuiTableBody-root {
    .MuiIconButton-root {
      padding: 0;
      margin-top: 4px;
      margin-right: 9px;
      align-self: flex-start;
    }
    .MuiTableRow-root:hover {
      background-color: ${grey[300]};
    }
    .MuiTypography-body1 {
      font-weight: 600;
      ${typographyBodyVariantStyles}
    }
    .MuiTypography-body2 {
      font-weight: 400;
      ${typographyBodyVariantStyles}
    }
  }
`;

export default function DataTable({
  rows,
  columns,
  Container,
  getTableHeaderCell,
}: IDataTableProps) {
  return (
    <Container component={Paper} data-testid="data-table">
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {columns.map((column) => {
              const { value, name } = column;
              const HeaderCell = getTableHeaderCell(value);
              return (
                <TableCell key={`data-table-head-cell-${name}`}>
                  <HeaderCell />
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={`data-table-body-row-${rowIndex}`}>
              {columns.map((column) => {
                const { name, getCellRenderer } = column;
                const value = row[name];
                const BodyCell = getCellRenderer({ value, row });
                return (
                  <TableCell key={`data-table-body-cell-${name}`}>
                    <BodyCell />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
