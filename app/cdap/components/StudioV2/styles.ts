/*
 * Copyright © 2024 Cask Data, Inc.
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

export const CanvasWrapper = styled.div`
  display: flex;
  top: 50px;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  background: #f8f8f8;
`;

export const LeftPanelWrapper = styled.div`
  display: flex;
  width: 270px;
  overflow: auto;
  z-index: 1;
`; 

export const RightWrapper = styled.div`
  position: absolute;
  z-index: 0;
  left: 270px;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
`;

export const DagWrapper = styled.div`
  flex-grow: 1;
`;
