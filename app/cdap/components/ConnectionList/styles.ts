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
import { blue, grey } from '@material-ui/core/colors';

export const useStyles = makeStyles({
  canBrowseHover: {
    display: 'none',
  },
  iconBoxStyles: {
    width: 30,
    height: 30,
    boxSizing: 'border-box',
  },
  tooltipStyles: {
    backgroundColor: 'black',
    color: 'white',
  },
  tabHeaders: {
    backgroundColor: blue[50],
    '& .MuiTypography-root': {
      fontSize: '16px',
      color: '#000000',
    },
  },
  styleForLevelZero: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '50px',
    paddingLeft: '38px',
  },
  beforeSearchIconClickDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '50px',
    paddingRight: '18px',
    paddingLeft: '30px',
  },
  searchBar: {
    width: '100%',
    backgroundColor: '#fff',
    border: 'none',
    marginLeft: '9px',
    height: '21px',
    fontSize: '14px',
    outline: 0,
  },
  afterSearchIconClick: {
    display: 'flex',
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '50px',
    borderRight: '1px dashed #DADCE0',
    paddingRight: '20px',
    paddingLeft: '18px',
    textDecoration: 'none',
  },
  hideComponent: {
    display: 'none',
  },
  closeIcon: {
    '& :hover': {
      cursor: 'pointer',
    },
  },
  tabsContainerWithHeader: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${grey[300]}`,
  },
  connectionsListContainer: {
    width: '100vw',
    overflow: 'scroll',
    '& *': {
      letterSpacing: '0.15px',
    },
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
  headerLabel: {
    maxWidth: '245px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
  },
});
