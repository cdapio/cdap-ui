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
import Store, { NamespaceAdminActions } from 'components/NamespaceAdmin/store';
import { PIPELINE_ARTIFACTS } from 'services/helpers';
import { MyCloudApi } from 'api/cloud';
import { Theme } from 'services/ThemeHelper';
import { getCurrentNamespace } from 'services/NamespaceStore';

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

export function getComputeProfiles(namespace) {
  MyCloudApi.getSystemProfiles()
    .combineLatest(MyCloudApi.list({ namespace }))
    .subscribe(([systemProfiles = [], namepaceProfiles = []]) => {
      let filteredSystemProfiles = systemProfiles;
      if (Theme.showNativeProfile === false) {
        filteredSystemProfiles = systemProfiles.filter((profile) => profile.name !== 'native');
      }

      Store.dispatch({
        type: NamespaceAdminActions.setProfilesCount,
        payload: {
          profilesCount: systemProfiles.length + namepaceProfiles.length,
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

export function reset() {
  Store.dispatch({
    type: NamespaceAdminActions.reset,
  });
}
