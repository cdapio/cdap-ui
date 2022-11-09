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

import { Box, MenuItem, Typography } from '@material-ui/core';
import { IMenuItemComponentProps } from 'components/GridTable/components/MenuItemComponent/types';
import { useNestedMenuStyles } from 'components/GridTable/components/NestedMenu/styles';
import { menuArrowIcon } from 'components/GridTable/components/TransformationToolbar/iconStore';
import React from 'react';

export default function({ item, index, onMenuClick, columnType }: IMenuItemComponentProps) {
  const classes = useNestedMenuStyles();

  let menuItemDisableProp;
  menuItemDisableProp = columnType
    ? !(item?.supportedDataType?.includes(columnType) || item?.supportedDataType?.includes('all'))
    : (menuItemDisableProp = false);

  if (item?.value === 'divider') {
    return <hr className={classes.divider} key={index} data-testid="menu-item-divider" />;
  }
  if (item?.value === 'heading') {
    return (
      <Box className={classes.heading} key={index} data-testid="menu-item-heading">
        {item.label}
      </Box>
    );
  } else {
    return (
      <MenuItem
        key={index}
        disabled={menuItemDisableProp}
        title={item.value}
        onClick={(onClickEvent) => onMenuClick(onClickEvent, item)}
        data-testid="menu-item-parent"
      >
        <Typography component="div" className={classes.menuLabels}>
          {item.label}{' '}
        </Typography>
        {item?.options?.length > 0 && menuArrowIcon}
      </MenuItem>
    );
  }
}
