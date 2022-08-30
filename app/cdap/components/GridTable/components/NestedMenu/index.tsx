import { IconButton, Menu, MenuItem } from '@material-ui/core';
import React, { useState } from 'react';
import MenuComponent from '../MenuComponent';
import MenuItemComponent from '../MenuItemComponent';
import { MENU_OPTIONS } from './constants';
import { useNestedMenuStyles } from './styles';

const NestedMenu: React.FC<any> = ({ icon, submitMenuOption }) => {
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
      submitMenuOption(item.key);
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
      >
        {icon}
      </IconButton>
      <Menu
        id="parent-menu"
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
          horizontal: 'right',
        }}
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
            e.preventDefault();
            e.stopPropagation();
            setAnchorEl(null);
            setAnchorEl2(null);
            submitMenuOption(item.key);
          }}
        />
      </Menu>
    </>
  );
};

export default NestedMenu;
