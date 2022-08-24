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

import React from 'react';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';
import { useStyles } from 'components/ConnectionList/Components/SubHeader/styles';
import { DownloadIcon, PrevPageIcon } from 'components/ConnectionList/iconStore';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';

const SubHeader = () => {
  const classes = useStyles();
  return (
    <Box className={classes.breadCombContainer} data-testid="sub-header-container-parent">
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

export default SubHeader;
