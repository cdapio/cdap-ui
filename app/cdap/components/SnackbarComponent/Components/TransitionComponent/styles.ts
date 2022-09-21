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
import { makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { grey } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
  warningIcon: {
    color: '#E97567',
    marginRight: '10px',
  },
  successIcon: {
    color: '#4BAF4F',
    marginRight: '10px',
  },
  successLabel: {
    color: '#4BAF4F',
    fontSize: '20px !important',
    lineHeight: '20px',
  },
  failureLabel: {
    color: '#E97567',
    fontSize: '20px !important',
    lineHeight: '20px',
  },
  dismissSpan: {
    display: 'block',
    fontSize: '14px',
    color: '#4681F4',
    cursor: 'pointer',
    lineHeight: '21px',
    fontWeight: 400,
  },
  iconText: {
    display: 'flex',
  },
  message: {
    color: '#000000',
    fontSize: '14px',
    padding: '10px 30px 0px 30px',
  },
  headFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '15px',
  },
}));
