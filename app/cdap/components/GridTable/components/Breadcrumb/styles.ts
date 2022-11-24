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

export const useStyles = makeStyles({
  breadCombContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '48px',
    alignItems: 'center',
    marginRight: '30px',
    marginLeft: '34px',
  },
  breadcrumbLabel: {
    color: blue[500],
    fontSize: '14px',
    fontWeight: 400,
  },
  home: {
    width: '41px',
    height: '21px',
  },
  dataset: {
    width: '81px',
    height: '21px',
  },
  pipelineStyles: {
    width: 162,
    height: 36,
    backgroundColor: blue[500],
    boxShadow: '0px 2px 4px rgba(70, 129, 244, 0.15)',
    borderRadius: 4,
    fontFamily: 'Noto Sans',
    fontWeight: 400,
    fontSize: 15,
    color: '#ffffff',
    textAlign: 'center',
    paddingTop: 6,
    marginRight: 0,
  },
  Button: {
    '&:hover': {
      backgroundColor: blue[500],
      boxShadow: 'none',
      color: '#ffffff',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: blue[500],
    },
  },
});
