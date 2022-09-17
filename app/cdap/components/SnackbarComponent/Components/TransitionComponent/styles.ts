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
    fontSize: '20px !important',
  },
  errorHead: {
    color: '#E97567',
    fontSize: '20px !important',
  },
  dismissSpan: {
    display: 'block',
    fontSize: '14px',
    color: blue[500],
    cursor: 'pointer',
  },
  errorMessage: {
    color: grey[900],
    fontSize: '14px',
    padding: '10px',
  },
  headFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
