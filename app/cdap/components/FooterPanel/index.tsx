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
import T from 'i18n-react';

export default function({ showRecipePanelHandler, showAddTransformationHandler }) {
  const classes = useCss();
  return (
    <Box className={classes.containerProps}>
      <Box className={classes.cont}>
        <Box className={classes.imgCont}>{ColumnIcon}</Box>
        <Box>
          <p className={classes.data}>
            {' '}
            {T.translate('features.WranglerNewFooterPanel.currentData')}
          </p>
        </Box>
        <Box className={classes.zoomCont}>
          {ZoomIn}
          <p className={classes.spanElement}> 100%</p>
          {ArrowIcon}
        </Box>
        <p className={classes.directivesCont} onClick={showAddTransformationHandler}>
          {T.translate('features.WranglerNewFooterPanel.transformations')}
        </p>
        <p className={classes.directivesCont}>
          {' '}
          {T.translate('features.WranglerNewFooterPanel.directives')}{' '}
        </p>
        <Box className={classes.recipeCont} onClick={showRecipePanelHandler} data-testid='footer-panel-box-click'>
          <p> {T.translate('features.WranglerNewFooterPanel.recipeSteps')}</p>
          <p className={classes.spanElement1}> 10</p>
        </Box>
      </Box>
    </Box>
  );
}
