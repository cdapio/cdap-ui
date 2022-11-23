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

import { Button } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';
import styled from 'styled-components';

export const AddTransformationButton = styled(Button)`
  width: 162px;
  height: 36px;
  background: ${blue[500]};
  box-shadow: 0px 2px 4px rgba(70, 129, 244, 0.15);
  border-radius: 4px;
  font-weight: 400;
  font-size: 15px;
  line-height: 26px;
  letter-spacing: 0.46px;
  color: #ffffff;
  align-self: flex-end;
  margin-top: 30px;
  text-transform: none;
  margin-bottom: 20px;
  margin-right: 8px;
  &:hover {
    background: ${blue[500]};
  }
  &.Mui-disabled {
    background: ${grey[200]};
  }
  &.Mui-disabled {
    background: ${grey[300]};
  }
`;

export const SelectColumnButton = styled(Button)`
  width: 162px;
  height: 36px;
  background: transparent;
  box-shadow: 0px 2px 4px rgba(70, 129, 244, 0.15);
  border: 1px solid ${blue[500]};
  border-radius: 4px;
  font-weight: 400;
  font-size: 15px;
  line-height: 26px;
  letter-spacing: 0.46px;
  color: ${blue[500]};
  text-transform: none;
  margin-top: 20px;
  &:hover {
    background: transparent;
  }
`;
