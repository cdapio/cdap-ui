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
import { DiffAccordion } from './DiffAccordion';
import { DiffCanvasWrapper } from './DiffCanvas';
import { useAppSelector } from './store/hooks';
import { RootState } from './store';
import { grey } from '@material-ui/core/colors';

const DiffWindowRoot = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${grey[100]};
`;

export const DiffWindow = () => {
  const {
    topPipelineConfig,
    bottomPipelineConfig,
    diffMap,
    availablePluginsMap,
    isLoading,
    error,
  } = useAppSelector((state: RootState) => {
    return {
      topPipelineConfig: state.pipelineDiff.topPipelineConfig,
      bottomPipelineConfig: state.pipelineDiff.bottomPipelineConfig,
      diffMap: state.pipelineDiff.diffMap,
      availablePluginsMap: state.pipelineDiff.availablePluginsMap,
      isLoading: state.pipelineDiff.isLoading,
      error: state.pipelineDiff.error,
    };
  });

  return (
    <DiffWindowRoot>
      {/* TODO: i18n */}
      <DiffAccordion title={'Old Version'} defaultOpen={true}>
        {!isLoading && !error && (
          <DiffCanvasWrapper
            config={topPipelineConfig}
            diffMap={diffMap}
            availablePluginsMap={availablePluginsMap}
            backgroundId={'older-pipeline'}
          />
        )}
      </DiffAccordion>

      {/* TODO: i18n */}
      <DiffAccordion title={'Current Version'} defaultOpen={true}>
        {!isLoading && !error && (
          <DiffCanvasWrapper
            config={bottomPipelineConfig}
            diffMap={diffMap}
            availablePluginsMap={availablePluginsMap}
            backgroundId={'current-pipeline'}
          />
        )}
      </DiffAccordion>

      {/* TODO: i18n */}
      <DiffAccordion title={'Diff'} defaultOpen={false}>
        {/* TODO DIFF TABLE */}
      </DiffAccordion>
    </DiffWindowRoot>
  );
};
