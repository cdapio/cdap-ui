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

import { IconButton, Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';
import MenuComponent from '../MenuComponent';
import MenuItemComponent from '../MenuItemComponent';
import { MENU_OPTIONS } from './constants';
import { useNestedMenuStyles } from './styles';
import { INestedMenuProps } from './types';

const NestedMenu: React.FC<INestedMenuProps> = ({ icon, submitMenuOption }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open = Boolean(anchorEl);
  const [nestedOptions, setNestedOptions] = useState([]);
  const classes = useNestedMenuStyles();

  const handleMenuClick = (event: any, item: any) => {
    setNestedOptions([]);
    event.preventDefault();
    event.stopPropagation();
    if (item.options) {
      setNestedOptions(item.options);
      setAnchorEl2(event.currentTarget);
    } else {
      submitMenuOption(item.value);
      setAnchorEl(null);
    }
  };

  return (
    <>
      <IconButton
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
        id="nested-menu-icon-button"
      >
        {icon}
      </IconButton>
      <Menu
        id="parent-menu"
        keepMounted
        anchorEl={anchorEl}
        open={open}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={(e) => {
          //   e.preventDefault();
          setAnchorEl(null);
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={classes.root}
      >
        {MENU_OPTIONS.map((item, index) => (
          <MenuItemComponent item={item} index={index} onMenuClick={handleMenuClick} />
        ))}
        <MenuComponent
          anchorEl={anchorEl2}
          menuOptions={nestedOptions}
          setAnchorEl={setAnchorEl2}
          submitOption={(e, item) => {
            console.log('item', item);
            e.preventDefault();
            e.stopPropagation();
            setAnchorEl(null);
            setAnchorEl2(null);
            submitMenuOption(item.value);
          }}
        />
      </Menu>
    </>
  );
};

export default NestedMenu;
