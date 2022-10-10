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

import { MyNamespaceApi } from 'api/namespace';
import { MyPipelineApi } from 'api/pipeline';
import { MyDatasetApi } from 'api/dataset';
import { MyPreferenceApi } from 'api/preference';
import { MyMetadataApi } from 'api/metadata';
import { MyArtifactApi } from 'api/artifact';
import MyCDAPVersionApi from 'api/version';
import Store, {
  IConnection,
  IDriver,
  NamespaceAdminActions,
} from 'components/NamespaceAdmin/store';
import { objectQuery, PIPELINE_ARTIFACTS } from 'services/helpers';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { GLOBALS, SCOPES } from 'services/global-constants';
import { Observable } from 'rxjs/Observable';
import { ConnectionsApi } from 'api/connections';

export function getNamespaceDetail(namespace) {
  MyNamespaceApi.get({ namespace }).subscribe((res) => {
    Store.dispatch({
      type: NamespaceAdminActions.setNamespaceInfo,
      payload: {
        namespace: res.name,
        generation: res.generation,
        description: res.description,
        exploreAsPrincipal: res.config['explore.as.principal'],
        schedulerQueueName: res.config['scheduler.queue.name'],
      },
    });
  });

  MyPipelineApi.list({ namespace, artifactName: PIPELINE_ARTIFACTS }).subscribe((pipelines) => {
    Store.dispatch({
      type: NamespaceAdminActions.setPipelinesCount,
      payload: {
        pipelinesCount: pipelines && Array.isArray(pipelines) ? pipelines.length : 0,
      },
    });
  });

  MyDatasetApi.list({ namespace }).subscribe((datasets) => {
    Store.dispatch({
      type: NamespaceAdminActions.setDatasetsCount,
      payload: {
        datasetsCount: datasets && Array.isArray(datasets) ? datasets.length : 0,
      },
    });
  });
}

export function getPreferences(namespace) {
  const requestNamespace = namespace ? namespace : getCurrentNamespace();

  MyPreferenceApi.getSystemPreferences()
    .combineLatest(MyPreferenceApi.getNamespacePreferences({ namespace: requestNamespace }))
    .subscribe(([systemPrefs = {}, namespacePrefs = {}]) => {
      const systemPreferences = Object.keys(systemPrefs).map((pref) => {
        return {
          key: pref,
          value: systemPrefs[pref],
          scope: 'System',
        };
      });

      const namespacePreferences = Object.keys(namespacePrefs).map((pref) => {
        return {
          key: pref,
          value: namespacePrefs[pref],
          scope: 'Namespace',
        };
      });

      Store.dispatch({
        type: NamespaceAdminActions.setPreferences,
        payload: {
          preferences: systemPreferences.concat(namespacePreferences),
        },
      });
    });
}

export function getDrivers(namespace) {
  const requestNamespace = namespace ? namespace : getCurrentNamespace();

  MyCDAPVersionApi.get()
    .flatMap(({ version }) => {
      const params = {
        namespace: requestNamespace,
        parentArtifact: GLOBALS.etlDataPipeline,
        version,
        extension: 'jdbc',
        scope: SCOPES.SYSTEM,
      };

      return MyPipelineApi.getExtensions(params);
    })
    .subscribe((plugins) => {
      const requestMetadata = [];

      if (!plugins || plugins.length === 0) {
        Store.dispatch({
          type: NamespaceAdminActions.setDrivers,
          payload: {
            drivers: [],
          },
        });
        return;
      }

      plugins.forEach((plugin) => {
        const metadataParams = {
          namespace: requestNamespace,
          artifactName: objectQuery(plugin, 'artifact', 'name'),
          artifactVersion: objectQuery(plugin, 'artifact', 'version'),
        };

        requestMetadata.push(MyMetadataApi.getArtifactProperties(metadataParams));
      });

      Observable.combineLatest(requestMetadata).subscribe((metadata) => {
        const drivers = plugins.map((plugin, i) => {
          return {
            ...plugin,
            creationTime: parseInt(objectQuery(metadata, i, 'creation-time'), 10),
          };
        });

        Store.dispatch({
          type: NamespaceAdminActions.setDrivers,
          payload: {
            drivers,
          },
        });
      });
    });
}

export function deleteDriver(driver: IDriver) {
  const params = {
    namespace: getCurrentNamespace(),
    artifactId: driver.artifact.name,
    version: driver.artifact.version,
  };

  return MyArtifactApi.delete(params).map(() => {
    getDrivers(getCurrentNamespace());
  });
}
export function getConnections(namespace) {
  const requestNamespace = namespace ? namespace : getCurrentNamespace();

  ConnectionsApi.listConnections({ context: requestNamespace }).subscribe((res) => {
    Store.dispatch({
      type: NamespaceAdminActions.setConnections,
      payload: {
        connections: res,
      },
    });
  });
}

export function deleteConnection(conn: IConnection) {
  const params = {
    context: getCurrentNamespace(),
    connectionId: conn.name,
  };

  return ConnectionsApi.deleteConnection(params).map(() => {
    getConnections(getCurrentNamespace());
  });
}

export function reset() {
  Store.dispatch({
    type: NamespaceAdminActions.reset,
  });
}
