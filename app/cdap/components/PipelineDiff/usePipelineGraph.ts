import { MyPipelineApi } from 'api/pipeline';
import { getGraphLayout } from 'components/hydrator/helpers/DAGhelpers';
import { getNodesFromStages } from 'services/helpers';

import { useState, useEffect } from 'react';

// TODO: explore redux-toolkit rather than using a custom hook
export const usePipelineGraph = (namespace, appId, version) => {
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
