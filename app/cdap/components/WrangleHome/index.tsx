import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React from 'react';
import OngoingDataExploration from './Components/OngoingDataExploration';
import WrangleCard from './Components/WrangleCard';
import WrangleHomeTitle from './Components/WrangleHomeTitle';
import { GradientLine } from './icons';
import { HeaderImage } from './icons';
import { useStyles } from './styles';

const WranglerHomeNew = () => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Box className={classes.subHeader}>
        <Typography className={classes.welcome}>
          Hi David, <br />
          Welcome to Wrangler
        </Typography>
        <Box> {HeaderImage}</Box>
      </Box>
      {GradientLine}

      <Box>
        <WrangleHomeTitle title="Start data exploration" />
        <WrangleCard />
        <WrangleHomeTitle title="Continue ongoing data explorations, pick up where you left off" />
        <OngoingDataExploration />
      </Box>
    </Box>
  );
};

export default WranglerHomeNew;
