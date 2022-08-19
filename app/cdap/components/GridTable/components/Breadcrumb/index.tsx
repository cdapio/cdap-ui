import { Box, Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useStyles } from 'components/Datasets/Components/Breadcrumb/styles';
import React from 'react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Link } from 'react-router-dom';

const BreadCumb = ({ datasetName }) => {
  const classes = useStyles();
  return (
    <Box className={classes.breadCombContainer}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" to={`/ns/${getCurrentNamespace()}/home`}>
          Home
        </Link>
        <Link color="inherit" to={`/ns/${getCurrentNamespace()}/datasets/${`select-dataset`}`}>
          Select Dataset
        </Link>
        <Typography color="textPrimary">{datasetName}</Typography>
      </Breadcrumbs>
    </Box>
  );
};

export default BreadCumb;
