/*
 * Copyright © 2017-2018 Cask Data, Inc.
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
import * as React from 'react';
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import { Divider } from '@material-ui/core';
import { useErrorStyles } from './styles';

export interface State extends SnackbarOrigin {
  open: boolean;
}

export default function PositionedSnackbar(props) {
  const classes = useErrorStyles();
  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'bottom',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = state;

  React.useEffect(() => {
    handleClick();
    setTimeout(() => {
      handleClose();
    }, 7000);
  }, []);

  const handleClick = () => () => {
    setState({ open: true, ...state });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
    props.handleCloseError();
  };

  const TransitionComponent = () => {
    return (
      <div>
        <div className={classes.headFlex}>
          <h5 className={classes.errorHead}>
            <WarningRoundedIcon className={classes.warningIcon} />
            &nbsp;Error
          </h5>
          <span className={classes.dismissSpan} onClick={() => handleClose()}>
            Dismiss
          </span>
        </div>
        <Divider />
        <p className={classes.errorMessage}>Failed to retrieve sample</p>
      </div>
    );
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      key={vertical + horizontal}
      TransitionComponent={TransitionComponent}
      className={classes.snackBarDiv}
    />
  );
}
