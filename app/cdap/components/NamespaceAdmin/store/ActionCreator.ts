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
import { MySecureKeyApi } from 'api/securekey';
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
import { catchError, switchMap } from 'rxjs/operators';
import { ConnectionsApi } from 'api/connections';
import { ISourceControlManagementConfig } from '../SourceControlManagement/types';
import { of } from 'rxjs/observable/of';

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

  MyPipelineApi.list({ namespace, artifactName: PIPELINE_ARTIFACTS, latestOnly: true }).subscribe(
    (pipelines) => {
      Store.dispatch({
        type: NamespaceAdminActions.setPipelinesCount,
        payload: {
          pipelinesCount: pipelines && Array.isArray(pipelines) ? pipelines.length : 0,
        },
      });
    }
  );

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

// separating this piece out from getAndSetSourceControlManagement
// to reuse it in validation function
export const getSourceControlManagement = (namespace) => {
  const params = { namespace };
  return MyNamespaceApi.getSourceControlManagement(params).pipe(
    switchMap((res: any) => {
      const config = res.config;
      return Observable.forkJoin(
        of(config),
        MySecureKeyApi.getSecureData({ ...params, key: config.auth.tokenName }).pipe(
          // return a null token if token is not found
          catchError(() => {
            return of(...[config, null]);
          })
        )
      );
    }),
    // config does not exist
    catchError((err) => {
      Store.dispatch({
        type: NamespaceAdminActions.setSourceControlManagementConfig,
        payload: {
          sourceControlManagementConfig: null,
        },
      });
      throw err;
    })
  );
};

export const getAndSetSourceControlManagement = (namespace) => {
  getSourceControlManagement(namespace).subscribe((res) => {
    // after getting the saved config, we need to fetch the token using the tokenName
    const [config, token] = res;
    config.auth.token = token;
    Store.dispatch({
      type: NamespaceAdminActions.setSourceControlManagementConfig,
      payload: {
        sourceControlManagementConfig: config,
      },
    });
  });
};

// I need to have two different validation functions
// This one is for the config validation and save
export const addOrValidateSourceControlManagementForm = (
  namespace,
  formState: ISourceControlManagementConfig,
  validate: boolean = false
) => {
  const params = { namespace };
  if (validate) {
    // validate the connection
    // TODO: currently it requires to save the token to secure store first.
    // In the future we might want to test connection on the fly
    return MySecureKeyApi.put(
      { ...params, key: formState.auth.tokenName },
      {
        data: formState.auth.token,
      }
    ).pipe(
      switchMap(() => {
        return MyNamespaceApi.setSourceControlManagement(
          params,
          getBodyForSubmit(formState, validate)
        );
      }),
      catchError((err) => {
        throw err;
      })
    );
  }
  return Observable.forkJoin(
    MyNamespaceApi.setSourceControlManagement(params, getBodyForSubmit(formState)),
    MySecureKeyApi.put(
      { ...params, key: formState.auth.tokenName },
      {
        data: formState.auth.token,
      }
    )
  ).map(() => getAndSetSourceControlManagement(namespace));
};

// This validation function directly reads config from api and validate
export const validateSourceControlManagement = (namespace) => {
  return getSourceControlManagement(namespace).pipe(
    switchMap((res: any) => {
      const [config, token] = res;
      config.auth.token = token;
      return MyNamespaceApi.setSourceControlManagement(
        { namespace },
        getBodyForSubmit(config, true)
      );
    }),
    catchError((err) => {
      throw err;
    })
  );
};

export const deleteSourceControlManagement = (
  namespace,
  formState: ISourceControlManagementConfig
) => {
  const params = { namespace };
  return Observable.forkJoin(
    MyNamespaceApi.deleteSourceControlManagement(params),
    MySecureKeyApi.delete({ ...params, key: formState.auth.tokenName }).pipe(
      // whether token is deleted doesn't really matter
      catchError(() => of(null))
    )
  ).map(() => {
    getAndSetSourceControlManagement(namespace);
  });
};

const getBodyForSubmit = (formState, validate = false) => {
  return {
    test: validate,
    config: formState,
  };
};

export function reset() {
  Store.dispatch({
    type: NamespaceAdminActions.reset,
  });
}
