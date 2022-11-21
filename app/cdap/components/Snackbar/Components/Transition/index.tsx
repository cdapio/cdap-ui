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
import T from 'i18n-react';
import React from 'react';
import styled, { css } from 'styled-components';

const addActionType = 'add';
const PREFIX = 'features.WranglerNewUI.Snackbar.labels';

export interface ITransitionProps {
  handleClose: () => void;
  isSuccess: boolean;
  transitionAction: string;
  message?: React.ReactNode;
}

const IconComponent = css`
  font-size: xx-large;
  color: #ffffff;
  position: relative;
  bottom: 4px;
  width: 18px;
  margin-right: 13px;
`;

const ErrorOutlineIconWrapper = styled(ErrorOutlineIcon)`
  ${IconComponent}
`;

const SuccessIconWrapper = styled(CheckCircleOutlinedIcon)`
  ${IconComponent}
`;

const CloseIconWrapper = styled(CloseIcon)`
  color: #ffffff;
  cursor: pointer;
`;

const TransitionTextWrapper = styled(Box)`
  display: flex;
`;

const TransitionWrapper = styled(TransitionTextWrapper)`
  justify-content: space-between;
`;

const TransitionLabel = styled(Typography)`
  color: #ffffff;
  line-height: 24px;
  font-weight: 500;
  letter-spacing: 0.15;
  font-size: 16px;
`;

const TransitionActionsWrapper = styled(TransitionTextWrapper)`
  gap: 13;
`;

const TransitionAction = styled(Typography)`
  display: block;
  color: #ffffff;
  cursor: pointer;
  line-height: 21px;
  font-weight: 400;
`;

const TransitionMessage = styled(Typography)`
  color: #ffffff;
  padding-left: 31px;
  font-size: 14px;
`;

export default function({ handleClose, isSuccess, message, transitionAction }: ITransitionProps) {
  const handleUndoOperation = () => {
    // TODO: this is the method used to undo the recent activity on transformations
  };

  return (
    <Box>
      <TransitionWrapper>
        <TransitionTextWrapper>
          {isSuccess ? (
            <SuccessIconWrapper data-testid={`snackbar-success-icon`} />
          ) : (
            <ErrorOutlineIconWrapper data-testid={`snackbar-failure-icon`} />
          )}
          <TransitionLabel variant="body1" component="span">
            {isSuccess ? T.translate(`${PREFIX}.success`) : T.translate(`${PREFIX}.failure`)}
          </TransitionLabel>
        </TransitionTextWrapper>
        <TransitionActionsWrapper>
          <TransitionAction onClick={() => handleUndoOperation()} variant="body1" component="span">
            {transitionAction === addActionType ? (
              T.translate(`${PREFIX}.undo`)
            ) : (
              <Box>
                <CloseIconWrapper onClick={handleClose} data-testid="snackbar-close-icon" />
              </Box>
            )}
          </TransitionAction>
        </TransitionActionsWrapper>
      </TransitionWrapper>
      <TransitionMessage variant="body1" component="span">
        {message}
      </TransitionMessage>
    </Box>
  );
}
