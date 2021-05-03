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

import React from 'react';
import {Button} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles((theme) => {
  // TODO Get from theme
  return {
    containedPrimary: {
      fontFamily: 'Roboto',
      fontSize: '13px',
      backgroundColor: '#3367d6',
      letterSpacing: 'normal',
      lineHeight: '32px',
      padding: '0 12px',
      '&$disabled': {
        backgroundColor: '#ffffff',
        color: 'rgba(0, 0, 0, .54)'
      },
      '&:hover': {
        backgroundColor: '#3367d6',
      }
    },
    disabled: {},
  };
});

interface IPrimaryButtonProps {
  disabled: boolean;
  onClick: () => any;
  startIcon?: any;
}

const RaisedPrimaryButton: React.FC<IPrimaryButtonProps> = (props) => {
  const classes = useStyle();
  return <Button
    classes={classes}
    disabled={props.disabled}
    onClick={props.onClick}
    startIcon={props.startIcon}
    variant="contained"
    color="primary">
    {props.children}
  </Button>;
}

export default RaisedPrimaryButton;