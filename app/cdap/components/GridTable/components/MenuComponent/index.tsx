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
    >
      {menuOptions.map((item, index) => (
        <MenuItemComponent item={item} index={index} onMenuClick={submitOption} />
      ))}
    </Menu>
  );
};
export default MenuComponent;
