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
import { IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { default as React } from 'react';
import NestedMenu from '../NestedMenu';
import {
  ColumnIcon,
  Divider,
  Expand,
  FragmentIcon,
  GridIcon,
  InvalidIcon,
  MathIcon,
  NullIcon,
  OtherIcon,
  Redo,
  SearchIconn,
  SecurityIcon,
  StructureIcon,
  Undo,
} from './images';
import { useStyles } from './styles';

const ToolBarList = ({ submitMenuOption }) => {
  const classes = useStyles();
  return (
    <Box className={classes.iconContainer}>
      <Box className={classes.container}>
        <IconButton>{Undo}</IconButton>
        <IconButton>{Redo}</IconButton>

        {Divider}
        <IconButton>{NullIcon}</IconButton>
        <IconButton>{InvalidIcon}</IconButton>
        <IconButton>{ColumnIcon}</IconButton>

        {Divider}
        <NestedMenu icon={StructureIcon} submitMenuOption={submitMenuOption} />
        <IconButton>{FragmentIcon}</IconButton>
        <IconButton>{MathIcon}</IconButton>
        <IconButton>{SecurityIcon}</IconButton>
        <IconButton>{OtherIcon}</IconButton>

        {Divider}
        <IconButton>{GridIcon}</IconButton>

        {Divider}
        <IconButton>{SearchIconn}</IconButton>
        <input type="search" placeholder="Search for Functions" className={classes.searchIcon} />
      </Box>

      <IconButton>{Expand}</IconButton>
    </Box>
  );
};

export default ToolBarList;
