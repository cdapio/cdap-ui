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
import CustomTooltip from 'components/ConnectionList/Components/CustomTooltip';
import { IHeaderCustomTooltipProps } from 'components/ConnectionList/types';
import React from 'react';
import styled from 'styled-components';

const RenderLabel = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: ${grey[900]};
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default function({
  headersRefs,
  columnIndex,
  tabsData,
  filteredData,
}: IHeaderCustomTooltipProps) {
  const tooltipRequired =
    headersRefs?.current[columnIndex]?.offsetWidth < headersRefs?.current[columnIndex]?.scrollWidth;

  return (
    <CustomTooltip title={tooltipRequired ? tabsData[columnIndex - 1].selectedTab : ''} arrow>
      <RenderLabel
        variant="body2"
        ref={(element) => {
          headersRefs.current[columnIndex] = element;
        }}
      >
        {filteredData[columnIndex - 1]?.selectedTab}
      </RenderLabel>
    </CustomTooltip>
  );
}
