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

import { Box, Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useStyles } from 'components/GridTable/components/Breadcrumb/styles';
import { getSourcePath } from 'components/GridTable/components/Breadcrumb/utils';
import T from 'i18n-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';

export default function BreadCrumb({ workspaceName, location }) {
  const classes = useStyles();

  return (
    <Box className={classes.breadCombContainer}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link
          className={`${classes.breadcrumbLabel} ${classes.home}`}
          to={`/ns/${getCurrentNamespace()}/home`}
          data-testid="breadcrumb-home-text"
        >
          {T.translate('features.WranglerNewUI.Breadcrumb.labels.wrangleHome')}
        </Link>
        {location?.state?.from !==
          T.translate('features.WranglerNewUI.Breadcrumb.labels.wrangleHome') && (
          <Link
            className={`${classes.breadcrumbLabel}`}
            to={`/ns/${getCurrentNamespace()}/${getSourcePath(location)}`}
            data-testid="breadcrumb-data-sources-text"
          >
            {location?.state?.from}
          </Link>
        )}
        <Typography color="textPrimary" data-testid="breadcrumb-workspace-name">
          {workspaceName}
        </Typography>
      </Breadcrumbs>
    </Box>
  );
}
