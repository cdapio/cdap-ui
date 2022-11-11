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
    parsingDrawerStyles: {
      width: 460,
      height: '100%',
      padding: '5px 20px 5px 30px',
    },
    panelStyles: {
      height: '100%',
    },
    paper: {
      top: 46,
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
    },
    importFileInput: {
      cursor: 'pointer',
      marginBottom: '0 !important',
      display: 'none',
    },
    importSchemaLabel: {
      cursor: 'pointer',
      marginBottom: '0 !important',
      display: 'flex',
    },
    headingTextStyles: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 20,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: '#000000',
    },
    headerRightStyles: {
      display: 'flex',
      alignItems: 'center',
    },
    importIconStyles: {
      marginRight: 10,
    },
    importSchemaTextStyles: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: '#000000',
      marginLeft: 10,
    },
    importSchemaIconText: {
      display: 'flex !important',
    },
    dividerLineStyles: {
      width: 1,
      height: 28,
      backgroundColor: '#DADCE0',
      margin: '0px 15px',
    },
    checkboxStyles: {
      display: 'flex',
      width: '100%',
      marginBottom: 0,
    },
    labelTextStyles: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: '#5F6368',
    },
    inputWrapper: {
      marginBottom: 10,
    },
    selectFieldStyles: {
      height: 40,
      background: '#FFFFFF',
      border: '1px solid #DADCE0',
      borderRadius: 4,
      padding: '5px 15px 0px 15px',
      fontSize: 14,
      '&:before': {
        display: 'none',
      },
      '&:focus-visible': {
        outline: 'none !important',
      },
      '&:after': {
        display: 'none',
      },
      '& .MuiInputBase-input': {
        padding: '6px 0px 11px',
      },
    },
    optionStyles: {
      fontSize: 14,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: '#000000',
    },
    selectIconStyles: {
      top: 'calc(50% - 10px)',
      right: 10,
    },
    selectStyles: {
      '&:focus': {
        'background-color': 'transparent',
      },
    },
    underlineStyles: {
      display: 'none',
    },
    bodyContainerStyles: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      height: 'calc(100% - 120px)',
    },
    infoWrapperStyles: {
      display: 'flex',
      alignItems: 'center',
    },
    bottomSectionStyles: {
      display: 'flex',
      flexDirection: 'column',
    },
    infoTextStyles: {
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: '#5F6368',
      opacity: '0.8',
      marginLeft: 10,
    },
    applyButtonStyles: {
      width: 162,
      height: 36,
      background: '#3994FF',
      boxShadow: '0px 2px 4px rgba(70, 129, 244, 0.15)',
      borderRadius: 4,
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 15,
      lineHeight: 26,
      letterSpacing: 0.46,
      color: '#FFFFFF',
      alignSelf: 'flex-end',
      marginTop: 30,
      textTransform: 'none',
    },
    MUIPopover: {
      left: '472 !important',
      minWidth: '345 !important',
      top: '253 !important',
    },
    buttonStyles: {
      '&:hover': {
        backgroundColor: '#3994FF',
      },
    },
  };
});
