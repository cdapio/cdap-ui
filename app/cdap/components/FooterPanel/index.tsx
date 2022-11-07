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
import ColumnViewPanelTab from 'components/FooterPanel/Components/ColumnViewPanelTab';
import DirectivesTab from 'components/FooterPanel/Components/DirectivesTab';
import RecipeStepsTab from 'components/FooterPanel/Components/RecipeStepsTab';
import TableMetaInfoTab from 'components/FooterPanel/Components/TableMetaInfoTab';
import ZoomTab from 'components/FooterPanel/Components/ZoomTab';
import React from 'react';
import styled from 'styled-components';

export const PREFIX = 'features.WranglerNewUI.FooterPanel.labels';

interface IGridMetaInfo {
  rowCount: number;
  columnCount: number;
}

interface IFooterPanelProps {
  recipeStepsCount: number;
  gridMetaInfo: IGridMetaInfo;
}

const TabsWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: space-between;
  background-color: #f3f6f9;
  height: 40;
  box-shadow: 0px -2px 2px #0000001a;
  width: 100%;
  position: absolute;
  bottom: 54px;
`;

export default function({ recipeStepsCount, gridMetaInfo }: IFooterPanelProps) {
  return (
    <TabsWrapper data-testid="footer-panel-wrapper">
      <ColumnViewPanelTab />
      <TableMetaInfoTab {...gridMetaInfo} />
      <ZoomTab />
      <DirectivesTab />
      <RecipeStepsTab recipeStepsCount={recipeStepsCount} />
    </TabsWrapper>
  );
}
