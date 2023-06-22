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
import { WrapperCanvas } from 'components/hydrator/components/Canvas';
import { DiffAccordion } from './DiffAccordion';
import { usePipelineGraph } from './usePipelineGraph';

const StyledDiffWindow = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const DiffWindow = ({ namespace, appId, version, latestVersion }) => {
  const {
    nodesAndConnections: { nodes: oldVersionNodes, connections: oldVersionConnections },
    isLoading: isOldLoading,
  } = usePipelineGraph(namespace, appId, version);

  const {
    nodesAndConnections: { nodes: currentVersionNodes, connections: currentVersionConnections },
    isLoading: isCurrentLoading,
  } = usePipelineGraph(namespace, appId, latestVersion);

  return (
    <StyledDiffWindow>
      <DiffAccordion title={'Old Version'} defaultOpen={true}>
        {!isOldLoading && (
          <WrapperCanvas
            angularNodes={oldVersionNodes}
            angularConnections={oldVersionConnections}
            isPipelineDiff={true}
            backgroundId={'older-pipeline'}
          />
        )}
      </DiffAccordion>
      <DiffAccordion title={'Current Version'} defaultOpen={true}>
        {!isCurrentLoading && (
          <WrapperCanvas
            angularNodes={currentVersionNodes}
            angularConnections={currentVersionConnections}
            isPipelineDiff={true}
            backgroundId={'current-pipeline'}
          />
        )}
      </DiffAccordion>
      <DiffAccordion title={'Diff'} defaultOpen={false}>
        {/* TODO DIFF TABLE */}
      </DiffAccordion>
    </StyledDiffWindow>
  );
};
