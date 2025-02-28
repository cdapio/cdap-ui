/*
 * Copyright © 2025 Cask Data, Inc.
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

export const targetHandleStyle = {};

export const sourceHandleStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '6px',
  right: '-5px',
  background: '#b1b1b7',
};

export const disabledSourceHandleStyle = {
  ...sourceHandleStyle,
  background: '#d1d1d7',
};

export const AlertHandle = styled.div`
  padding: 5px;
  font-size: 10px;
  color: #efab83;
  font-weight: bold;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
`;

export const ErrorHandle = styled(AlertHandle)`
  color: #ef83d3;
`;

export const FalseHandle = styled(AlertHandle)`
  color: #b2b2b2;
`;
