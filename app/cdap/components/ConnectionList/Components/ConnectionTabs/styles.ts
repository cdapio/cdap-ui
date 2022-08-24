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

export const useStyles = makeStyles((theme) => ({
  boxStyles: {
    width: '300px',
    borderRight: '1px dashed #DADCE0',
    zIndex: 1,
    height: '100%',
  },
  tabIndicatorStyles: {
    backgroundColor: '#3994FF',
    color: 'white !important',
    width: '300px',
    zIndex: 2,
  },
  indicator: {
    color: '#fff',
  },
  tabsContainer: {
    '& .MuiTabs-scroller': {
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
    },
  },
}));
