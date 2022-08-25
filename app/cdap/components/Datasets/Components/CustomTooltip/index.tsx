import { Box, Tooltip, TooltipProps } from '@material-ui/core';
import * as React from 'react';
import { useStyles } from './styles';

const CustomTooltip = (props: TooltipProps) => {
  const classes = useStyles();

  return (
    <Box data-testid="tooltip-parent">
      <Tooltip arrow classes={classes} {...props} />
    </Box>
  );
};

export default CustomTooltip;
