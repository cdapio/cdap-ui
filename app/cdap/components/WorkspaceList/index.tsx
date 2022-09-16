import React from 'react';
import Box from '@material-ui/core/Box';
import { useStyles } from './style';
import OngoingDataExploration from 'components/WrangleHome/Components/OngoingDataExploration';
import { Breadcrumbs, Typography } from '@material-ui/core';
import { getCurrentNamespace } from 'services/NamespaceStore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link } from 'react-router-dom';

const WorkspaceList = () => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Box className={classes.header}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          className={classes.breadcrumb}
        >
          <Link color="inherit" to={`/ns/${getCurrentNamespace()}/home`}>
            <Typography className={classes.text}> Home</Typography>
          </Link>
          <Typography className={classes.text}>Workspaces</Typography>
        </Breadcrumbs>
      </Box>
      <Box className={classes.explorationList}>
        <OngoingDataExploration />
      </Box>
    </Box>
  );
};
export default WorkspaceList;
