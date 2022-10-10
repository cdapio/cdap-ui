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
import { addTinkToTransforms, addRenameToTransforms, addMaskToTransforms } from './addToTransforms';

export default function TransformAddButton({
  row,
  addColumnsToTransforms,
  tinkEnabled,
  currentColumnName,
}: ITransformAddProps) {
  // todo replace this with a useReducer
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [directive, setDirective] = useState(null);
  const [directiveText, setDirectiveText] = useState('');
  const [maskAnchorEl, setMaskAnchorEl] = useState(null);
  const maskOpen = !!maskAnchorEl;

  const open = !!anchorEl;
  const subMenuOpen = !!subMenuAnchorEl;

  const isString = row.targetType.toLowerCase() === 'string';

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClick = (event) => {
    setDirective(event.currentTarget.innerText);
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDirective(null);
    setSubMenuAnchorEl(null);
    setMaskAnchorEl(null);
    setDirectiveText('');
  };

  const handleSetMaskLast = (numChars: number) => {
    const newDirective = addMaskToTransforms({
      columnName: currentColumnName,
      directive: `right * ${numChars}`,
    });
    addColumnsToTransforms({
      columnName: row.name,
      directive: newDirective,
    });
    handleClose();
  };

  const handleDirectiveChange = (event) => {
    setDirectiveText(event.target.value);
  };

  const handleMaskOpen = (event) => {
    setMaskAnchorEl(event.currentTarget);
  };

  const handleAddToTransforms = () => {
    let fullDirective: string;
    const transformInfo = {
      columnName: currentColumnName,
      directive: directiveText,
    };

    if (directive === 'tink') {
      fullDirective = addTinkToTransforms(transformInfo);
    } else if (directive === 'Rename') {
      fullDirective = addRenameToTransforms(transformInfo);
    } else {
      fullDirective = addMaskToTransforms(transformInfo);
    }

    addColumnsToTransforms({
      columnName: row.name,
      directive: fullDirective,
    });
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
          Rename <ArrowRight />
        </MenuItem>
        <MenuItem disabled={!isString} onClick={handleMaskOpen}>
          Mask <ArrowRight />
        </MenuItem>
        <Menu
          getContentAnchorEl={null}
          id={`transform-menu-${row.name}-mask`}
          anchorEl={maskAnchorEl}
          open={maskOpen}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={handleClose}
          style={{ paddingTop: 0, paddingBottom: 0 }}
          MenuListProps={{
            'aria-labelledby': `transform-menu-${row.name}-button-mask-menu`,
            dense: true,
          }}
        >
          <MenuItem disabled={!isString} onClick={() => handleSetMaskLast(2)}>
            Show last 2
          </MenuItem>
          <MenuItem disabled={!isString} onClick={() => handleSetMaskLast(4)}>
            Show last 4
          </MenuItem>
          <MenuItem disabled={!isString} onClick={handleMenuClick}>
            Custom <ArrowRight />
          </MenuItem>
          {tinkEnabled && (
            <MenuItem onClick={handleMenuClick}>
              TINK <ArrowRight />
            </MenuItem>
          )}
        </Menu>
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
            label={directive === 'Custom' ? 'Mask (ie: right * 4)' : directive}
            variant="outlined"
            value={directiveText}
            onChange={handleDirectiveChange}
            autoFocus
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
