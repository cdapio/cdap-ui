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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Box, Divider, Typography } from '@material-ui/core';
import { useStyles } from './styles';
import { SUCCESS_LABEL, FAILURE_LABEL } from './constants';

const TransitionComponent = (props) => {
  const classes = useStyles();
  return (
    <Box>
      <Box className={classes.headFlex}>
        <Box className={classes.iconText}>
          {props.isSuccess ? (
            <CheckCircleIcon fontSize="large" className={classes.successIcon} />
          ) : (
            <WarningRoundedIcon fontSize="large" className={classes.warningIcon} />
          )}
          <Typography
            variant="body1"
            className={props.isSuccess ? classes.successLabel : classes.failureLabel}
          >
            {props.isSuccess ? <>{SUCCESS_LABEL}</> : <>{FAILURE_LABEL}</>}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" className={classes.dismissSpan} onClick={() => props.close()}>
            Dismiss
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Typography variant="body1" className={classes.message}>
        {props?.messageToDisplay}
      </Typography>
    </Box>
  );
};

export default TransitionComponent;
