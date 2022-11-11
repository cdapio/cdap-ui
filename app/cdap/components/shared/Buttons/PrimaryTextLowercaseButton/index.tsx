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

import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const NewButton = styled(Button)`
  text-transform: none;
  font-weight: normal;
  color: ${(props) => props.textColor || '#666666'};
  font-size: 13px;
  letter-spacing: 0;
`;

export const PrimaryTextLowercaseButton = ({ children, disabled = false, ...props }) => {
  return (
    <NewButton variant="text" color="primary" disabled={disabled} {...props}>
      {children}
    </NewButton>
  );
};
