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

import { Box } from '@material-ui/core';
import { TickIcon } from 'components/WranglerGrid/AddTransformationPanel/SelectColumnsWidget';
import { IParseComponentProps } from 'components/WranglerGrid/TransformationComponents/ParseComponents/types';
import React from 'react';
import { SubHeadBoldFont } from 'components/common/TypographyText';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  padding: 15px 0;
  border-bottom: 1px solid #dadce0;
`;

const FuntionSectionWrapperStyles = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
export default function({ sectionHeading, children }: IParseComponentProps) {
  return (
    <SectionWrapper data-testid="parse-component-parent">
      <FuntionSectionWrapperStyles>
        <SubHeadBoldFont data-testid="section-heading">{sectionHeading}</SubHeadBoldFont>
        <Box>{TickIcon}</Box>
      </FuntionSectionWrapperStyles>
      {children}
    </SectionWrapper>
  );
}
