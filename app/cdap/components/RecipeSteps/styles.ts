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
    importIconStyles: {
      marginRight: 20,
      cursor: 'pointer',
    },
    more_icon: {
      cursor: 'pointer',
    },
    emptyScreenStyles: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyScreenText: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 20,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: grey[900],
    },
    emptyScreenInfoText: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: grey[700],
    },
    RecipeStepsBodyStyles: {
      height: 'calc(100% - 100px)',
      padding: 0,
    },
    recipeStepsTableHeadStyles: {
      padding: 10,
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: '#5F6368',
    },
    recipeStepsTableRowStyles: {
      fontFamily: 'Noto Sans',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '150%',
      letterSpacing: 0.15,
      color: '#5F6368',
      padding: '15px 10px',
    },
    recipeStepsActionTypeStyles: {
      fontWeight: 600,
    },
    displayNone: {
      visibility: 'hidden',
    },
    recipeStepsDeleteStyles: {
      width: 18,
      height: 20,
      cursor: 'pointer',
    },
    recipeStepsTableBodyRowStyles: {
      '&:hover': {
        background: '#EFF0F2',
        '& td:last-child': {
          visibility: 'visible',
        },
      },
    },
    kebabMenuStyle: {
      cursor: 'pointer',
    },
    downloadMenuActionWrapper: {
      display: 'flex',
    },
  };
});
