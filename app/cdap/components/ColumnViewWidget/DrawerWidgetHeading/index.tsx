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
import { useStyles } from 'components/ColumnViewWidget/DrawerWidgetHeading/styles';
import { UnderlineIcon } from 'components/ColumnViewWidget/IconStore/Underline';
import { IDrawerWidgetHeading } from 'components/ColumnViewWidget/DrawerWidgetHeading/types';

export default function({ headingText }: IDrawerWidgetHeading) {
  const classes = useStyles();

  return (
    <Typography className={classes.headingStyles} component="span">
      <Typography
        className={classes.headingTextStyles}
        component="div"
        data-testid="drawer-widget-heading-text"
      >
        {headingText}
      </Typography>
      {UnderlineIcon}
    </Typography>
  );
}
