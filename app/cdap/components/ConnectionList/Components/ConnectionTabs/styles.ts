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
import { blue } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
  connectionsTabsParent: {
    overflow: 'scroll',
    height: 'calc(100vh - 200px)',
  },
  boxStyles: {
    zIndex: 1,
    height: '100%',
  },
  tabIndicatorStyles: {
    backgroundColor: blue[500],
    color: 'white !important',
    width: '100%',
    zIndex: 2,
  },
  indicator: {
    color: '#fff',
  },
  tabsContainer: {
    '& .MuiTabs-scroller': {
      '& .canBrowseHover': {
        display: 'none',
      },
      '& .MuiButtonBase-root.Mui-selected': {
        color: '#fff',
        '& .canBrowseHover': {
          display: 'inline',
        },
        '& .canBrowseNormal': {
          display: 'none',
        },
      },
    },
  },
  wrangleTab: {
    '&:hover': {
      backgroundColor: '#EFF0F2',
      cursor: 'default',
    },
  },
  labelContainerBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  labelsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '4px',
  },
  labelStyles: {
    fontSize: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  labelsContainerCanSample: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '4px',
    '&:hover': {
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
    outline: 0,
    border: 0,
  },
  wrangleTypography: {
    color: '#4681F4 !important',
    fontSize: '14px',
  },
  eachConnectionStyle: {
    width: '100%',
  },
}));
