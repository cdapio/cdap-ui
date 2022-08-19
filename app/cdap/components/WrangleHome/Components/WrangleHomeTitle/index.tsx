import { Box, Typography } from '@material-ui/core';
import { UnderLine } from 'components/WrangleHome/icons';
import React from 'react';
import { useStyles } from './styles';

const WrangleHomeTitle = ({ title }) => {
  const classes = useStyles();
  return (
    <Box className={classes.dataExplorationWrapper}>
      <Typography className={classes.dataExploration} data-testid="wrangler-home-title-text">{title}</Typography>
      {UnderLine}
    </Box>
  );
};
export default WrangleHomeTitle;
