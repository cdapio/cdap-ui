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

import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
  labelsContainerCanSample: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '4px',
    '&:hover': {
      cursor: 'default',
      '&>.MuiBox-root': {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
      },
    },
    '&>.MuiBox-root': {
      display: 'none',
    },
  },
  labelStylesCanSample: {
    maxWidth: '145px',
    fontSize: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  wranglingHover: {
    display: 'flex',
    textDecoration: 'none',
    gap: '10px',
  },
  wrangleTypography: {
    color: '#4681F4 !important',
    fontSize: '14px',
  },
});
