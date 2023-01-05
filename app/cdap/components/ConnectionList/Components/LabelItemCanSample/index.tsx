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

import { Box, Typography } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import { ITabLabelCanSampleItemProps } from 'components/ConnectionList/Components/TabLabelCanSample';
import React from 'react';
import styled from 'styled-components';

const ContainerForLabelCanSample = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  &:hover {
    cursor: 'default',
  },
`;

const LabelForCanSample = styled(Typography)`
  max-width: 145px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  point-erevents: none;
`;

const WrangleButton = styled.button`
  display: none;
  cursor: pointer;
  text-decoration: none;
  gap: 10px;
  border: 0;
  outline: 0;
  & .MuiTypography-root {
    color: ${blue[500]};
    font-size: 14px;
    letter-spacing: 0.15px;
    font-weight: 400;
  }
  ${ContainerForLabelCanSample}:hover & {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    background: none;
  }
`;

export default function LabelItemCanSample({
  label,
  myLabelRef,
  onExplore,
  entity,
  buttonTestId,
  buttonElement,
  dataTestID,
}: ITabLabelCanSampleItemProps) {
  return (
    <ContainerForLabelCanSample
      onDoubleClick={() => onExplore(entity)}
      data-testid={`connections-tab-label-can-simple-${dataTestID}`}
    >
      <LabelForCanSample variant="body2" ref={myLabelRef} component="span">
        {label}
      </LabelForCanSample>
      <WrangleButton onClick={() => onExplore(entity)} data-testid={buttonTestId}>
        {buttonElement}
      </WrangleButton>
    </ContainerForLabelCanSample>
  );
}
