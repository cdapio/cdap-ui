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

import Box from '@material-ui/core/Box';
import { useStyles } from 'components/ConnectionList/Components/SubHeader/styles';
import React from 'react';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import SaveAltRoundedIcon from '@material-ui/icons/SaveAltRounded';
import Breadcrumb from 'components/GridTable/components/Breadcrumb';
import { CONNECTION_LIST_BREADCRUMB_OPTIONS } from 'components/ConnectionList/Components/SubHeader/constants';

export default function SubHeader() {
  const classes = useStyles();
  return (
    <Box className={classes.breadCombContainer} data-testid="breadcrumb-container-parent">
      <Box>
        <Breadcrumb breadcrumbsList={CONNECTION_LIST_BREADCRUMB_OPTIONS} />
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
