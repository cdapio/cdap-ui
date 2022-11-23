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

import styled from 'styled-components';
import { FormControlLabel, FormGroup } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export const FormControlLabelComponent = styled(FormControlLabel)`
  width: calc(100% - 60px);
  margin-right: 60px;
  border: 1px solid #dadce0;
  height: 40px;
  padding: 5px 15px;
  font-size: 14px;
  background: #ffffff;
  border-radius: 4px;
  margin-left: 0;
`;

export const FormControlLabelRadioComponent = styled(FormControlLabel)`
  margin-left: -5px;
  & span:last-child: {
    font-weight: 400;
    font-size: 14px;
    color: ${grey[600]};
  }
`;

export const FormGroupComponent = styled(FormGroup)`
  width: calc(100% - 60px);
`;

export const FormGroupFullWidthComponent = styled(FormGroup)`
  width: 100%;
`;
