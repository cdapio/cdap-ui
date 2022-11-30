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

import { Box, TableCell, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import TypographyComponent from 'components/GridTable/components/Typography';
import { useGridHeaderCellStyles } from './styles';
import { IGridHeaderCellProps } from './types';
import T from 'i18n-react';
import styled from 'styled-components';
import { blue, grey } from '@material-ui/core/colors';

const PREFIX = 'features.WranglerNewUI.GridTable';

const StringIndicatorBox = styled(Box)`
  display: flex;
`;

const TableHeaderCell = styled(TableCell)`
  padding: 0px;
  width: auto;
  font-size: 14px;
  border: 1px solid ${grey[300]};
  cursor: pointer;
`;

const CustomizedBox = styled(Box)`
  min-width: 216px;
  padding: 10px 0px 10px 30px;
  border-radius: 0px;
  border: 0px;
  background: #f1f8ff;
`;

const HighlightedBox = styled(CustomizedBox)`
  outline: 2px solid ${blue[500]};
  outline-offset: -2px;
`;

const CustomizedTypography = styled(Typography)`
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  color: #000000;
  margin-bottom: 5px;
`;

const getWrapperComponent = (isColumnHighlighted) => {
  if (isColumnHighlighted) {
    return HighlightedBox;
  } else {
    return CustomizedBox;
  }
};

export default function GridHeaderCell({
  label,
  types,
  columnSelected,
  setColumnSelected,
  onColumnSelection,
  index,
}: IGridHeaderCellProps) {
  const classes = useGridHeaderCellStyles();

  const isColumnHighlighted = label === columnSelected;

  const [data, setData] = useState<Record<string, string>>({
    datatype1: types?.length > 0 ? types[0] : T.translate(`${PREFIX}.unknown`).toString(),
    datatype2: types?.length > 1 ? types[1] : null,
  });

  useEffect(() => {
    setData({
      datatype1: types?.length > 0 ? types[0] : T.translate(`${PREFIX}.unknown`).toString(),
      datatype2: types?.length > 1 ? types[1] : null,
    });
  }, [label, types]);

  const ColumnHeaderContent = getWrapperComponent(isColumnHighlighted);

  return (
    <TableHeaderCell
      onClick={() => {
        setColumnSelected(label);
        onColumnSelection(label);
      }}
      data-testid={`grid-header-cell-${index}`}
    >
      <ColumnHeaderContent variant="outlined">
        <CustomizedTypography
          component="span"
          data-testid={`grid-header-column-name-${index}`}
          variant="body1"
        >
          {label}
        </CustomizedTypography>
        <StringIndicatorBox>
          <TypographyComponent
            className={classes.dataTypeIndicator}
            label={data?.datatype1 || T.translate(`${PREFIX}.unknown`).toString()}
          />
          {data?.datatype2 && (
            <StringIndicatorBox>
              <TypographyComponent className={classes.subDataTypeIndicator} label={'|'} />
              <TypographyComponent
                className={classes.subDataTypeIndicator}
                label={data?.datatype2}
              />
            </StringIndicatorBox>
          )}
        </StringIndicatorBox>
      </ColumnHeaderContent>
    </TableHeaderCell>
  );
}
