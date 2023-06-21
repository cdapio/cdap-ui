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
