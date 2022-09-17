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
import grey from '@material-ui/core/colors/grey';

export const useStyles = makeStyles({
  labelContainerBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    height: '24px',
  },
  labelStyles: {
    maxWidth: '160px',
    whiteSpace: 'nowrap',
    fontSize: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
  },
  labelStylesCount: {
    maxWidth: '36px',
    fontSize: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    pointerEvents: 'none',
  },
  rightArrow: {
    color: grey[600],
    fontSize: 'large',
  },
  rightArrowSelected: {
    color: '#fff',
    fontSize: 'large',
  },
});
