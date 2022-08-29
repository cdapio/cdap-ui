import React from 'react';
import Box from '@material-ui/core/Box';
import { useStyles } from './style';

const WorkspaceList = () => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Box className={classes.header}></Box>
      <Box></Box>
    </Box>
  );
};
export default WorkspaceList;
