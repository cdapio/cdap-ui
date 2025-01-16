/*
 * Copyright © 2024 Cask Data, Inc.
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

import { getCurrentNamespace } from 'services/NamespaceStore';
import Defer from './defer';
import VersionStore from 'services/VersionStore';
import { MyPipelineApi } from 'api/pipeline';
import _isObject from 'lodash/isObject';
import { GLOBALS } from 'services/global-constants';
import { objectQuery, santizeStringForHTMLID } from 'services/helpers';
import { IMPLICIT_SCHEMA } from './constants';
import { formatSchemaToAvro } from './schemaUtils';
import { getPluginIcon } from './pluginUtils';

// TODO add types
export function fetchBackendProperties(node, appType, artifactVersion?) {
  const defer = new Defer();

  // This needs to pass on a scope always. Right now there is no cleanup
  // happening
  const params = {
    namespace: getCurrentNamespace(),
    pipelineType: appType,
    version: artifactVersion || VersionStore.getState().version,
    extensionType: node.type || node.plugin.type,
    pluginName: node.plugin.name,
    artifactVersion: node.plugin.artifact.version,
    artifactName: node.plugin.artifact.name,
    artifactScope: node.plugin.artifact.scope,
    limit: 1,
    order: 'DESC',
  };

  MyPipelineApi.fetchPluginProperties(params).subscribe(
    (res = []) => {
      // Since now we have added plugin artifact information to be passed in query params
      // We don't get a list (or list of different versions of the plugin) anymore. Its always a list of 1 item.
      // Overwriting artifact as UI could have artifact ranges while importing draft.
      const lastElementIndex = res.length - 1;
      node._backendProperties = res[lastElementIndex].properties || {};
      node.description = res[lastElementIndex].description;
      node.plugin.artifact = res[lastElementIndex].artifact;
      defer.resolve(node);
    },
    (err) => {
      defer.reject(err);
      // TODO handle error case
    }
  );

  return defer.promise;
}

export async function getPluginInfo(
  node,
  appType,
  sourceConnections,
  sourceNodes,
  artifactVersion
) {
  if (!(_isObject(node._backendProperties) && Object.keys(node._backendProperties).length)) {
    node = await fetchBackendProperties(node, appType, artifactVersion);
  }

  node = await configurePluginInfo(node, sourceConnections, sourceNodes);
  return node;
}

export function configurePluginInfo(node, sourceConnections, sourceNodes) {
  const defer = new Defer();
  if (['action', 'source'].includes(GLOBALS.pluginConvert[node.type])) {
    defer.resolve(node);
    return defer.promise;
  }

  const inputSchemas = [];
  const allInputSchemas = sourceNodes.map((sourceNode) => {
    return getInputSchema(sourceNode, node, sourceConnections).then((inputSchema) => {
      const schemaContainsMacro = typeof inputSchema === 'string' && containsMacro(inputSchema);
      inputSchemas.push({
        name: sourceNode.plugin.label,
        schema: schemaContainsMacro ? inputSchema : formatSchemaToAvro(inputSchema),
      });
    });
  });
  Promise.all(allInputSchemas).then(() => {
    node.inputSchema = inputSchemas;
    return defer.resolve(node);
  });
  return defer.promise;
}

export function getOutputSchemaObj(schema, schemaObjName = GLOBALS.defaultSchemaName) {
  return {
    name: schemaObjName,
    schema,
  };
}

export function containsMacro(value) {
  if (!value) {
    return false;
  }

  const beginIndex = value.indexOf('${');
  const endIndex = value.indexOf('}');

  if (beginIndex === -1 || endIndex === -1 || beginIndex > endIndex) {
    return false;
  }

  return true;
}

export function parseSchema(schema) {
  let rSchema;
  if (typeof schema === 'string') {
    if (containsMacro(schema)) {
      return schema;
    }
    try {
      rSchema = JSON.parse(schema);
    } catch (e) {
      rSchema = null;
    }
  } else {
    rSchema = schema;
  }
  return rSchema;
}

export function getInputSchema(sourceNode, currentNode, sourceConnections) {
  if (!sourceNode.outputSchema || typeof sourceNode.outputSchema === 'string') {
    sourceNode.outputSchema = [getOutputSchemaObj(sourceNode.outputSchema)];
  }

  let schema = sourceNode.outputSchema[0].schema;
  const defer = new Defer();

  // If the current stage is an error collector and the previous stage is a source
  // Then call validation API to get error schema of previous node and set it as input schema
  // of the current stage.
  if (
    currentNode.type === 'errortransform' &&
    (sourceNode.type === 'batchsource' || sourceNode.type === 'streamingsource')
  ) {
    const body = {
      stage: {
        name: sourceNode.name,
        plugin: sourceNode.plugin,
      },
    };
    const params = {
      context: getCurrentNamespace(),
    };
    MyPipelineApi.validateStage(params, body).subscribe((res) => {
      const schema =
        objectQuery(res, 'spec', 'errorSchema') || objectQuery(res, 'spec', 'outputSchema');
      defer.resolve(parseSchema(schema));
    });

    return defer.promise;
  }

  // If for nodes other than source set the input schema of previous stage as input
  // schema of the current stage.
  if (currentNode.type === 'errortransform' && sourceNode.type !== 'batchsource') {
    schema =
      sourceNode.inputSchema && Array.isArray(sourceNode.inputSchema)
        ? sourceNode.inputSchema[0].schema
        : sourceNode.inputSchema;
  }

  // If current stage connects to a port from previous stage then cycle through connections
  // and find the stage and its output schema. That is the input schema for current stage.
  if (sourceNode.outputSchema[0].name !== GLOBALS.defaultSchemaName) {
    const sourcePort = (sourceConnections.find((sconn) => sconn.port) || {}).port;
    const sourceSchema = sourceNode.outputSchema.filter(
      (outputSchema) => outputSchema.name === sourcePort
    );
    schema = sourceSchema[0].schema;
  }

  if (Object.keys(IMPLICIT_SCHEMA).includes(sourceNode.plugin.properties.format)) {
    schema = IMPLICIT_SCHEMA[sourceNode.plugin.properties.format];
  }
  defer.resolve(parseSchema(schema));
  return defer.promise;
}

export function getNodesFromStages(stages) {
  const sanitize = santizeStringForHTMLID;
  const nodes = stages.map((stage) => {
    stage = {
      ...stage,
      type: stage.plugin.type,
      label: stage.plugin.label,
      icon: getPluginIcon(stage.plugin.name),
      id: sanitize(stage.id) || `${sanitize(stage.name)}${this.uuid.v4()}`,
    };
    return stage;
  });

  return nodes;
}
