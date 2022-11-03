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

export const useStyles = makeStyles((theme) => ({
  warningIcon: {
    fontSize: 'xx-large',
    color: '#ffffff',
    position: 'relative',
    bottom: 4,
    width: 18,
    marginRight: 13,
  },
  successIcon: {
    fontSize: 'xx-large',
    color: '#ffffff',
    position: 'relative',
    bottom: 4,
    width: 18,
    marginRight: 13,
  },
  successLabel: {
    color: '#ffffff',
    lineHeight: '24px',
    fontWeight: 500,
    letterSpacing: 0.15,
    fontSize: 16,
  },
  failureLabel: {
    color: '#ffffff',
    lineHeight: '24px',
    fontWeight: 500,
    letterSpacing: 0.15,
    fontSize: 16,
  },
  dismissSpan: {
    display: 'block',
    color: '#ffffff',
    cursor: 'pointer',
    lineHeight: '21px',
    fontWeight: 400,
  },
  iconText: {
    display: 'flex',
  },
  message: {
    color: '#ffffff',
    paddingLeft: 31,
    fontSize: 14,
  },
  headFlex: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  operations: {
    display: 'flex',
    gap: 13,
  },
  closeIcon: {
    color: '#ffffff',
    cursor: 'pointer',
  },
}));
