/*
 * Copyright © 2023 Cask Data, Inc.
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

import { AvailablePluginsMap, IPipelineDiffMap } from '../types';
import { getPluginNameFromStageDiffKey, getStageNameFromStageDiffKey } from '../util/diff';
import { getAvailabePluginsMapKeyFromPlugin, getCustomIconSrc } from '../util/helpers';
import { getPluginIcon } from 'services/helpers';
import { DiffInfoHeader } from './DiffInfoHeader';
import { DiffInfoTable } from './DiffInfoTable';
import Paper from '@material-ui/core/Paper';

const DiffInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
  margin: 10px;
  max-height: calc(100% - 20px);
  max-width: calc(100% - 20px);
  overflow: hidden;
  width: calc(100% - 20px);
`;

interface IDiffInfoProps {
  diffMap: IPipelineDiffMap;
  openDiffItem: string | null;
  availablePluginsMap: AvailablePluginsMap;
}

export const DiffInfo = ({ openDiffItem, diffMap, availablePluginsMap }: IDiffInfoProps) => {
  if (!openDiffItem) {
    return null;
  }
  const stage = diffMap.stages[openDiffItem]?.stage2 ?? diffMap.stages[openDiffItem].stage1;
  const diff = diffMap.stages[openDiffItem].diff;
  return (
    <DiffInfoContainer component={Paper}>
      <DiffInfoHeader
        nodeName={getStageNameFromStageDiffKey(openDiffItem)}
        customIconSrc={getCustomIconSrc(
          availablePluginsMap,
          getAvailabePluginsMapKeyFromPlugin(stage.plugin)
        )}
        iconName={getPluginIcon(getPluginNameFromStageDiffKey(openDiffItem))}
      />
      <DiffInfoTable diffIndicator={diffMap.stages[openDiffItem].diffIndicator} diff={diff} />
    </DiffInfoContainer>
  );
};
