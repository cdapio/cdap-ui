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
import { grey } from '@material-ui/core/colors';
import ChevronRightRounded from '@material-ui/icons/ChevronRightRounded';
import React, { Ref } from 'react';
import styled from 'styled-components';

export interface ITabLabelItemProps {
  myLabelRef: Ref<HTMLSpanElement>;
  label: string;
  count: number;
  labelTestId?: string;
}

export interface ITabLabelProps extends ITabLabelItemProps {
  icon: JSX.Element;
  labelContainerTestId?: string;
}

const CustomIconContainer = styled(Box)`
  padding-right: 11px;
`;

const ChevronIconLarge = styled(ChevronRightRounded)`
  font-size: large;
`;

const ChevronIconSelected = styled(ChevronIconLarge)`
  color: #fff;
`;

const ChevronIcon = styled(ChevronIconLarge)`
  color: ${grey[600]};
`;

const LabelContainerBox = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LabelConatainer = styled(Box)`
  display: flex;
  align-items: center;
  height: 24px;
`;

const RenderCount = styled(Typography)`
  font-size: 16px;
  overflow: hidden;
`;

const RenderTabLabel = styled(RenderCount)`
  max-width: 153px;
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none;
`;

export default function LabelItemCanBrowse({
  icon,
  label,
  count,
  labelContainerTestId,
  labelTestId,
  myLabelRef,
}: ITabLabelProps) {
  return (
    <LabelContainerBox data-testid={labelContainerTestId}>
      <LabelConatainer>
        {icon && <CustomIconContainer>{icon}</CustomIconContainer>}
        <>
          <RenderTabLabel
            variant="body1"
            ref={myLabelRef}
            data-testid={labelTestId}
            component="span"
          >
            {label}
          </RenderTabLabel>
          {count && (
            <RenderCount variant="body1" component="span">
              {`(${count})`}
            </RenderCount>
          )}
        </>
      </LabelConatainer>
      <>
        <Box className={'canBrowseNormal'}>
          <ChevronIcon />
        </Box>
        <Box className={'canBrowseHover'}>
          <ChevronIconSelected />
        </Box>
      </>
    </LabelContainerBox>
  );
}
