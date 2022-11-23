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
import { green } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

export const useStyles = makeStyles({
  explorationCardWrapper: {
    height: 77,
    border: '1px solid #DADCE0',
    borderRadius: 4,
    marginBottom: 10,
    cursor: 'pointer',
    margin: '10px auto',
    display: 'flex',
    flexDirection: 'column',
    justifyConent: 'center',
    paddingRight: 62,
  },
  gridContainerWorkspaces: {
    width: 1306,
    margin: '10px auto',
  },
  gridContainerHome: {
    width: 1204,
  },
  explorationCard: {
    width: 301,
    flex: 1,
    paddingTop: 14,
    paddingLeft: 23,
    paddingBottom: 13,
    paddingRight: 23,
    display: 'flex',
    margin: 'auto 0px',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .MuiTypography-body1': {
      margin: 'auto 0px',
      fontSize: 16,
      lineHeight: '24px',
      width: 253,
      textOverflow: 'ellipsis',
      fontWeight: 400,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: '#000000',
    },
  },

  percent: {
    display: 'flex',
    minWidth: 85,
    justifyContent: 'end',
  },
  dataQualityWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  percentageStyleRed: {
    lineHeight: '30px',
    fontSize: 36,
    letterSpacing: '0.15px',
    color: red[600],
    margin: 'auto 0px',
  },
  percentageSymbolRed: {
    fontSize: 20,
    color: red[600],
    letterSpacing: '0.15px',
    lineHeight: '30px',
    marginRight: 6,
    margin: 'auto 0px',
    paddingTop: 14,
  },
  percentageStyleGreen: {
    lineHeight: '30px',
    fontSize: 36,
    color: green[600],
    margin: 'auto 0px',
    letterSpacing: '0.15px',
  },
  percentageSymbolGreen: {
    fontSize: 20,
    color: green[600],
    lineHeight: '30px',
    marginRight: 6,
    margin: 'auto 0px',
    letterSpacing: '0.15px',
    paddingTop: 14,
  },
  dataQualityText: {
    paddingTop: 0,
  },
  iconWithText: {
    maxWidth: 171,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  textWithoutIcon: {
    maxWidth: 166,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  connectorIcon: {
    minWidth: 100,
    paddingTop: 14,
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dataQualityTextContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
});
