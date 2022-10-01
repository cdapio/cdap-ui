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
import grey from '@material-ui/core/colors/grey';
import { blue } from '@material-ui/core/colors';

export const useStyles = makeStyles({
  breadCombContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '48px',
    alignItems: 'center',
    marginRight: '30px',
    marginLeft: '34px',
    '& .MuiBreadcrumbs-root': {
      fontSize: '14px',
      fontWeight: '400',
    },
    '& .MuiTypography-root': {
      color: '#000000',
      lineHeight: '21px',
    },
    '& a': {
      color: blue[500],
      lineHeight: '21px',
    },
  },
  subHeaderIcon: {
    fontSize: 'x-large',
    color: grey[700],
  },
  selectPrevPage: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  importData: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  importDataContainer: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-end',
    fontSize: '14px',
  },
  breadcrumbTyporgraphy: {
    color: grey[900],
    fontSize: '14px',
    lineHeight: '21px',
  },
});
