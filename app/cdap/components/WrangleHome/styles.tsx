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
import { blue } from '@material-ui/core/colors';

export const useStyles = makeStyles({
  wrapper: {
    maxWidth: '1206px',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  subHeader: {
    display: 'flex',
    gap: '110px',
  },
  headerTitle: {
    display: 'flex',
  },
  viewMore: {
    margin: 'auto 0px',
    paddingTop: '26px',
    paddingLeft: '16px',
    fontSize: '14px',
    lineHeight: '21px',
    letterSpacing: '0.15px',
    color: blue[500],
    cursor: 'pointer',
  },
  welcomeCard: {
    fontSize: '36px',
    fontWeight: 600,
    lineHeight: '54px',
    letterSpacing: '0.15px',
    maxWidth: '382px',
    padding: '47px 0px 0px 0px',
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
  },
});
