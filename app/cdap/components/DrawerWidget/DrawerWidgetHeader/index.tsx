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
import React from 'react';
import { useStyles } from 'components/DrawerWidget/styles';
import { UnderLineSVG, ImportIcon } from 'components/DrawerWidget/iconStore';
import { IDrawerWidgetHeaderProps } from 'components/DrawerWidget/types';
import T from 'i18n-react';

export default function({ headingText }: IDrawerWidgetHeaderProps) {
  const classes = useStyles();
  return (
    <Box className={classes.containerStyles}>
      <Box className={classes.headingStyles}>
        <Typography className={classes.headingTextStyles}>{headingText}</Typography>
        <UnderLineSVG />
      </Box>
      <Box className={classes.importStyles}>
        <ImportIcon />
        <Typography className={classes.importTextStyles}>
          {T.translate('features.WranglerNewUI.WranglerNewParsingDrawer.importSchema')}
        </Typography>
      </Box>
    </Box>
  );
}
