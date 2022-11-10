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

import grey from '@material-ui/core/colors/grey';
import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
  dropContainer: {
    height: 400,
    textAlign: 'center',
    border: `1px dashed ${grey[700]}`,
    borderRadius: 4,
    position: 'relative',
    zIndex: 99,
    padding: 20,
    width: 400,
  },
  delete_cursor_pointer: {
    cursor: 'pointer',
  },
  dropText: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '150%',
    letterSpacing: 0.15,
    color: grey[700],
    marginTop: 10,
  },
  fileNameText: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: '150%',
    letterSpacing: 0.15,
    color: grey[900],
  },
  FlexFile: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadBox: {
    position: 'relative',
    zIndex: 2,
  },
  wrangleButton: {
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
    marginBottom: 20,
    '&:hover': {
      background: '#3994FF',
    },
  },
  buttonWrapper: {
    textAlign: 'right',
  },
  bodyWrapper: {
    height: 'calc(100vh - 100px)',
    paddingTop: 6,
  },
  panelbody: {
    height: 'calc(100vh - 250px)',
  },
  infoIconText: {
    display: 'flex',
    gap: '8px',
    marginTop: 10,
  },
  infoIcon: {
    display: 'flex',
    margin: 'auto 0px',
  },
  infoText: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '150%',
    letterSpacing: 0.15,
    color: grey[700],
  },
});
