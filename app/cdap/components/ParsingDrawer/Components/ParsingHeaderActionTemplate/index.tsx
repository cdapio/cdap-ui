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
import { IMPORT_SCHEMA } from 'components/ParsingDrawer/constants';
import { useStyles } from 'components/ParsingDrawer/styles';
import React from 'react';

export default function(props) {
  const classes = useStyles();

  return (
    <Box className={classes.pointerStyles}>
      <img
        className={classes.importIconStyles}
        src="/cdap_assets/img/import.svg"
        alt="import schema icon"
      />
      <span className={classes.importSchemaTextStyles}>{IMPORT_SCHEMA}</span>
    </Box>
  );
}
