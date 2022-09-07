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
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import { Divider } from '@material-ui/core';
import { useStyles } from './styles';

export default function TransitionComponent(props) {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.headFlex}>
        <h5 className={classes.errorHead}>
          <WarningRoundedIcon className={classes.warningIcon} />
          &nbsp;Error
        </h5>
        <span
          role="button"
          tabIndex={0}
          className={classes.dismissSpan}
          onClick={() => props.close()}
        >
          Dismiss
        </span>
      </div>
      <Divider />
      <p className={classes.errorMessage}>Failed to retrieve sample</p>
    </div>
  );
}
