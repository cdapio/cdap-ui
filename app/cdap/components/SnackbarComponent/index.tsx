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
import Snackbar from '@material-ui/core/Snackbar';
import { useErrorStyles } from './styles';
import { IState } from './types';
import { TransitionComponent } from './Components/TransitionComponent';

const PositionedSnackbar = (props) => {
  const classes = useErrorStyles();
  const [state, setState] = React.useState<IState>({
    open: true,
    vertical: 'bottom',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = state;

  React.useEffect(() => {
    handleClick();
    setTimeout(() => {
      handleClose();
    }, 5000);
  }, []);

  const handleClick = () => () => {
    setState({ open: true, ...state });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
    props.handleCloseError();
  };

  const properties = {
    close: () => handleClose(),
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      key={vertical + horizontal}
      TransitionComponent={() => TransitionComponent(properties)}
      className={classes.snackBarDiv}
    />
  );
};

export default PositionedSnackbar;
