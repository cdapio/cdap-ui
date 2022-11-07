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

import { Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import React from 'react';
import styled from 'styled-components';

const OutlinedLabel = styled(Typography)`
  background-color: ${grey[600]};
  height: 21px;
  width: 20px;
  color: #ffffff;
  border-radius: 4px;
  padding: 4px 5px;
`;

/**
 *
 * @param children: children to be rendered inside the label
 * @returns Label with appropriate style
 */

export default function({ children }: { children: JSX.Element }) {
  return (
    <OutlinedLabel data-testid="footerpanel-outlined-label" component="span">
      {children}
    </OutlinedLabel>
  );
}
