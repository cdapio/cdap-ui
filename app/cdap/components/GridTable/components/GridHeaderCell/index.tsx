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

import React, { useState } from 'react';
import { Box, Card, styled, TableCell, Typography } from '@material-ui/core';
import TypographyComponent from '../Typography';
import { useGridHeaderCellStyles } from './styles';
import { IGridHeaderCellProps } from './types';
import { headerSelectedIcon } from './icons';

const StringIndicatorBox = styled(Box)({
  display: 'flex',
});

export default function GridHeaderCell({
  label,
  type,
  columnSelected,
  setColumnSelected,
}: IGridHeaderCellProps) {
  const classes = useGridHeaderCellStyles();
  console.log(label, columnSelected);
  const isColumnHighlited = label === columnSelected;

  return (
    <TableCell className={classes.tableHeaderCell} onClick={() => setColumnSelected(label)} data-testid={'grid-header-cell-table-cell' + label}>
      <div
        className={classes.headerHighlitedIcon}
        style={isColumnHighlited ? { display: 'inline' } : { display: 'none' }}
      >
        {headerSelectedIcon}
      </div>
      <Card
        className={classes.root}
        style={isColumnHighlited ? { background: '#FFFFFF' } : { background: '#F1F8FF' }}
        variant="outlined"
      >
        <Typography className={classes.columnHeader}>{label}</Typography>
        <StringIndicatorBox>
          <TypographyComponent className={classes.dataTypeIndicator} label={type || 'Unknown'} />
        </StringIndicatorBox>
      </Card>
    </TableCell>
  );
}
