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

<<<<<<< HEAD
import Snackbar from '@material-ui/core/Snackbar';
import Transition from 'components/Snackbar/Components/Transition/index';
import { useStyles } from 'components/Snackbar/styles';
import { ISnackbarProps } from 'components/Snackbar/types';
import React, { useEffect, useState } from 'react';

export default function({
  handleCloseError,
  description = '',
  isSuccess,
  snackbarAction,
}: ISnackbarProps) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    setIsOpen(true);
    const timer = setTimeout(() => {
      setIsOpen(false);
      handleCloseError();
    }, 5000);
    return () => {
      setIsOpen(true);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    handleCloseError();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      open={isOpen}
      classes={{
        anchorOriginTopLeft: classes.anchor,
        root: classes.root,
      }}
      TransitionComponent={() => (
        <Transition
          handleClose={() => handleClose()}
          isSuccess={isSuccess}
          messageToDisplay={description}
          transitionAction={snackbarAction}
        />
      )}
      className={isSuccess ? classes.success : classes.error}
=======
import { green, red } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import Transition from 'components/Snackbar/Components/Transition/index';
import { ISnackbarProps } from 'components/Snackbar/types';
import React, { useEffect } from 'react';
import styled from 'styled-components';

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
>>>>>>> ba3605ebdc65278966647c11902fe9904c7c7ab7
      data-testid="snackbar-alert"
    />
  );
}
