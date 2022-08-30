import { MenuItem } from '@material-ui/core';
import React from 'react';
import { menuArrowIcon } from '../AaToolbar/images';
import { useNestedMenuStyles } from '../NestedMenu/styles';

const MenuItemComponent: React.FC<any> = ({ item, index, onMenuClick }) => {
  const classes = useNestedMenuStyles();

  if (item.key === 'divider') {
    return <hr className={classes.divider} key={index} />;
  }
  if (item.key === 'heading') {
    return (
      <div className={classes.heading} key={index}>
        {item.label}
      </div>
    );
  } else {
    return (
      <MenuItem key={index} title={item.key} onClick={(e) => onMenuClick(e, item)}>
        <span>{item.label} </span>
        {item.options?.length && menuArrowIcon}
      </MenuItem>
    );
  }
};
export default MenuItemComponent;
