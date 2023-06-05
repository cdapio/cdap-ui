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

import { MyPipelineApi } from 'api/pipeline';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import { WrapperCanvas } from 'components/hydrator/components/Canvas';
import { getGraphLayout } from 'components/hydrator/helpers/DAGhelpers';
import React, { useEffect, useState } from 'react';
import { ReactFlow } from 'reactflow';
import { getNodesFromStages } from 'services/helpers';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: block;
  width: 100%;
  height: calc(80vh - 50px);
  overflow: auto;
`;

export const PipelineDiff = ({ isOpen, onClose, namespace, appId, version }) => {
  const [nodesAndConnections, setNodesAndConnections] = useState({ nodes: [], connections: [] });
  const [isLoading, setIsLoading] = useState(false);

  const fetchConfigAndDisplayGraph = () => {
    setIsLoading(true);
    MyPipelineApi.getAppVersion({
      namespace,
      appId,
      version,
    }).subscribe((res: any) => {
      const config = JSON.parse(res.configuration);
      let nodes = getNodesFromStages(config.stages);
      const connections = config.connections;
      const graph = getGraphLayout(nodes, connections, 200);
      nodes = nodes.map((node) => {
        return {
          ...node,
          _uiPosition: {
            top: graph._nodes[node.name].y + 'px',
            left: graph._nodes[node.name].x + 'px',
          },
        };
      });
      console.log(nodes);
      setNodesAndConnections({ nodes, connections });
      // TODO: currently without the timeout the graph edges renders weirdly
      // need to figure out the cause
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    });
  };

  useEffect(() => {
    fetchConfigAndDisplayGraph();
  }, []);

  return (
    <PipelineModeless
      title="pipeline difference"
      open={isOpen}
      onClose={onClose}
      placement="bottom-end"
      fullScreen={true}
      style={{ width: '100%', top: '100px' }}
    >
      <StyledContainer>
        {!isLoading && (
          <WrapperCanvas
            angularNodes={nodesAndConnections.nodes}
            angularConnections={nodesAndConnections.connections}
            isPipelineDiff={true}
          />
        )}
      </StyledContainer>
    </PipelineModeless>
  );
};
