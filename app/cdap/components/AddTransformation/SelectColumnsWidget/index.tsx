import { Button } from '@material-ui/core';
import React from 'react';
import {
  QUICK_SELECT_INFO,
  SELECT_COLUMNS,
  SELECT_COLUMNS_TO_APPLY_THIS_FUNCTION,
} from '../constants';
import { useStyles } from '../styles';

const SelectColumnsWidget = (props) => {
  const classes = useStyles();

  return (
    <section className={classes.functionSectionStyles}>
      <div className={classes.functionHeadingTextStyles}>
        {SELECT_COLUMNS_TO_APPLY_THIS_FUNCTION}
      </div>
      <div className={classes.quickSelectTextStyles}>{QUICK_SELECT_INFO}</div>
      <Button
        variant="outlined"
        color="primary"
        className={classes.selectButtonStyles}
        onClick={props.handleSelectColumn}
      >
        {SELECT_COLUMNS}
      </Button>
    </section>
  );
};

export default SelectColumnsWidget;
