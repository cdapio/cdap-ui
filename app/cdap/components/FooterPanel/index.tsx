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
import { Box } from '@material-ui/core';
import { useCss } from './styles';
import { ColumnIcon, ZoomIn, ArrowIcon } from './images';

export default function({ showRecipePanelHandler }) {
  const classes = useCss();
  return (
    <Box className={classes.containerProps}>
      <Box className={classes.cont}>
        <Box className={classes.imgCont}>{ColumnIcon}</Box>
        <Box>
          <p className={classes.data}> Current data - 1000 rows and 30 columns</p>
        </Box>
        <Box className={classes.zoomCont}>
          {ZoomIn}
          <p className={classes.spanElement}> 100%</p>
          {ArrowIcon}
        </Box>
        <p className={classes.directivesCont}> Directives </p>
        <Box className={classes.recipeCont} onClick={showRecipePanelHandler}>
          <p> Recipe Steps</p>
          <p className={classes.spanElement1}> 10</p>
        </Box>
      </Box>
    </Box>
  );
}
