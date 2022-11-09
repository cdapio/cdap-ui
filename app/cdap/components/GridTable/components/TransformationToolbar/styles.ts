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
import { grey } from '@material-ui/core/colors';

export const useStyles = makeStyles({
  closeHeader: {
    transform: 'rotate(180deg)',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    border: `1px solid ${grey[300]}`,
    marginTop: 0,
    paddingLeft: 18,
    paddingRight: 15,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 0,
    width: '80%',
  },
  searchIcon: {
    border: 'none',
    outline: 'none',
    width: 250,
  },
  closeBreadCrumb: {
    transform: 'rotate(180deg)',
  },
  functionNameWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '-webkit-fill-available',
    '& .MuiIconButton-root': {
      paddingBottom: 8,
    },
  },
  typoClass: {
    color: grey[600],
    fontSize: 14,
    padding: '0 12px',
    marginBottom: 10,
  },
  arrow: {
    width: '5%',
  },
  divider: {
    margin: '0 4',
  },
  tooltipToolbar: {
    background: grey[700],
    color: '#FFFFFF',
    fontSize: 14,
  },
  arrowTooltip: {
    '&::before': {
      backgroundColor: grey[600],
    },
  },
  lastDivider: {
    margin: '0px 0px 0px 4px',
  },
  searchBar: {
    minWidth: 490,
  },
});
