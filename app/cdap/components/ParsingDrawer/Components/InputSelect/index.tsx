import React from 'react';
import { MenuItem, Select } from '@material-ui/core';

const InputSelect = (props) => {
  const { options, value, onChange, classes, className, fullWidth } = props;

  return (
    <Select
      classes={{ ...classes }}
      className={className}
      fullWidth={fullWidth}
      value={value}
      onChange={onChange}
      displayEmpty={false}
    >
      {options.map((option) => {
        return (
          <MenuItem value={option.value} key={option.value}>
            {option.label}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default InputSelect;
