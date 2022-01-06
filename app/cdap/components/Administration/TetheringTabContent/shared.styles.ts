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

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: var(--grey08);
`;

export const HeaderTitle = styled.h5`
  margin-left: 30px;
  margin-top: 5px;
  font-weight: bold;
`;

export const BodyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const NoDataText = styled.span`
  margin: 15px 0;
  font-weight: bold;
  font-size: 1rem;
`;
