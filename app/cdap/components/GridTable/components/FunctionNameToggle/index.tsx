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
import { Typography, Box } from '@material-ui/core';
import { useStyles } from 'components/GridTable/components/FunctionNameToggle/styles';
import T from 'i18n-react';
import { IFunctionNameToggleProps } from 'components/GridTable/components/FunctionNameToggle/types';
import SwitchInputComponent from 'components/common/Switch';

const PREFIX = 'features.WranglerNewUI.GridPage';

export default function({ setShowName, showName }: IFunctionNameToggleProps) {
  const classes = useStyles();
  return (
    <Box
      className={classes.functionWrapper}
      data-testid="transformations-toolbar-icons-function-name-toggler"
    >
      <Typography
        className={classes.typoClass}
        component="div"
        data-testid="name-toggle-child-label"
      >
        {T.translate(`${PREFIX}.toolbarIcons.labels.toggleDescription`)}
      </Typography>
      <SwitchInputComponent
        setShow={setShowName}
        show={showName}
        inputProps={{
          'aria-label': T.translate(`${PREFIX}.gridHeader.ariaLabels.functionsName`).toString(),
          'data-testid': 'transformations-toolbar-icons-function-name-toggler',
        }}
      />
    </Box>
  );
}
