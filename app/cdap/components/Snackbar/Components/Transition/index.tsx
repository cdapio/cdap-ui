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
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { addActionType, PREFIX } from 'components/Snackbar/Components/Transition/constants';
import { useStyles } from 'components/Snackbar/Components/Transition/styles';
import { ITransitionProps } from 'components/Snackbar/Components/Transition/types';
import T from 'i18n-react';
import React from 'react';

export default function({
  handleClose,
  isSuccess,
  messageToDisplay,
  transitionAction,
}: ITransitionProps) {
  const handleUndoOperation = () => {
    // TODO: this is the method used to undo the recent activity on transformations
  };
  const classes = useStyles();
  return (
    <Box>
      <Box className={classes.headFlex}>
        <Box className={classes.iconText}>
          {isSuccess ? (
            <CheckCircleOutlinedIcon
              className={classes.successIcon}
              data-testid={`snackbar-success-icon`}
            />
          ) : (
            <ErrorOutlineIcon
              className={classes.warningIcon}
              data-testid={`snackbar-failure-icon`}
            />
          )}
          <Typography
            className={isSuccess ? classes.successLabel : classes.failureLabel}
            variant="body1"
            component="span"
          >
            {isSuccess ? (
              <>{T.translate(`${PREFIX}.success`)}</>
            ) : (
              <>{T.translate(`${PREFIX}.failure`)}</>
            )}
          </Typography>
        </Box>
        <Box className={classes.operations}>
          <Typography
            className={classes.dismissSpan}
            onClick={() => handleUndoOperation()}
            variant="body1"
            component="span"
          >
            {transitionAction === addActionType ? (
              T.translate(`${PREFIX}.undo`)
            ) : (
              <Box>
                <CloseIcon
                  className={classes.closeIcon}
                  onClick={handleClose}
                  data-testid="snackbar-close-icon"
                />
              </Box>
            )}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" className={classes.message} component="span">
        {messageToDisplay}
      </Typography>
    </Box>
  );
}
