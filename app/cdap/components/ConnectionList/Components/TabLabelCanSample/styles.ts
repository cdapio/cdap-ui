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

import { makeStyles } from '@material-ui/styles';
import blue from '@material-ui/core/colors/blue';

const useStyles = makeStyles({
  labelsContainerCanSample: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '4px',
    '& .wranglingHover': {
      display: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      gap: '10px',
      border: 0,
      outline: 0,
      '& .MuiTypography-root': {
        color: blue[500],
        fontSize: '14px',
        letterSpacing: '0.15px',
        fontWeight: 400,
      },
    },
    '&:hover': {
      cursor: 'default',
      '& .wranglingHover': {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        background: 'none',
      },
    },
  },
  labelStylesCanSample: {
    maxWidth: '145px',
    fontSize: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
  },
  wrangleTypography: {
    fontSize: '14px',
  },
  wrangleButton: {
    color: blue[500],
  },
});

export default useStyles;
