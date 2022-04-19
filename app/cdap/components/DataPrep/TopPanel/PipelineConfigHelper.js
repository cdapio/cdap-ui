/*
 * Copyright © 2017 Cask Data, Inc.
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
import MyDataPrepApi from 'api/dataprep';
import DataPrepStore from 'components/DataPrep/store';
import { SCOPES, HYDRATOR_DEFAULT_VALUES } from 'services/global-constants';
import VersionStore from 'services/VersionStore';

export default function getPipelineConfig() {
  const workspaceId = DataPrepStore.getState().dataprep.workspaceId;

  const params = {
    context: getCurrentNamespace(),
    workspaceId,
  };

  return MyDataPrepApi.getSpecification(params).map((res) => {
    const batchArtifact = {
      name: 'cdap-data-pipeline',
      version: VersionStore.getState().version,
      scope: SCOPES.SYSTEM,
    };

    const realtimeArtifact = {
      ...batchArtifact,
      name: 'cdap-data-streams',
    };

    const batchStages = [];
    const realtimeStages = [];
    const batchConnections = [];
    const realtimeConnections = [];

    const wranglerStage = formatPluginSpec(res.wrangler);
    batchStages.push(wranglerStage);
    realtimeStages.push(wranglerStage);

    const wranglerName = wranglerStage.name;

    res.sources.forEach((plugin) => {
      const pluginType = plugin.plugin.type;
      // check if plugin can be source
      if (pluginType !== 'batchsource' && pluginType !== 'streamingsource') {
        return;
      }

      const pluginStage = formatPluginSpec(plugin);
      const pluginName = pluginStage.name;

      const connectionObj = {
        from: pluginName,
        to: wranglerName,
      };

      if (pluginType === 'batchsource') {
        batchConnections.push(connectionObj);
        batchStages.push(pluginStage);
        return;
      }

      if (pluginType === 'streamingsource') {
        realtimeConnections.push(connectionObj);
        realtimeStages.push(pluginStage);
        return;
      }
    });

    const batchConfig = {
      artifact: batchArtifact,
      config: {
        stages: batchStages,
        connections: batchConnections,
        resources: {
          memoryMB: HYDRATOR_DEFAULT_VALUES.resources.memoryMB,
          virtualCores: HYDRATOR_DEFAULT_VALUES.resources.virtualCores,
        },
        driverResources: {
          memoryMB: HYDRATOR_DEFAULT_VALUES.resources.memoryMB,
          virtualCores: HYDRATOR_DEFAULT_VALUES.resources.virtualCores,
        },
      },
    };

    const responseObj = {
      batchConfig,
    };

    if (realtimeStages.length > 1) {
      responseObj.realtimeConfig = {
        artifact: realtimeArtifact,
        config: {
          stages: realtimeStages,
          connections: realtimeConnections,
          resources: {
            memoryMB: HYDRATOR_DEFAULT_VALUES.resources.memoryMB,
            virtualCores: HYDRATOR_DEFAULT_VALUES.resources.virtualCores,
          },
          driverResources: {
            memoryMB: HYDRATOR_DEFAULT_VALUES.resources.memoryMB,
            virtualCores: HYDRATOR_DEFAULT_VALUES.resources.virtualCores,
          },
        },
      };
    }

    return responseObj;
  });
}

function formatPluginSpec({ plugin, schema }) {
  const pluginInfo = {
    name: plugin.name,
    plugin: {
      name: plugin.name,
      label: plugin.name,
      artifact: plugin.artifact,
      type: plugin.type,
      properties: {
        ...plugin.properties,
        schema: JSON.stringify(schema),
      },
    },
  };

  return pluginInfo;
}
