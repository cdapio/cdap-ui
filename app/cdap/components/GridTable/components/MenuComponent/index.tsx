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
import { Menu, MenuItem } from '@material-ui/core';
import React from 'react';
import MenuItemComponent from '../MenuItemComponent';
import { IMenuComponentProps } from './types';
import { useStyles } from './styles';

const MenuComponent: React.FC<IMenuComponentProps> = ({
  anchorEl,
  menuOptions,
  setAnchorEl,
  submitOption,
}) => {
  const open = Boolean(anchorEl);
  const classes = useStyles();
  return (
    <Menu
      id="long-menu"
      keepMounted
      anchorEl={anchorEl}
      open={open}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={(e: any) => {
        e.preventDefault();
        setAnchorEl(null);
      }}
      className={classes.root}
      data-testid='menu-component-menu'
    >
      {menuOptions.map((item, index) => (
        <MenuItemComponent item={item} index={index} onMenuClick={submitOption} />
      ))}
    </Menu>
  );
};
export default MenuComponent;
