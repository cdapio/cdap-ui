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
import Delete from '@material-ui/icons/Delete';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ITransformDeleteProps } from './types';
import { SmallButton, KeyboardArrowDownIconTransformGrid } from './styles';

export default function TransformMenuButton({
  row,
  deleteColumnsFromTransforms,
  transforms,
}: ITransformDeleteProps) {
  if (transforms === undefined) {
    return <>--</>;
  }

  const cols = transforms.columnTransformations;
  const transformsInColumn = cols.filter(({ columnName }) => {
    return columnName === row.name;
  });

  const numTransformsInColumn = transformsInColumn.length;
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteClick = (index) => {
    deleteColumnsFromTransforms(transforms.tableName, index);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
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
      >
        {`${numTransformsInColumn}`}
        <KeyboardArrowDownIconTransformGrid />
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
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `transform-menu-${row.name}-button`,
        }}
      >
        {cols.map((col, i) => {
          const name = col.columnName;
          const dir = col.directive;
          const thisCol = name === row.name;
          return (
            <MenuItem
              onClick={() => handleDeleteClick(i)}
              disabled={!thisCol}
              style={{ background: thisCol ? 'blue' : '' }}
            >
              {dir} <Delete />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
