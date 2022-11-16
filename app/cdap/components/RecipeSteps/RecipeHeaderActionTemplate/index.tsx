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

import React from 'react';
import { useStyles } from 'components/RecipeSteps/styles';
import { DownloadIcon, KebabIcon } from 'components/RecipeSteps/iconStore';
import { Box } from '@material-ui/core';

export default function() {
  const classes = useStyles();

  return (
    <Box className={classes.downloadMenuActionWrapper} data-testid="header-action-template-parent">
      <Box className={classes.importIconStyles} data-testid="header-action-download-icon">
        {DownloadIcon}
      </Box>
      <Box className={classes.kebabMenuStyle} data-testid="header-action-kebab-icon">
        {KebabIcon}
      </Box>
    </Box>
  );
}
