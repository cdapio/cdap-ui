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
      data-testid="snackbar-alert"
    />
  );
}
