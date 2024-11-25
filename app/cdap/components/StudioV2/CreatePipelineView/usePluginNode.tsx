// /*
//  * Copyright © 2024 Cask Data, Inc.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License"); you may not
//  * use this file except in compliance with the License. You may obtain a copy of
//  * the License at
//  *
//  * http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
//  * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
//  * License for the specific language governing permissions and limitations under
//  * the License.
//  */

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAdjacencyMap, getNodes } from '../store/nodes/queries';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

const SHOW_METRICS_THRESHOLD = 0.8;

export function usePluginNode(disabled = false, disableNodeClick = false) {
  const [isDisabled, setIsDisabled] = useState<boolean>(disabled);
  const [nodeMenuOpen, setNodeMenuOpen] = useState(null);
  const [selectedNode, setSelectedNode] = useState([]);
  const [activePluginToComment, setActivePluginToComment] = useState(null);
  const doesStageHaveComments = false;

  const metricsPopovers = {};
  const selectedConnections = [];
  const conditionNodes = [];
  const normalNodes = [];
  const splitterNodesPorts = {};

  const pluginsMap = {};
  const nodesState = useSelector((state) => state.nodes);
  const adjacencyMap = getAdjacencyMap(nodesState);

  let nodesTimeout,
    fitToScreenTimeout,
    initTimeout,
    metricsPopoverTimeout,
    resetTimeout,
    highlightSelectedCOnnectionsTimeout;

  function checkIfAnyStageHasComment() {
    const existingStages = getNodes(nodesState);
    return !_isEmpty(
      existingStages.find(
        (node) =>
          Array.isArray(_get(node, 'information.comments.list')) &&
          node.information.comments.list.length > 0
      )
    );
  }

  function clearSelectedNodes() {
    setSelectedNode([]);
  }
}
