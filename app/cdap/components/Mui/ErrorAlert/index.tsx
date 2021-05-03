/*
 * Copyright © 2021 Cask Data, Inc.
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
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface IAlertProps {
  duration: number,
  open: boolean,
  onClose: () => any,
 }

 const useStyle = makeStyles((theme) => {
  // TODO Get from theme
  return {
    root: {
      fontSize: theme.typography.fontSize,
    },
  };
});

const ErrorAlert: React.FC<IAlertProps> = (props) => {
  const {
    children,
    duration,
    onClose,
    open,
  } = props;
  const classes = useStyle();
  return <Snackbar 
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
    autoHideDuration={ duration }
    onClose={ onClose }
    open={ open } 
    TransitionComponent={Slide}>
    <MuiAlert 
      elevation={6} 
      onClose={ onClose }
      severity="error" 
      classes={classes}>
      { children }
    </MuiAlert>
  </Snackbar>
}

export default ErrorAlert;
