/*
 * Copyright © 2021 Cask Data, Inc.
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
import ClearIcon from '@material-ui/icons/Clear';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ITransformDeleteProps } from './types';
import { SmallButton, KeyboardArrowDownIconTransformGrid } from './styles';
import { Grid } from '@material-ui/core';

export default function TransformMenuButton({
  row,
  deleteColumnsFromTransforms,
  transforms,
}: ITransformDeleteProps) {
  const transformsInColumn = transforms.filter(({ columnName }) => {
    return columnName === row.name;
  });

  const numTransformsInColumn = transformsInColumn.length;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteClick = (index) => {
    deleteColumnsFromTransforms(index);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <SmallButton
        color="primary"
        id={`transform-delete-${row.name}-button`}
        aria-controls="trasnform-column-menu"
        aria-haspopup="true"
        variant="text"
        disabled={numTransformsInColumn === 0}
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ alignSelf: 'start' }}
      >
        {`${numTransformsInColumn === 0 ? '--' : numTransformsInColumn}`}
        {numTransformsInColumn !== 0 && <KeyboardArrowDownIconTransformGrid />}
      </SmallButton>
      <Menu
        getContentAnchorEl={null}
        id={`transform-menu-${row.name}`}
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `transform-menu-${row.name}-button`,
        }}
      >
        <Grid
          container
          direction="row"
          spacing={0}
          justifyContent="flex-start"
          alignItems="flex-start"
          style={{ minWidth: '400px', padding: '16px 12px 16px 16px' }}
        >
          <Grid item xs={1}>
            <span> # </span>
          </Grid>
          <Grid item xs={11}>
            <span> Transformations </span>
          </Grid>
        </Grid>

        {transforms.map((tr, i) => {
          const name = tr.columnName;
          const dir = tr.directive;
          const thisCol = name === row.name;
          return (
            <Grid container direction="row" key={`${name}-${dir}-row`}>
              <MenuItem
                style={{
                  minWidth: '400px',
                  background: thisCol ? '#f5f5f5' : '',
                  borderTop: '1px solid #d7d7d7',
                }}
                onClick={() => handleDeleteClick(i)}
                disabled={!thisCol}
              >
                <Grid item xs={1}>
                  {`${i + 1}`}
                </Grid>
                <Grid item xs={11}>
                  {dir} <ClearIcon style={{ float: 'right' }} />
                </Grid>
              </MenuItem>
            </Grid>
          );
        })}
      </Menu>
    </>
  );
}
