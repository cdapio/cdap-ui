/*
 * Copyright © 2017-2018 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { Box, Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useStyles } from 'components/ConnectionList/Components/SubHeader/styles';
import React from 'react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Link } from 'react-router-dom';

const BreadCrumb = ({ datasetName }) => {
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

export default BreadCrumb;
