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

export const useStyles = makeStyles({
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    border: '1px solid #E0E0E0',
    height: '48px',
    marginTop: '0px',
    padding: '10px',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: '0px',
    marginRight: '0px',
  },
  searchIcon: {
    border: 'none',
    outline: 'none',
  },
});
