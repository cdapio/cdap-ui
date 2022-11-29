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

import { Card, TableCell, Typography, Popover } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useGridTextCellStyles } from './styles';
import { IGridTextCellProps } from './types';
import PositionExtract from 'components/WranglerGrid/TransformationComponents/PositionExtract';

export default function GridTextCell({
  cellValue,
  maskSelection,
  rowNumber,
  columnSelected,
  applyTransformation,
  cancelTransformation,
  optionSelected,
  headers,
  cellIndex,
}: IGridTextCellProps) {
  const classes = useGridTextCellStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [textSelectionRange, setTextSelectionRange] = useState({
    start: null,
    end: null,
  });

  const mouseUpHandler = (event) => {
    if (!maskSelection) {
      return;
    }

    const currentSelection = window.getSelection().toString();
    let startRange, endRange;

    if (currentSelection.length) {
      startRange = window.getSelection().getRangeAt(0).startOffset;
      endRange = window.getSelection().getRangeAt(0).endOffset;
      setAnchorEl(event.currentTarget);
      setTextSelectionRange({
        start: startRange,
        end: endRange,
      });
    } else {
      setTextSelectionRange({
        start: null,
        end: null,
      });
      setAnchorEl(null);
      cancelTransformation();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTextSelectionRange({
      start: null,
      end: null,
    });
    cancelTransformation();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TableCell
        className={
          maskSelection
            ? `${classes.tableRowCell} ${classes.highlightedColumn}`
            : classes.tableRowCell
        }
        onMouseUp={mouseUpHandler}
        data-testid={`grid-cellData-${cellIndex}`}
      >
        <Card
          className={maskSelection ? `${classes.root} ${classes.highlightedColumn}` : classes.root}
          variant="outlined"
        >
          <Typography
            className={maskSelection ? classes.highlightCell : classes.cell}
            data-testid={`grid-text-cell-${cellIndex}`}
          >
            {cellValue}
          </Typography>
        </Card>
      </TableCell>
      {optionSelected == 'extract-using-positions' && anchorEl && (
        <PositionExtract
          open={open}
          anchorEl={anchorEl}
          handleClose={handleClose}
          setAnchorEl={setAnchorEl}
          textSelectionRange={textSelectionRange}
          columnSelected={columnSelected}
          applyTransformation={applyTransformation}
          headers={headers}
        />
      )}
    </>
  );
}
