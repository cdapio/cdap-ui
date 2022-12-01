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

import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { getWidgetData } from 'components/WidgetSVG/utils';
import WrangleCard from 'components/WrangleHome/Components/WrangleCard/index';
import WrangleHomeTitle from 'components/WrangleHome/Components/WrangleHomeTitle/index';
import { GradientLine, HeaderImage } from 'components/WrangleHome/icons';
import { useStyles } from 'components/WrangleHome/styles';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import OngoingDataExplorations from './Components/OngoingDataExplorations';

export default function() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const [viewAllLink, toggleViewAllLink] = useState<boolean>(false);

  useEffect(() => {
    getWidgetData();
  }, []);

  return (
    <Box className={classes.wrapper} data-testid="wrangler-home-new-parent">
      <Box className={classes.subHeader}>
        <Typography className={classes.welcomeCard}>
          Hello! <br />
          Welcome to Wrangler
        </Typography>
        <Box> {HeaderImage}</Box>
      </Box>
      {GradientLine}

      <Box>
        <Box className={classes.headerTitle}>
          <WrangleHomeTitle
            title={T.translate('features.WranglerNewUI.HomePage.labels.connectorTypes.title')}
          />
          {viewAllLink && (
            <Box className={classes.viewMore}>
              <Link
                color="inherit"
                to={`/ns/${getCurrentNamespace()}/datasources/Select Dataset`}
                data-testid="connector-types-view-all"
              >
                {T.translate('features.WranglerNewUI.HomePage.labels.common.viewAll')}
              </Link>{' '}
            </Box>
          )}
        </Box>
        <WrangleCard toggleViewAllLink={toggleViewAllLink} />
        <Box className={classes.headerTitle}>
          <WrangleHomeTitle
            title={T.translate('features.WranglerNewUI.HomePage.labels.workspaces.title')}
          />
          <Box className={classes.viewMore}>
            {T.translate('features.WranglerNewUI.HomePage.labels.common.viewAll')}
          </Box>
        </Box>
        <OngoingDataExplorations />
      </Box>
    </Box>
  );
}
