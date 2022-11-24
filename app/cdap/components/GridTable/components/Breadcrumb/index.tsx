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

import { Box, Typography, Button, IconButton } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { useStyles } from './styles';
import T from 'i18n-react';
import styled from 'styled-components';
import { blue } from '@material-ui/core/colors';
import { HelpIcon } from 'components/GridTable/IconStore/HelpIcon';

const CreatePipelineButton = styled(Button)`
  width: 162px;
  height: 36px;
  background-color: ${blue[500]};
  box-shadow: 0px 2px 4px rgba(70, 129, 244, 0.15);
  border-radius: 4px;
  font-weight: 400;
  font-size: 15px;
  color: #ffffff;
  text-align: center;
  padding-top: 6px;
  margin-right: 0;
  text-transform: none;
  &:hover {
    background-color: ${blue[500]};
    box-shadow: none;
    color: #ffffff;
  }
  &:active {
    box-shadow: none;
    background-color: ${blue[500]};
  }
`;

export default function({ datasetName, setOpenPipeline }) {
  const classes = useStyles();
  return (
    <Box className={classes.breadCombContainer}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link
          className={`${classes.breadcrumbLabel} ${classes.home}`}
          to={`/ns/${getCurrentNamespace()}/home`}
          data-testid="breadcrumb-home-text"
        >
          Home
        </Link>
        <Link
          className={`${classes.breadcrumbLabel} ${classes.dataset}`}
          to={`/ns/${getCurrentNamespace()}/datasources/${`select-dataset`}`}
          data-testid="breadcrumb-data-sources-text"
        >
          Data Sources
        </Link>
        <Typography color="textPrimary">{datasetName}</Typography>
      </Breadcrumbs>

      <Breadcrumbs separator=" ">
        <IconButton>
          <a href="https://cdap.atlassian.net/wiki/spaces/DOCS/overview">{HelpIcon}</a>
        </IconButton>
        <CreatePipelineButton onClick={() => setOpenPipeline(true)}>
          {T.translate('features.WranglerNewUI.Breadcrumb.labels.createPipeline')}
        </CreatePipelineButton>
      </Breadcrumbs>
    </Box>
  );
}
