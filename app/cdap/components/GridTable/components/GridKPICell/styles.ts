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

import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { grey } from '@material-ui/core/colors';

export const useGridKPICellStyles = makeStyles({
  root: {
    minWidth: '216px',
    width: 'fit-content',
    backgroundColor: '#fff',
    padding: '10px 10px 0px 30px',
    borderRadius: '0px',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeaderCell: {
    padding: '0px',
    width: 'auto',
    fontSize: '14px',
    border: '1px solid #E0E0E0',
  },
  KPICell: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '5px',
  },
  label: {
    lineHeight: '21px',
    fontSize: '14px',
    fontWeight: 400,
    color: '#5F6368',
  },
  count: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    color: red[600],
  },
  missingClass: {
    color: red[600],
  },
  generalClass: {
    color: grey[900],
  },
});
