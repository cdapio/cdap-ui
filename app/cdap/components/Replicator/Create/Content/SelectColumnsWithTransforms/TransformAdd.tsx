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
import { Grid, Popover, TextField } from '@material-ui/core';
import { addTinkToTransforms } from './addToTransforms';
import { ITransformInformation } from 'components/Replicator/types';

export default function TransformAddButton({
  row,
  addColumnsToTransforms,
  tableInfo,
}: ITransformAddProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [directiveText, setDirectiveText] = useState('');
  const open = !!anchorEl;
  const subMenuOpen = !!subMenuAnchorEl;

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
    // const transformInfo: ITransformInformation = {
    //   tableName: tableInfo.table,
    //   columnName: row.name,
    //   directive: directiveText,
    // };
    // addTinkToTransforms({ transformInfo, addColumnsToTransforms });
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
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleClose}
        style={{ paddingTop: 0, paddingBottom: 0 }}
        MenuListProps={{
          'aria-labelledby': `transform-menu-${row.name}-button`,
          dense: true,
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
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleClose}
      >
        <Grid
          container
          direction="row"
          spacing={0}
          justifyContent="center"
          style={{ alignSelf: 'center', minWidth: '200px', padding: '8px' }}
        >
          <TextField
            size="small"
            id={`${row.name}-outlined-multiline-flexible-directive-text`}
            label="TINK"
            variant="outlined"
            value={directiveText}
            onChange={handleDirectiveChange}
          />
        </Grid>
        <Grid
          container
          direction="row"
          spacing={0}
          justifyContent="center"
          alignItems="center"
          style={{
            minWidth: '200px',
            padding: '8px',
            textAlign: 'center',
            borderTop: '1px solid #d7d7d7',
          }}
        >
          <Grid item xs={6}>
            <SmallButton color="primary" variant="contained" onClick={handleAddToTransforms}>
              Apply
            </SmallButton>
          </Grid>
          <Grid item xs={6}>
            <SmallButton color="primary" variant="text" onClick={handleClose}>
              Cancel
            </SmallButton>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}
