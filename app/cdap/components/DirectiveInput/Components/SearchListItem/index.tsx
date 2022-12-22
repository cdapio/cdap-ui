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
import { IDirectiveUsage } from 'components/DirectiveInput/types';
import React from 'react';
import styled from 'styled-components';

interface ISearchListItemProps {
  searchItem: IDirectiveUsage;
}

const SearchWrapper = styled(Box)`
  display: block;
`;

const SmallLabel = styled(Typography)`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.15;
  color: ${grey[700]};
`;

const LargeLabel = styled(SmallLabel)`
  font-weight: 600;
  font-size: 16px;
`;

export default function({ searchItem }: ISearchListItemProps) {
  return (
    <SearchWrapper data-testid="search-list-item-parent-wrapper">
      <LargeLabel data-testid="select-directive-list-label" variant="body1">
        {searchItem.item.directive || searchItem.item.label}
      </LargeLabel>
      <SmallLabel data-testid="select-directive-list-description" variant="body1">
        {searchItem.item.description}
      </SmallLabel>
    </SearchWrapper>
  );
}
