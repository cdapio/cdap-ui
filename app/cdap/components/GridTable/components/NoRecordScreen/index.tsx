import React from 'react';
import { NoDataSVG } from 'components/GridTable/iconStore';
import { useStyles } from './styles';
import { Box } from '@material-ui/core';

export default function NoRecordPresent() {
  const classes = useStyles();
  return (
    <Box className={classes.noRecordWrapper}>
      <Box className={classes.innerWrapper}>
        {NoDataSVG}
        <p className={classes.firstHeadData}>No rows left in this sample</p>
        <p className={classes.secondHeadData}>Remove some recipe steps to view some data</p>
      </Box>
    </Box>
  );
}
