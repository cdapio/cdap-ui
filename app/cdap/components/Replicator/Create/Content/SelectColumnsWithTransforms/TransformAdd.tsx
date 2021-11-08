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
import ArrowRight from '@material-ui/icons/ArrowRight';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ITransformAddProps } from './types';
import { SmallButton, KeyboardArrowDownIconTransformGrid } from './styles';
import { Popover, TextField } from '@material-ui/core';
import { addRenameToTransforms } from './addToTransforms';
import { ITransformInformation } from 'components/Replicator/types';

export default function TransformAddButton({
  row,
  addColumnsToTransforms,
  tableInfo,
}: ITransformAddProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [directiveText, setDirectiveText] = useState('');
  const open = Boolean(anchorEl);
  const subMenuOpen = Boolean(subMenuAnchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (event) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
    setDirectiveText('');
  };

  const handleDirectiveChange = (event) => {
    setDirectiveText(event.target.value);
  };

  const handleAddToTransforms = () => {
    const transformInfo: ITransformInformation = {
      tableName: tableInfo.table,
      columnName: row.name,
      directive: directiveText,
    };
    addRenameToTransforms({ transformInfo, addColumnsToTransforms });
    handleClose();
  };

  return (
    <>
      <SmallButton
        color="primary"
        id={`transform-menu-${row.name}-button`}
        aria-controls="trasnform-column-menu"
        aria-haspopup="true"
        variant="text"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Transform
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
        <MenuItem onClick={handleMenuClick}>
          TINK <ArrowRight />
        </MenuItem>
      </Menu>

      <Popover
        id={`transform-menu-${row.name}-TINK`}
        anchorEl={subMenuAnchorEl}
        open={open && subMenuOpen}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        onClose={handleClose}
      >
        <TextField
          id={`${row.name}-outlined-multiline-flexible-directive-text`}
          label="Multiline"
          multiline
          maxRows={4}
          value={directiveText}
          onChange={handleDirectiveChange}
        />
        <SmallButton color="primary" variant="text" onClick={handleAddToTransforms}>
          Save
        </SmallButton>
        <SmallButton color="primary" variant="text" onClick={handleClose}>
          Cancel
        </SmallButton>
      </Popover>
    </>
  );
}
