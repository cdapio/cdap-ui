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

import { FormControlLabel, Typography } from '@material-ui/core';
import styled from 'styled-components';

export const StyledFormLabel = styled(Typography)`
  color: #5f6368;
  font-size: 14px;
  font-style: normal;
  margin-top: 10px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: 0.15px;
  margin-bottom: 10px;
`;

export const StyledFormControlRadio = styled(FormControlLabel)`
  margin-left: -5px;
  span:last-child: {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #5f6368;
  }
`;
