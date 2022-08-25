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
import If from 'components/shared/If';
import LoadingSVG from 'components/shared/LoadingSVG';
import React, { useState } from 'react';
import OngoingDataExploration from './Components/OngoingDataExploration';
import WrangleCard from './Components/WrangleCard';
import WrangleHomeTitle from './Components/WrangleHomeTitle';
import { GradientLine, HeaderImage } from './icons';
import { useStyles } from './styles';

const WranglerHomeNew = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const toggleLoader = () => {
    setLoading(!loading);
  };

  return (
    <Box className={classes.wrapper} data-testid="wrangler-home-new-parent">
      <Box className={classes.subHeader}>
        <Typography className={classes.welcome}>
          Hello! <br />
          Welcome to Wrangler
        </Typography>
        <Box> {HeaderImage}</Box>
      </Box>
      {GradientLine}

      <Box>
        <div className={classes.headerTitle}>
          <WrangleHomeTitle title="Start data exploration" />
          <div className={classes.viewMore}>View More</div>
        </div>
        <WrangleCard />
        <div className={classes.headerTitle}>
          <WrangleHomeTitle title="Continue ongoing data explorations, pick up where you left off" />
          <div className={classes.viewMore}>View More</div>
        </div>
        <OngoingDataExploration toggleLoader={toggleLoader} />
        <If condition={loading}>
          <div className={classes.loadingContainer}>
            <LoadingSVG />
          </div>
        </If>
      </Box>
    </Box>
  );
};

export default WranglerHomeNew;
