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
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';

export const Container = styled.div`
  background: var(--grey07);
  height: calc(100% - 60px);
`;

export const Loader = styled.h3`
  font-size: 1.4rem !important;
  margin-top: 150px;
  font-weight: 500;
  color: var(--grey01);
  white-space: nowrap;
  text-align: center;
`;

export const TimeRange = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
`;

export const DateSelect = styled(Select)`
  background: var(--white);
  .MuiSelect-root {
    padding-top: 12px;
    padding-bottom: 12px;
  }
`;

export const FieldLineage = styled(Button)`
  background: var(--white);
`;

export const CustomDateRange = styled.div`
  display: inline-block;
  margin-left: 15px;
  position: relative;
  & .expandable-time-range-picker {
    width: 330px;
    top: -13px;
  }
`;
