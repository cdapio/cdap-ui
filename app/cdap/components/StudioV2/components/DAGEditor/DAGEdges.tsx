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

import React, { useEffect, useMemo, useRef } from 'react';
import {
  BaseEdge,
  ConnectionLineComponentProps,
  EdgeProps,
  Position,
  getSimpleBezierPath,
  getSmoothStepPath,
} from 'reactflow';
import { cartesianDistance } from '../../utils/geometry';

const END_MARKER_PREFIX = 'cdap-dag-edge-end-marker';
const EDGE_BORDER_RADIUS = 20;

const EndMarkers = {
  FILLED_TRIANGLE: `${END_MARKER_PREFIX}-traiangular-filled`,
  FILLED_TRIANGLE_SELECTED: `${END_MARKER_PREFIX}-traiangular-filled-selected`,
};

const endMarkersSvg = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker
      id="${EndMarkers.FILLED_TRIANGLE}"
      viewBox="0 0 5 5"
      refX="4"
      refY="2.5"
      markerUnits="strokeWidth"
      markerWidth="5"
      markerHeight="5"
      orient="auto">
      <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#b1b1b7"/>
    </marker>

    <marker
      id="${EndMarkers.FILLED_TRIANGLE_SELECTED}"
      viewBox="0 0 6 6"
      refX="5"
      refY="3"
      markerUnits="strokeWidth"
      markerWidth="6"
      markerHeight="6"
      orient="auto">
      <path d="M 0 0 L 6 3 L 0 6 z" fill="#000"/>
    </marker>
  </defs>
</svg>
`;

function appendMarkersSvg() {
  const markers = Array.from(document.querySelectorAll(`marker[id*="${END_MARKER_PREFIX}"]`));
  if (!markers.length) {
    const svgWrapperEl = document.createElement('div');
    svgWrapperEl.innerHTML = endMarkersSvg;
    document.body.appendChild(svgWrapperEl);
  }
}

function getEdgePath(
  sourceX: number,
  sourceY: number,
  sourcePosition: Position,
  targetX: number,
  targetY: number,
  targetPosition: Position,
  inProgress: boolean = false
) {
  const distX = Math.abs(targetX - sourceX);
  const distY = Math.abs(targetY - sourceY);
  if (inProgress && distX < EDGE_BORDER_RADIUS && distY < 2 * EDGE_BORDER_RADIUS) {
    return getSimpleBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  return getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: EDGE_BORDER_RADIUS,
  });
}

export function StandardEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  data,
}: EdgeProps) {
  const [path] = getEdgePath(
    sourceX,
    sourceY,
    data?.isSourceAtBottom ? Position.Bottom : Position.Right,
    targetX,
    targetY,
    Position.Left
  );

  useEffect(() => {
    appendMarkersSvg();
  }, []);

  let markerEnd = selected
    ? `url(#${EndMarkers.FILLED_TRIANGLE_SELECTED})`
    : `url(#${EndMarkers.FILLED_TRIANGLE})`;
  if (Math.abs(targetX - sourceX) < EDGE_BORDER_RADIUS) {
    markerEnd = '';
  }

  return <BaseEdge id={id} path={path} markerEnd={markerEnd} interactionWidth={20} />;
}

export function EdgeInProgress({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}: ConnectionLineComponentProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [path] = useMemo(
    () => getEdgePath(fromX, fromY, fromPosition, toX, toY, toPosition, true),
    [fromX, fromY, toX, toY, toPosition]
  );

  useEffect(() => {
    if (pathRef.current) {
      pathRef.current.setAttribute('d', path);
    }
  }, [path, pathRef.current]);

  useEffect(() => {
    appendMarkersSvg();
  }, []);

  return (
    <path
      d={path}
      fill="none"
      markerEnd={`url(#${EndMarkers.FILLED_TRIANGLE})`}
      className="react-flow__edge-path"
      ref={pathRef}
    />
  );
}

export const EDGE_TYPES = {
  default: StandardEdge,
  standard: StandardEdge,
};
