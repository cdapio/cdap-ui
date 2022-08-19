import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useStyles } from 'components/Datasets/Components/Breadcrumb/styles';
import { DownloadIcon, PrevPageIcon } from 'components/Datasets/iconStore';
import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';

const BreadCumb = () => {
  const classes = useStyles();
  return (
    <Box className={classes.breadCombContainer} data-testid="bread-comb-container-parent">
      <Box className={classes.selectPrevPage}>
        <Link to={`/ns/${getCurrentNamespace()}/home`} style={{ textDecoration: 'none' }}>
          <PrevPageIcon />
        </Link>
        <Typography>Select Dataset</Typography>
      </Box>
      <Box className={classes.importData}>
        <DownloadIcon />
        <Typography>Import Data</Typography>
      </Box>
    </Box>
  );
};

export default BreadCumb;
