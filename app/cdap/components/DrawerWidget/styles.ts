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

export const useStyles = makeStyles(() => {
  return {
    paper: {
      top: 46,
      height: 'calc(100vh - 47px)',
    },
    containerStyles: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    importStyles: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: 5,
    },
    drawerContainerStyles: {
      width: 460,
      height: '100%',
      paddingLeft: 30,
    },
    headerStyles: {
      height: 60,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 0,
      paddingRight: 0,
    },
    headingStyles: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginRight: 150,
    },
    pointerStyles: {
      cursor: 'pointer',
    },
    chevronLeftRounded: {
      fontSize: 24,
    },
    headingTextStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 20,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: '#000000',
    },
    importTextStyles: {
      fontWeight: 400,
      fontSize: 14,
      fontStyle: 'normal',
      color: '#000000',
      lineHeight: '150%',
      letterSpacing: 0.15,
      fontFamily: 'Noto Sans',
      paddingLeft: 8,
    },
    headerRightStyles: {
      display: 'flex',
      alignItems: 'center',
    },
    dividerLineStyles: {
      width: 1,
      height: 28,
      backgroundColor: '#DADCE0',
      margin: '0px 15px',
    },
    headerTextWithBackIconStyles: {
      display: 'flex',
      alignItems: 'center',
    },
    headerBackIconStyles: {
      marginRight: 10,
      width: 10,
      height: 20,
      cursor: 'pointer',
    },
  };
});
