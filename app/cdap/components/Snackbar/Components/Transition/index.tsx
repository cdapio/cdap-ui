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
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutline';
import { Box, Typography } from '@material-ui/core';
import { useStyles } from './styles';
import CloseIcon from '@material-ui/icons/Close';
import T from 'i18n-react';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { ITransitionComponentProps } from './types';

export default function({
  handleClose,
  isSuccess,
  messageToDisplay,
  actionType,
}: ITransitionComponentProps) {
  const undoActivity = () => {
    // method where the recent activity on transformations in undone
  };
  const classes = useStyles();
  return (
    <Box>
      <Box className={classes.headFlex}>
        <Box className={classes.iconText}>
          {isSuccess ? (
            <CheckCircleOutlinedIcon className={classes.successIcon} />
          ) : (
            <ErrorOutlineIcon className={classes.warningIcon} />
          )}
          <Typography
            variant="body1"
            className={isSuccess ? classes.successLabel : classes.failureLabel}
          >
            {isSuccess ? (
              <>{T.translate('features.WranglerNewUI.Snackbar.labels.success')}</>
            ) : (
              <>{T.translate('features.WranglerNewUI.Snackbar.labels.failure')}</>
            )}
          </Typography>
        </Box>
        <Box className={classes.operations}>
          <Typography
            variant="body1"
            className={classes.dismissSpan}
            onClick={() => undoActivity()}
          >
            {actionType === 'add' ? (
              'Undo'
            ) : (
              <Box>
                <CloseIcon
                  className={classes.cross}
                  onClick={handleClose}
                  data-testid="snackbar-close-icon"
                />
              </Box>
            )}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" className={classes.message}>
        {messageToDisplay}
      </Typography>
    </Box>
  );
}
