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

import { Box, Card, TableCell, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import TypographyComponent from '../Typography';
import { useGridHeaderCellStyles } from './styles';
import { IGridHeaderCellProps } from './types';
import styled from 'styled-components';

const StringIndicatorBox = styled(Box)`
  display: 'flex';
`;

const StyledCard = styled(Card)`
  display: 'flex';
  background-color: ${(props) => (props.bgVariant ? '#FFFFFF' : '#F1F8FF')};
`;

export default function GridHeaderCell({
  label,
  types,
  columnSelected,
  setColumnSelected,
}: IGridHeaderCellProps) {
  const classes = useGridHeaderCellStyles();
  const isColumnHighlited = label === columnSelected;
  const [data, setData] = useState<Record<string, string>>({
    datatype1: types.length > 0 ? (types[0] as string) : null,
    datatype2: types.length > 1 ? (types[1] as string) : null,
  });

  return (
    <TableCell
      className={classes.tableHeaderCell}
      data-testid="grid-header-cell-container"
      onClick={() => {
        setColumnSelected(label);
      }}
    >
      <StyledCard className={classes.root} variant="outlined" bgVariant={isColumnHighlited}>
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
      </StyledCard>
    </TableCell>
  );
}
