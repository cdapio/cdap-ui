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
  dialogWrapper: {
    paddingBottom: '20px',
  },
  modalHeader: {
    color: '#212121',
    fontSize: '20px',
  },
  modalText: {
    color: '#212121',
    fontSize: '16px',
    marginTop: '20px',
  },
  headerFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonStyles: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    border: '1px solid #DADCE0',
    borderRadius: '4px',
    marginRight: '20px',
    cursor: 'pointer',
    width: '250px',
    height: '125px',
  },
  dialogActionGroup: {
    display: 'grid',
    justifyContent: 'center',
    alignItem: 'center',
    gridTemplateColumns: '50% 50%',
    marginTop: '20px',
  },
  closeIcon: {
    cursor: 'pointer',
  },
  muiDialogPaper: { width: '600px', paddingBottom: '24px' },
  muiDialogTitle: { paddingBottom: '5px' },
});
