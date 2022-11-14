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
import grey from '@material-ui/core/colors';

export const useStyles = makeStyles({
  usageAndSearchWrapper: {
    background: '#616161',
    boxShadow: '-3px -4px 15px rgba(68, 132, 245, 0.25)',
  },
  searchBar: {
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    width: '100%',
  },
  inputSearch: {
    width: '95%',
    marginLeft: 5,
    outline: 0,
    border: 0,
    background: 'transparent',
    color: '#FFFFFF',
  },
  label: {
    color: '#94EC98',
    fontSize: 14,
  },
  divider: {
    backgroundColor: '#ffffff',
  },
  crossIcon: {
    cursor: 'pointer',
  },
  infoLink: {
    color: '#79B7FF',
    fontSize: 14,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
      color: '#79B7FF',
    },
  },
});
