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

export const useStyles = makeStyles({
  dropContainer: {
    height: '400px',
    textAlign: 'center',
    border: '1px dashed #616161',
    borderRadius: '4px',
    position: 'relative',
    zIndex: 99,
    padding: 20,
  },
  dropText: {
    fontFamily: 'Noto Sans',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '150%',
    letterSpacing: '0.15px',
    color: '#616161',
    marginTop: 10,
  },
  fileNameText: {
    fontFamily: 'Noto Sans',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '150%',
    letterSpacing: '0.15px',
    color: '#212121',
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
    width: '162px',
    height: '36px',
    background: '#3994FF',
    boxShadow: '0px 2px 4px rgba(70, 129, 244, 0.15)',
    borderRadius: '4px',
    fontFamily: 'Noto Sans',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '15px',
    lineHeight: '26px',
    letterSpacing: '0.46px',
    color: '#FFFFFF',
    alignSelf: 'flex-end',
    marginTop: '30px',
    textTransform: 'none',
    marginBottom: '20px',
    '&:hover': {
      background: '#3994FF',
    },
  },
  buttonWrapper: {
    textAlign: 'right',
  },
  bodyWrapper: {
    height: 'calc(100vh - 100px)',
    paddingTop: 20,
  },
  panelbody: {
    height: 'calc(100vh - 250px)',
  },
});
