/*
 * Copyright © 2022 Cask Data, Inc.
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

import { Breadcrumbs, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useStyles } from 'components/ConnectionList/Components/SubHeader/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import SaveAltRoundedIcon from '@material-ui/icons/SaveAltRounded';
import T from 'i18n-react';

export default function SubHeader() {
  const classes = useStyles();
  return (
    <Box className={classes.breadCombContainer} data-testid="bread-comb-container-parent">
      <Box>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link
            color="inherit"
            to={`/ns/${getCurrentNamespace()}/home`}
            data-testid="breadcrumb-home-link"
          >
            {T.translate('features.WranglerNewUI.Breadcrumb.labels.wranglerHome')}
          </Link>
          <Typography>
            {' '}
            {T.translate('features.WranglerNewUI.Breadcrumb.labels.connectionsList')}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box className={classes.importDataContainer}>
        <Box className={classes.importData}>
          <AddCircleOutlineOutlinedIcon className={classes.subHeaderIcon} />
          <Box className={classes.breadCrumbTyporgraphy}>Add connection</Box>
        </Box>
        <Box className={classes.importData}>
          <SaveAltRoundedIcon className={classes.subHeaderIcon} />
          <Box className={classes.breadCrumbTyporgraphy}>Import data</Box>
        </Box>
      </Box>
    </Box>
  );
}
