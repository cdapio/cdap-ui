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

const ToolBarList = () => {
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
        <NestedMenu icon={StructureIcon} submitMenuOption={(a) => console.log('menu-z', a)} />
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
