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

import { Box, Card, styled, TableCell, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import TypographyComponent from '../Typography';
import { useGridHeaderCellStyles } from './styles';
import { IGridHeaderCellProps } from './types';

const headerSelectedIcon = (
  <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 10C2.55228 10 3 9.55228 3 9C3 8.44772 2.55228 8 2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10Z"
      stroke="#DADCE0"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
      stroke="#DADCE0"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M2 17C2.55228 17 3 16.5523 3 16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16C1 16.5523 1.44772 17 2 17Z"
      stroke="#DADCE0"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 10C8.55228 10 9 9.55228 9 9C9 8.44772 8.55228 8 8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10Z"
      stroke="#DADCE0"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 3C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1C7.44772 1 7 1.44772 7 2C7 2.55228 7.44772 3 8 3Z"
      stroke="#DADCE0"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 17C8.55228 17 9 16.5523 9 16C9 15.4477 8.55228 15 8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17Z"
      stroke="#DADCE0"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const StringIndicatorBox = styled(Box)({
  display: 'flex',
});

export default function GridHeaderCell({ label, types, columnSelected,
  setColumnSelected,
 }: IGridHeaderCellProps) {
  const classes = useGridHeaderCellStyles();
  const isColumnHighlited = label === columnSelected;
  const [data, setData] = useState<Record<string, string>>({
    datatype1: types.length > 0 ? (types[0] as string) : null,
    datatype2: types.length > 1 ? (types[1] as string) : null,
  });

  useEffect(()=>{
    setData({
      datatype1: types.length > 0 ? (types[0] as string) : null,
      datatype2: types.length > 1 ? (types[1] as string) : null,
    })
  },[types])

  return (
    <TableCell className={classes.tableHeaderCell} data-testid="grid-header-cell-container" onClick={() => {
      setColumnSelected(label);
    }}>
      <div
        className={classes.headerHighlitedIcon}
        style={isColumnHighlited ? { display: 'inline' } : { display: 'none' }}
      >
        {headerSelectedIcon}
      </div>
      <Card className={classes.root} variant="outlined" style={isColumnHighlited ? { background: '#FFFFFF' } : { background: '#F1F8FF' }}>
        <Typography className={classes.columnHeader} data-testid={`grid-header-cell-${label}`}>
          {label}
        </Typography>
        <StringIndicatorBox>
          <TypographyComponent
            className={classes.dataTypeIndicator}
            label={data?.datatype1 || 'Unknown'}
          />
          {data.datatype2 && (
            <StringIndicatorBox>
              <TypographyComponent className={classes.subDataTypeIndicator} label={'|'} />
              <TypographyComponent
                className={classes.subDataTypeIndicator}
                label={data?.datatype2}
              />
            </StringIndicatorBox>
          )}
        </StringIndicatorBox>
      </Card>
    </TableCell>
  );
}