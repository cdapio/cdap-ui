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

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BodyContainer } from '../shared.styles';

export const Container = styled.div`
  width: 100vw;
  margin-top: -20px;
  margin-left: calc(-50vw + 50%);
`;

export const BackButton = styled(Link)`
  margin-top: 1px;
  font-size: 1rem;

  &:hover {
    text-decoration: none;
  }
`;

export const Divider = styled.span`
  font-size: 1.25rem;
  padding: 0 5px;
`;

export const StyledBodyContainer = styled(BodyContainer)`
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
`;

export const ButtonsContainer = styled.div`
  margin-left: -30px;
`;
