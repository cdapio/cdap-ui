import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useStyles } from './styles';

const MatchMeter: React.FC<{ value: number }> = ({ value }) => {
  const classes = useStyles();

  const getInlineStyles = (): string => {
    if (value < 100) {
      return '#E97567';
    } else {
      return '#8BCC74';
    }
  };
  return (
    <>
      <Typography component="div" className={classes.progress}>
        <Typography component="div" className={classes.barOverflow}>
          <Typography
            style={{
              borderBottomColor: getInlineStyles(),
              borderRightColor: getInlineStyles(),
              transform: `rotate(${45 + value * 1.8}deg)`,
            }}
            component="div"
            className={classes.bar}
          ></Typography>
        </Typography>
        <Typography component="span" className={classes.value} style={{ color: getInlineStyles() }}>
          {value.toFixed(0)}%
        </Typography>
      </Typography>
    </>
  );
};

export default MatchMeter;
