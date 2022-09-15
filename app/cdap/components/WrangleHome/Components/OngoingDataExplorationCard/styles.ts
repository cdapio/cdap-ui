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
  gridContainer: {
    width: '1204px',
    height: '77px',
    border: '1px solid #DADCE0',
    borderRadius: '4px',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  elementStyle: {
    width: '301px',
    flex: 1,
    paddingTop: '14px',
    paddingLeft: '23px',
    paddingBottom: '13px',
    paddingRight: '23px',
    display: 'flex',
    margin: 'auto 0px',
    justifyContent: 'space-between',
    '& .MuiTypography-body1': {
      margin: 'auto 0px',
      fontSize: '16px',
      lineHeight: '24px',
      width: '253px',
      textOverflow: 'ellipsis',
      fontWeight: 400,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: '#000000',
    },
  },

  percent: {
    display: 'flex',
    minWidth: '85px',
    justifyContent: 'end',
  },
  iconStyle: {
    marginRight: '32px',
    height: '50px',
    width: '50px',
  },
  dataQualityWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  percentageStyleRed: {
    lineHeight: '30px',
    fontSize: '36px',
    letterSpacing: '0.15px',
    color: red[600],
    margin: 'auto 0px',
  },
  percentageSymbolRed: {
    fontSize: '20px',
    color: red[600],
    letterSpacing: '0.15px',
    lineHeight: '30px',
    marginRight: '6px',
    margin: 'auto 0px',
    paddingTop: '14px',
  },
  percentageStyleGreen: {
    lineHeight: '30px',
    fontSize: '36px',
    color: green[600],
    margin: 'auto 0px',
    letterSpacing: '0.15px',
  },
  percentageSymbolGreen: {
    fontSize: '20px',
    color: green[600],
    lineHeight: '30px',
    marginRight: '6px',
    margin: 'auto 0px',
    letterSpacing: '0.15px',
    paddingTop: '14px',
  },
  dataQualityText: {
    paddingTop: '11px',
  },
  iconWithText: {
    maxWidth: '171px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  textWithoutIcon: {
    maxWidth: '166px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});
