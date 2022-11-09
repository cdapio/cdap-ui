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
import { grey } from '@material-ui/core/colors';

export const useStyles = makeStyles(() => {
  return {
    tableNamesList: {
      border: '2px solid red',
    },
    tableBody: {
      '& .MuiTableCell-root': {
        color: '#5F6368',
        fontSize: 14,
      },
    },
    tableRowContainer: {
      '& .MuiTableCell-root': {
        paddingTop: 10,
        paddingBottom: 10,
      },
      '&:hover': {
        boxShadow: '3px 4px 15px rgba(68, 132, 245, 0.15)',
      },
    },
    headerNamesSeparator: {
      width: 250,
      border: '1px solid red',
      height: 1,
    },
    addTransformationBodyStyles: {
      height: 'calc(100% - 100px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
    },
    customTableContainer: {
      height: 'calc(100% - 43px)',
      overflow: 'scroll',
      padding: 0,
      position: 'relative',
    },
    columnsCountTextStyles: {
      width: '100%',
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: '#5F6368',
      height: 'calc(100vh - 211px)',
      overflow: 'scroll',
    },
    functionSectionStyles: {
      padding: '15px 0',
      borderBottom: '1px solid #DADCE0',
    },
    funtionSectionWrapperStyles: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    functionHeadingTextStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '150%',
      letterSpacing: '0.15px',
      color: grey[900],
    },
    columnLeft: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '150%',
      letterSpacing: '0.15px',
      paddingLeft: 30,
    },
    columnRight: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '150%',
      letterSpacing: '0.15px',
      paddingLeft: 0,
    },
    recipeStepsTableRowStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '150%',
      letterSpacing: '0.15px',
      '& .MuiTableCell-stickyHeader': {
        backgroundColor: '#FFFFFF',
      },
    },
    nullValuesContainer: {
      width: 134,
      paddingLeft: 0,
    },
    recipeStepsDeleteStyles: {
      width: 18,
      height: 20,
      cursor: 'pointer',
    },
    radioStyles: {
      '& span:last-child': {
        fontFamily: 'Noto Sans',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: 14,
        color: '#5F6368',
      },
    },
    replaceWithInput: {
      width: '90%',
    },
    replaceWithText: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 12,
      color: '#5F6368',
    },
    leftSideCell: {
      maxWidth: 200,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      paddingLeft: 30,
      '& .MuiTableCell-root': {
        padding: '10px 0px 10px 30px',
      },
    },
  };
});
