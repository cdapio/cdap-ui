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

import React, { useEffect, useRef } from 'react';
import 'jsplumb';
import T from 'i18n-react';
import uuidV4 from 'uuid/v4';
import { getScale } from 'components/Metadata/Lineage/helper';
import { IParsedLineageResponse, INodeDisplay } from 'components/Metadata/Lineage/helper';
import {
  DIAGRAM_WIDTH,
  NoContentMsg,
  EntityName,
  EntityType,
  EntityIcon,
  EntityLink,
  LineageContainer,
  Node,
  RightNavigation,
  NavigationLink,
  LeftNavigation,
} from 'components/Metadata/Lineage/LineageDiagram/styles';

const I18N_PREFIX = 'features.MetadataLineage';
const STROKE_COLOR = 'rgba(0,0,0,1)';
const DAG_CONTAINER_ID = `dag-${uuidV4()}`;

interface ILineageDiagramProps {
  getLineage: (searchParams) => void;
  onNodeClick: (INodeDisplay) => void;
  lineageData: IParsedLineageResponse;
}

const LineageDiagram: React.FC<ILineageDiagramProps> = ({
  getLineage,
  onNodeClick,
  lineageData,
}) => {
  const { nodes, graph, connections } = lineageData;
  const graphInfo = graph.graph();
  graphInfo.width = Math.max(DIAGRAM_WIDTH, graphInfo.width);
  const scaleInfo = getScale(graphInfo);
  const jsPlumbInstance = useRef<any>();

  useEffect(() => {
    jsPlumb.ready(() => {
      let currentInstance = jsPlumbInstance.current;
      if (!currentInstance) {
        // Only get the JSPlumb instance when initializing so connector state
        // is preserved on subsequent renderings
        currentInstance = jsPlumb.getInstance({
          Container: DAG_CONTAINER_ID,
          PaintStyle: {
            fill: STROKE_COLOR,
            stroke: STROKE_COLOR,
            strokeWidth: 2,
          },
          Connector: [
            'Flowchart',
            { gap: 0, stub: [10, 15], alwaysRespectStubs: true, cornerRadius: 0 },
          ],
          ConnectionOverlays: [['Arrow', { location: 1, direction: 1, width: 10, length: 10 }]],
          Endpoints: ['Blank', 'Blank'],
        });
        currentInstance.setContainer(document.getElementById(DAG_CONTAINER_ID));
        jsPlumbInstance.current = currentInstance;
      }

      // Delete previously rendered connections before adding current ones
      currentInstance.deleteEveryEndpoint();

      connections.forEach((connection) => {
        currentInstance.connect({
          source: connection.source,
          target: connection.target,
          detachable: false,
          anchors: ['Right', 'Left'],
        });
      });
    });
  }, [lineageData]);

  if (nodes.length === 0) {
    return <NoContentMsg>{T.translate(`${I18N_PREFIX}.noLineageMsg`)}</NoContentMsg>;
  }

  function renderNodeDetails(node: INodeDisplay) {
    return (
      <>
        <EntityName nodeType={node.nodeType}>{node.label}</EntityName>
        <EntityType nodeType={node.nodeType}>
          <EntityIcon className={node.icon}></EntityIcon>
          <span>{node.displayType}</span>
        </EntityType>
      </>
    );
  }

  return (
    <LineageContainer
      id="lineage-diagram"
      style={{
        height: `${graphInfo.height}px`,
        width: `${graphInfo.width}px`,
        transform: `scale(${scaleInfo.scale})`,
        left: `${scaleInfo.padX}`,
        top: `${scaleInfo.padY}`,
      }}
    >
      {nodes.map((node) => (
        <Node
          key={node.uniqueNodeId}
          nodeType={node.nodeType}
          id={node.dataId}
          style={node.uiLocation}
          onClick={onNodeClick.bind(null, node)}
        >
          {node.isLeftEdge && (
            <LeftNavigation>
              <NavigationLink
                className="fa fa-caret-left"
                onClick={getLineage.bind(null, {
                  entityType: node.entityType,
                  entityId: node.entityId,
                })}
              ></NavigationLink>
            </LeftNavigation>
          )}
          {node.isRightEdge && (
            <RightNavigation>
              <NavigationLink
                className="fa fa-caret-right"
                onClick={getLineage.bind(null, {
                  entityType: node.entityType,
                  entityId: node.entityId,
                })}
              ></NavigationLink>
            </RightNavigation>
          )}
          {node.link && <EntityLink to={node.link}>{renderNodeDetails(node)}</EntityLink>}
          {!node.link && <div>{renderNodeDetails(node)}</div>}
        </Node>
      ))}
    </LineageContainer>
  );
};

export default LineageDiagram;
