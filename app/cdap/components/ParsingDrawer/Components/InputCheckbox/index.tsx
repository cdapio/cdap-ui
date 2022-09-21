import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { useStyles } from '../../styles';

const InputCheckbox = (props) => {
  const { label, value, onChange, className } = props;
  const classes = useStyles();

  return (
    <FormControlLabel
      className={className}
      control={<Checkbox onChange={onChange} checked={value} color="primary" />}
      label={<span className={classes.labelTextStyles}>{label}</span>}
    />
  );
};

export default InputCheckbox;
