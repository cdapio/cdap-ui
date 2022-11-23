/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { Breadcrumbs, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DataPrepStore from 'components/DataPrep/store';
import LoadingSVG from 'components/shared/LoadingSVG';
import { getWidgetData } from 'components/WidgetSVG/utils';
import { useStyles } from 'components/WorkspaceList/style';
import OngoingDataExplorations from 'components/WrangleHome/Components/OngoingDataExplorations';
import { WORKSPACES } from 'components/WrangleHome/Components/OngoingDataExplorations/constants';
import T from 'i18n-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';

export default function() {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (
      !(
        DataPrepStore.getState().dataprep.connectorsWithIcons &&
        DataPrepStore.getState().dataprep.connectorsWithIcons.length > 0
      )
    ) {
      getWidgetData();
    }
  }, []);
  const classes = useStyles();
  return (
    <Box className={classes.wrapper} data-testid="workspace-list-parent">
      <Box className={classes.header} data-testid="workspace-list-body">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          className={classes.breadcrumb}
        >
          <Link color="inherit" to={`/ns/${getCurrentNamespace()}/home`}>
            <Typography className={classes.text} data-testid="link-type-wrangle-home">
              {T.translate('features.WranglerNewUI.Breadcrumb.labels.wrangleHome')}
            </Typography>
          </Link>
          <Typography
            className={`${classes.text} ${classes.textWorkspaces}`}
            data-testid="breadcrumb-label-workspaces"
          >
            {T.translate('features.WranglerNewUI.Breadcrumb.labels.workSpaces')}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box className={classes.explorationList}>
        <OngoingDataExplorations fromAddress={WORKSPACES} setLoading={setLoading} />
      </Box>
      {loading && (
        <Box className={classes.loadingContainer} data-testid="workspace-loading-icon">
          <LoadingSVG />
        </Box>
      )}
    </Box>
  );
}
