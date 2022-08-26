import React from 'react';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import { Divider } from '@material-ui/core';
import { useStyles } from './styles';

export const TransitionComponent = (props) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.headFlex}>
        <h5 className={classes.errorHead}>
          <WarningRoundedIcon className={classes.warningIcon} />
          &nbsp;Error
        </h5>
        <span className={classes.dismissSpan} onClick={() => props.close()}>
          Dismiss
        </span>
      </div>
      <Divider />
      <p className={classes.errorMessage}>Failed to retrieve sample</p>
    </div>
  );
};
