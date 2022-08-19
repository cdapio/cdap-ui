import { Tooltip, TooltipProps } from '@material-ui/core';
import * as React from 'react';
import { useStyles } from './styles';

const CustomTooltip = (props: TooltipProps) => {
  const classes = useStyles();

  return <Tooltip arrow classes={classes} {...props} />;
};

export default CustomTooltip;
