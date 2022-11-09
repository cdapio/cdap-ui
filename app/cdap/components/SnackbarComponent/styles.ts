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
import { green } from '@material-ui/core/colors';

export const useStyles = makeStyles({
  snackBarDiv: {
    padding: '10px',
    display: 'block',
    border: '1px solid #4BAF4F',
    boxShadow: '-3px 4px 15px rgba(68, 132, 245, 0.25)',
    height: '148px',
    width: '401px',
    bottom: '10% !important',
    backgroundColor: green[50],
  },
});
