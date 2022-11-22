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

import { Card, TableCell, Typography } from '@material-ui/core';
import React from 'react';
import { useGridTextCellStyles } from './styles';
import { IGridTextCellProps } from './types';
import styled from 'styled-components';
import { grey } from '@material-ui/core/colors';

const TableRowCell = styled(TableCell)`
  min-width: 151px;
  font-size: 14px;
  width: auto;
  line-height: 21px;
  padding: 0px;
  border-right: 1px solid ${grey[300]};
  border-top: 1px solid ${grey[300]};
  border-bottom: 1px solid ${grey[300]};
  color: #5f6368;
  box-sizing: content-box;
`;

export default function GridTextCell({ cellValue }: IGridTextCellProps) {
  const classes = useGridTextCellStyles();

  return (
    <TableRowCell>
      <Card className={classes.root} variant="outlined">
        <Typography className={classes.cell} data-testid={`grid-text-cell-${cellValue}`}>
          {cellValue}
        </Typography>
      </Card>
    </TableRowCell>
  );
}
