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

import { IconButton } from '@material-ui/core';
import { MyPipelineApi } from 'api/pipeline';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import { WrapperCanvas } from 'components/hydrator/components/Canvas';
import { getGraphLayout } from 'components/hydrator/helpers/DAGhelpers';
import React, { useEffect, useState } from 'react';
import { getNodesFromStages } from 'services/helpers';
import styled from 'styled-components';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const usePipelineGraph = (namespace, appId, version) => {
  const [nodesAndConnections, setNodesAndConnections] = useState({
    nodes: [],
    connections: [],
  });
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
  return { nodesAndConnections, isLoading };
};

const StyledTitleBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background: lightgray;
  height: 40px;
  padding: 0 30px;
`;

const TitleBar = ({ isOpen, title, onClick }) => {
  return (
    <StyledTitleBar>
      <div style={{ flexGrow: 1 }}>{title}</div>
      <IconButton onClick={onClick}>
        {isOpen ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </IconButton>
    </StyledTitleBar>
  );
};

const StyledDiffContainer = styled.div`
  width: 100%;
  height: 0px;
  flex-grow: ${(props) => (props.isOpen ? 1 : 0)};
`;

const DiffWindow = ({ defaultOpen, children, title }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <>
      <TitleBar title={title} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <StyledDiffContainer isOpen={isOpen}>{children}</StyledDiffContainer>
    </>
  );
};

const StyledDiffWindowList = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const DiffWindowList = ({ namespace, appId, version, latestVersion }) => {
  const {
    nodesAndConnections: { nodes: oldVersionNodes, connections: oldVersionConnections },
    isLoading: isOldLoading,
  } = usePipelineGraph(namespace, appId, version);

  const {
    nodesAndConnections: { nodes: currentVersionNodes, connections: currentVersionConnections },
    isLoading: isCurrentLoading,
  } = usePipelineGraph(namespace, appId, latestVersion);

  return (
    <StyledDiffWindowList>
      <DiffWindow title={'Old Version'} defaultOpen={true}>
        {!isOldLoading && (
          <WrapperCanvas
            angularNodes={oldVersionNodes}
            angularConnections={oldVersionConnections}
            isPipelineDiff={true}
            backgroundId={'older-pipeline'}
          />
        )}
      </DiffWindow>
      <DiffWindow title={'Current Version'} defaultOpen={true}>
        {!isCurrentLoading && (
          <WrapperCanvas
            angularNodes={currentVersionNodes}
            angularConnections={currentVersionConnections}
            isPipelineDiff={true}
            backgroundId={'current-pipeline'}
          />
        )}
      </DiffWindow>
      <DiffWindow title={'Diff'} defaultOpen={false}>
        {/* TODO DIFF TABLE */}
      </DiffWindow>
    </StyledDiffWindowList>
  );
};

const StyledDiffList = styled.div`
  background: white;
  border: 1px solid black;
  height: 100%;
  width: 400px;
`;

const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const PipelineDiff = ({ isOpen, onClose, namespace, appId, version, latestVersion }) => {
  return (
    <PipelineModeless
      title="pipeline difference"
      open={isOpen}
      onClose={onClose}
      placement="bottom-end"
      fullScreen={true}
      style={{ width: '100%', top: '100px', bottom: 0 }}
      innerStyle={{ height: '100%' }}
    >
      <StyledContainer>
        <StyledDiffList />
        <DiffWindowList {...{ namespace, appId, version, latestVersion }} />
      </StyledContainer>
    </PipelineModeless>
  );
};
