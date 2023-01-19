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
import { IconButton } from '@material-ui/core';
import styled from 'styled-components';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

interface IExpandButtonProps {
  open: boolean;
  onClick: (event: React.MouseEvent) => void;
  dataTestId: string;
}

const CustomizedExpandButton = styled(IconButton)`
  transform: ${({ open }) => (!open ? 'rotate(180deg)' : 'rotate(0deg)')};
  cursor: pointer;
`;

const CustomizedExpandLessIcon = styled(ExpandLessIcon)`
  font-size: 24px;
`;
export default function ExpandButton({ open, onClick, dataTestId }: IExpandButtonProps) {
  return (
    <CustomizedExpandButton open={open} onClick={onClick} data-testid={dataTestId}>
      <CustomizedExpandLessIcon />
    </CustomizedExpandButton>
  );
}
