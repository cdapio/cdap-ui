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

import { Box } from '@material-ui/core';
import React from 'react';
import { Underline } from 'components/DrawerWidget/DrawerWidgetHeading/IconStore/iconStore';
import { useStyles } from 'components/DrawerWidget/styles';
import { IDrawerWidgetHeadingProps } from 'components/DrawerWidget/DrawerWidgetHeading/types';
import T from 'i18n-react';
import RenderLabel from 'components/ColumnInsightsPanel/components/common/RenderLabel';

export default function({ headingText }: IDrawerWidgetHeadingProps) {
  const classes = useStyles();

  return (
    <Box className={classes.headingStyles}>
      <RenderLabel fontSize={20}>
        <> {T.translate(`${headingText}`).toString()}</>
      </RenderLabel>
      <Underline />
    </Box>
  );
}
