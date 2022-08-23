import { Breadcrumbs, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useStyles } from 'components/Datasets/Components/Breadcrumb/styles';
import { DownloadIcon, AddConnection } from 'components/Datasets/iconStore';
import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const BreadCumb = () => {
  const classes = useStyles();
  return (
    <Box className={classes.breadCombContainer} data-testid="bread-comb-container-parent">
      <Box>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link color="inherit" to={`/ns/${getCurrentNamespace()}/home`}>
            Home
          </Link>
          <Typography color="textPrimary">Datasets</Typography>
        </Breadcrumbs>
      </Box>

      <Box className={classes.importDataContainer}>
        <Box className={classes.importData}>
          <AddConnection />
          <Box className={classes.breadCrumbTyporgraphy}>Add connection</Box>
        </Box>
        <Box className={classes.importData}>
          <DownloadIcon />
          <Box className={classes.breadCrumbTyporgraphy}>Import data</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BreadCumb;
