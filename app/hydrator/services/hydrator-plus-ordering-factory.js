/*
 * Copyright © 2016 Cask Data, Inc.
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
import { GLOBALS as globals } from '../../cdap/services/global-constants';

function HydratorPlusPlusOrderingFact(GLOBALS) {
  function getArtifactDisplayName (artifactName) {
    return GLOBALS.artifactConvert[artifactName] || artifactName;
  }
  function getPluginTypeDisplayName (pluginType) {
    return GLOBALS.pluginTypeToLabel[pluginType] || pluginType;
  }

  function orderPluginTypes (pluginsMap) {
    if (!pluginsMap.length) {
      return pluginsMap;
    }
    let orderedTypes = [];
    let action = pluginsMap.filter( p => { return p.name === GLOBALS.pluginLabels['action']; });
    let source = pluginsMap.filter( p => { return p.name === GLOBALS.pluginLabels['source']; });
    let transform = pluginsMap.filter( p => { return p.name === GLOBALS.pluginLabels['transform']; });
    let sink = pluginsMap.filter( p => { return p.name === GLOBALS.pluginLabels['sink']; });
    let analytics = pluginsMap.filter( p => { return p.name === GLOBALS.pluginLabels['analytics']; });
    let errorHandlers = pluginsMap.filter( p => { return p.name === GLOBALS.pluginLabels['erroralert']; });

    if (source.length) {
      orderedTypes.push(source[0]);
    }
    if (transform.length) {
      orderedTypes.push(transform[0]);
    }
    if (analytics.length) {
      orderedTypes.push(analytics[0]);
    }
    if (sink.length) {
      orderedTypes.push(sink[0]);
    }
    if (action.length) {
      orderedTypes.push(action[0]);
    }
    if (errorHandlers.length) {
      orderedTypes.push(errorHandlers[0]);
    }

    // Doing this so that the SidePanel does not lose the reference of the original
    // array object.
    angular.forEach(orderedTypes, (type, index) => {
      pluginsMap[index] = type;
    });

    return pluginsMap;
  }

  function getAdjacencyMap(connections) {
    let adjacencyMap = {};
    if (!Array.isArray(connections)) {
      return adjacencyMap;
    }
    connections.forEach( conn => {
      if (Array.isArray(adjacencyMap[conn.from])) {
        adjacencyMap[conn.from].push(conn.to);
      } else {
        adjacencyMap[conn.from] = [conn.to];
      }
    });
    return adjacencyMap;
  }

  return {
    getArtifactDisplayName: getArtifactDisplayName,
    getPluginTypeDisplayName: getPluginTypeDisplayName,
    orderPluginTypes: orderPluginTypes,
    getAdjacencyMap: getAdjacencyMap
  };
}

angular.module(`${PKG.name}.feature.hydrator`)
  .service('HydratorPlusPlusOrderingFactory', HydratorPlusPlusOrderingFact);

export const HydratorPlusPlusOrderingFactory = HydratorPlusPlusOrderingFact(globals);