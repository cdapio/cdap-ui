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

import { Menu } from '@material-ui/core';
import React from 'react';
import MenuItemComponent from 'components/GridTable/components/MenuItemComponent';
import { useStyles } from 'components/GridTable/components/MenuComponent/styles';
import { IMenuComponentProps } from 'components/GridTable/components/MenuComponent/types';
import { isNullable } from 'components/AbstractWidget/SchemaEditor/SchemaHelpers';

export default function({
  anchorElement,
  menuOptions,
  setAnchorElement,
  submitOption,
  columnType,
  setMenuComponentOptions,
}: IMenuComponentProps) {
  const classes = useStyles();
  return (
    <Menu
      id="long-menu"
      keepMounted
      anchorEl={anchorElement}
      open={anchorElement ? true : false}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={(e: Event) => {
        e.preventDefault();
        setAnchorElement(null);
        setMenuComponentOptions([]);
      }}
      className={classes.root}
      classes={{ paper: classes.popoverPaper }}
      data-testid="menu-component-parent"
    >
      {menuOptions?.map((eachOption, optionsIndex) => (
        <MenuItemComponent
          columnType={columnType}
          item={eachOption}
          index={optionsIndex}
          onMenuClick={submitOption}
        />
      ))}
    </Menu>
  );
}
