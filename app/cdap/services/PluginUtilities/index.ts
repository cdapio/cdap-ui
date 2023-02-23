/*
 * Copyright © 2020 Cask Data, Inc.
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

import { MyPipelineApi } from 'api/pipeline';
import groupBy from 'lodash/groupBy';
import { getCurrentNamespace } from 'services/NamespaceStore';
import Version from 'services/VersionRange/Version';

enum LOCATION {
  before = -1,
  after = 1,
}

interface IArtifact {
  name: string;
  version: string;
  scope: string;
}

interface IPlugin {
  name: string;
  type: string;
  description: string;
  className: string;
  artifact: IArtifact;
}

export function bucketPlugins(plugins: IPlugin[]): Record<string, IPlugin[]> {
  // Group plugins by plugin name
  const bucket = groupBy(plugins, 'name');

  // sort bucket
  Object.keys(bucket).forEach((pluginName) => {
    // sort reverse order (index 0 always latest version)
    bucket[pluginName] = bucket[pluginName].sort((plugin1, plugin2) => {
      const version1: any = new Version(plugin1.artifact.version);
      const version2: any = new Version(plugin2.artifact.version);

      if (version1.compareTo(version2) < 0) {
        return LOCATION.after;
      } else if (version1.compareTo(version2) > 0) {
        return LOCATION.before;
      } else {
        // if version is the same, take artifact scope USER

        if (plugin1.artifact.scope === 'USER') {
          return LOCATION.before;
        } else {
          return LOCATION.after;
        }
      }
    });
  });

  return bucket;
}

export function fetchPluginWidget(
  artifactName,
  artifactVersion,
  artifactScope,
  pluginName,
  pluginType
) {
  const widgetKey = `widgets.${pluginName}-${pluginType}`;
  const params = {
    namespace: getCurrentNamespace(),
    artifactName,
    artifactVersion,
    scope: artifactScope,
    keys: widgetKey,
  };

  return MyPipelineApi.fetchWidgetJson(params).map((res) => {
    if (!res || !res[widgetKey]) {
      return {};
    }

    try {
      const widgetContent = JSON.parse(res[widgetKey]);
      return widgetContent;
    } catch (parseError) {
      throw new Error(parseError);
    }
  });
}
