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

export interface INodeMetricsProps {
  onClick?(event: any, node: any, portName?: string): void;
  node?: any;
  disabled?: boolean;
  metricsData?: any;
  portName?: string;
}

export default function NodeMetrics({
  onClick,
  node,
  disabled,
  metricsData,
  portName,
}: INodeMetricsProps) {
  if (!metricsData) {
    return null;
  }

  function handleClick(event) {
    return onClick(event, node, portName);
  }

  return (
    <div className={`metrics-content ${disabled ? 'disabled' : ''}`}>
      {node.type !== 'splittertransform' && (
        <a className="node-metrics-labels" onClick={handleClick}>
          <span className="metric-records-out">
            {node.type.indexOf('sink') === -1 && (
              <span>
                <span className="metric-records-out-label">Out </span>
                <span>
                  {parseInt(metricsData[node.name]?.recordsOut || '0', 10).toLocaleString('en-US')}
                </span>
              </span>
            )}
            {node.type.indexOf('sink') !== -1 && (
              <span>
                <span className="metric-records-out-label">In </span>
                <span>
                  {parseInt(metricsData[node.name]?.recordsIn || '0', 10).toLocaleString('en-US')}
                </span>
              </span>
            )}
            <span>{' / '}</span>
          </span>
          <span className="metric-errors">
            <span className="metric-errors-label">Errors </span>
            <span>
              {parseInt(metricsData[node.name]?.recordsError || '0', 10).toLocaleString('en-US')}
            </span>
          </span>
        </a>
      )}
      {node.type === 'splittertransform' && (
        <a className="node-metrics-labels">
          {!!portName && (
            <span className="metric-records-out" onClick={handleClick}>
              <span className="metric-records-out-label">Out </span>
              <span>
                {parseInt(metricsData[node.name]?.recordsOut[portName] || '0', 10).toLocaleString(
                  'en-US'
                )}
              </span>
            </span>
          )}
          {!portName && (
            <span className="metric-errors" onClick={handleClick}>
              <span className="metric-errors-label">Errors </span>
              <span>
                {parseInt(metricsData[node.name]?.recordsError || '0', 10).toLocaleString('en-US')}
              </span>
            </span>
          )}
        </a>
      )}
    </div>
  );
}
