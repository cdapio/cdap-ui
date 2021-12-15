/*
 * Copyright © 2021 Cask Data, Inc.
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

import { ConnectionsApi } from 'api/connections';
import DataprepApi from 'api/dataprep';
import { getCurrentNamespace } from 'services/NamespaceStore';

export const ENTITY_TRUNCATION_LIMIT = 1000;

export function exploreConnection({ connectionid, path = '/' }) {
  const body = {
    path,
    limit: ENTITY_TRUNCATION_LIMIT,
  };

  return ConnectionsApi.exploreConnection(
    {
      context: getCurrentNamespace(),
      connectionid,
    },
    body
  ).toPromise();
}

export function getApiErrorMessage(e) {
  return e?.message || e?.response?.message || e?.statusCode || 'Unknown error';
}

export function createWorkspace({ entity, connection, limit = 1000, properties = {} }) {
  const { path } = entity;
  const body = {
    connection,
    sampleRequest: {
      path,
      properties,
      limit,
    },
  };
  return DataprepApi.createWorkspace(
    {
      context: getCurrentNamespace(),
    },
    body
  )
    .toPromise()
    .catch((e) => {
      throw getApiErrorMessage(e);
    });
}

export function getPluginSpec(entity, connection, plugin = null) {
  const { path } = entity;
  const params = {
    context: getCurrentNamespace(),
    connectionId: connection,
  };

  const body = {
    path,
    properties: {},
  };

  if (plugin) {
    Object.assign(body, { pluginName: plugin.name, pluginType: plugin.type });
  }

  return ConnectionsApi.getSpecification(params, body).toPromise();
}
