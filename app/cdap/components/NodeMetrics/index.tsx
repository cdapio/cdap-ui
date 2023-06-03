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

import React, { useState } from 'react';
import styled from 'styled-components';
import { commaSeparatedNumber } from 'services/helpers';

const StyledDiv = styled.div`
  ${(props) =>
    props.disabled &&
    `a {
    cursor: not-allowed !important;
   } `}
`;

const StyledSpan = styled.span`
  padding: 0 2px;
`;

interface INodeMetricsProps {
  onClick: (event: any, node: any, portName?: any) => void;
  node: any;
  disabled: boolean;
  portName?: string;
  metricsData: any;
}

export const NodeMetrics = ({
  onClick,
  node,
  disabled,
  portName,
  metricsData,
}: INodeMetricsProps) => {
  const [showLabels, setShowLabels] = useState(true);

  return (
    <StyledDiv className="metrics-content" disabled={disabled}>
      {node.type !== 'splittertransform' ? (
        <a
          className="node-metrics-labels"
          onClick={(e) => {
            onClick(e, node);
          }}
        >
          <span className="metric-records-out">
            {node.type.indexOf('sink') === -1 ? (
              <span>
                {showLabels && <span className="metric-records-out-label">Out</span>}
                <StyledSpan>
                  {metricsData[node.name]?.recordsOut
                    ? commaSeparatedNumber(metricsData[node.name]?.recordsOut)
                    : '0'}
                </StyledSpan>
              </span>
            ) : (
              <span>
                {showLabels && <span className="metric-records-out-label">In</span>}
                <StyledSpan>
                  {metricsData[node.name]?.recordsIn
                    ? commaSeparatedNumber(metricsData[node.name]?.recordsIn)
                    : '0'}
                </StyledSpan>
              </span>
            )}
            <span>/</span>
          </span>
          <span className="metric-errors">
            {showLabels && <span className="metric-errors-label">Errors</span>}
            <StyledSpan>
              {metricsData[node.name]?.recordsError
                ? commaSeparatedNumber(metricsData[node.name]?.recordsError)
                : '0'}
            </StyledSpan>
          </span>
        </a>
      ) : (
        <a className="node-metrics-labels">
          {portName ? (
            <span
              className="metric-records-out"
              onClick={(e) => {
                onClick(e, node, portName);
              }}
            >
              {showLabels && <span className="metric-records-out-label">Out</span>}
              <StyledSpan>
                {metricsData[node.name]?.recordsOut[portName]
                  ? commaSeparatedNumber(metricsData[node.name]?.recordsOut[portName])
                  : '0'}
              </StyledSpan>
            </span>
          ) : (
            <span
              className="metric-errors"
              onClick={(e) => {
                onClick(e, node);
              }}
            >
              {showLabels && <span className="metric-errors-label">Errors</span>}
              <StyledSpan>
                {metricsData[node.name]?.recordsError
                  ? commaSeparatedNumber(metricsData[node.name]?.recordsError)
                  : '0'}
              </StyledSpan>
            </span>
          )}
        </a>
      )}
    </StyledDiv>
  );
};
