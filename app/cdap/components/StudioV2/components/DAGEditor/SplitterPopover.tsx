/*
 * Copyright © 2025 Cask Data, Inc.
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
import { Handle, Position } from 'reactflow';
import styled from 'styled-components';
import { disabledSourceHandleStyle, sourceHandleStyle } from './NodeHandleStyles';
import NodeMetrics from './NodeMetrics';

export const PortContainer = styled.div`
  padding: 5px 10px;
  padding-right: 20px;
  margin: 0;
  border-bottom: 1px #e1e1e1 solid;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;

export default function SplitterPopover({ ports, isDisabled, node, onMetricsClick, disableMetricsClick, metricsData }) {
  return (
    <>
      {ports.map((port) => (
        <PortContainer>
          <span>{port.name}</span>
          <Handle 
            type="source" 
            position={Position.Right} 
            id={`source-port-${node.id}-${port.name}`} 
            style={isDisabled ? disabledSourceHandleStyle : sourceHandleStyle}
            data-testid={`plugin-endpoint-${node.plugin.name}-${node.type}-port-${port.name}`}
          />
          {
            isDisabled &&
            <div className="port-metrics">
              <NodeMetrics
                onClick={onMetricsClick}
                node={node}
                disabled={disableMetricsClick}
                metricsData={metricsData}
                portName={port.name} 
              />
            </div>
          }
        </PortContainer>
      ))}
    </>
  );
}