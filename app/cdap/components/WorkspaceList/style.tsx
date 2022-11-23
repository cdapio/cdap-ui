/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const useStyles = makeStyles({
  wrapper: {
    paddingBottom: 10,
  },
  header: {
    height: 48,
    borderBottom: '1px solid ${grey[300]}',
    display: 'flex',
    alignItems: 'center',
  },
  breadcrumb: {
    marginLeft: 30,
    textDecoration: 'none',
  },
  explorationList: {
    marginTop: 30,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: '0.15px',
    fontWeight: 400,
  },
  textWorkspaces: {
    color: grey[900],
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    opacity: 0.5,
    background: 'white',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2000,
  },
});
