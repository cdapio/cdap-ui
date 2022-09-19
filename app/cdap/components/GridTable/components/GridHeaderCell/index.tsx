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

const StringIndicatorBox = styled(Box)({
  display: 'flex',
});

export default function GridHeaderCell({ label, types }: IGridHeaderCellProps) {
  const classes = useGridHeaderCellStyles();

  const [data, setData] = useState<Record<string, string>>({
    datatype1: types.length > 0 ? types[0] : null,
    datatype2: types.length > 1 ? types[1] : null,
  });

  return (
    <TableCell className={classes.tableHeaderCell}>
      <Card className={classes.root} variant="outlined">
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
