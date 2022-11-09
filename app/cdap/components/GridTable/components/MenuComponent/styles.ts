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

import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

export const useStyles = makeStyles({
  divider: {
    borderColor: '#DADCE0',
  },
  heading: {
    fontSize: 14,
    fontWeight: 600,
    color: grey[600],
    padding: '0px 21px',
  },
  root: {
    position: 'absolute',
    left: '0 !important',
    right: '0 !important',
    bottom: '0 !important',
    width: 232,
    top: '-13px !important',
    '& > div': {
      position: 'absolute !important',
    },
    '& .MuiMenuItem-root': {
      padding: '6px 20px 6px 20px',
      height: 33,
    },
    '& .MuiMenu-paper': {
      width: 199,
      maxHeight: '70% !important',
    },
    '& .MuiMenu-list': {
      color: '#5F6368',
      border: '1px solid #DADCE0',
    },
    '& .MuiListItem-button': {
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& .MuiListItem-button:hover': {
      background: '#EFF0F2',
    },
    '& .MuiList-padding': {
      padding: '13px 0',
    },
  },
  popoverPaper: {
    boxShadow: '3px 4px 15px #4484f526;',
  },
});
