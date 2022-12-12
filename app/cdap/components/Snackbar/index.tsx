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

import { green, red } from '@material-ui/core/colors';
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar';
import Transition from 'components/Snackbar/components/Transition';
import React from 'react';
import styled from 'styled-components';

export interface ISnackbarProps extends SnackbarProps {
  handleClose: () => void;
  isSuccess?: boolean;
  snackbarAction?: string;
}

export interface ISnackbar {
  open: boolean;
  message?: string;
  isSuccess?: boolean;
}

const CustomizedSnackbar = styled(Snackbar)`
  border-radius: 4px;
  width: 100%;
  top: 48px;
  background-color: ${(props) => (props.isSuccess ? green[600] : red[600])};
  padding: 15px 18px 14px 18px;
  display: block;
  min-height: 76px;
  left: 0;
  z-index: 9;
`;

export default function({
  message = '',
  isSuccess,
  snackbarAction,
  open,
  handleClose,
}: ISnackbarProps) {
  return (
    <CustomizedSnackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={open}
      isSuccess={isSuccess}
      TransitionComponent={() => (
        <Transition
          handleClose={handleClose}
          isSuccess={isSuccess}
          message={message}
          transitionAction={snackbarAction}
        />
      )}
      data-testid="snackbar-alert"
    />
  );
}
