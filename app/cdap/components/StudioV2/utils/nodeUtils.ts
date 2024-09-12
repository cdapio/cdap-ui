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

import { getCurrentNamespace } from "services/NamespaceStore";
import Defer from "./defer";
import VersionStore from "services/VersionStore";
import { MyPipelineApi } from "api/pipeline";

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
    order: 'DESC'
  };

  MyPipelineApi.fetchPluginProperties(params).subscribe(
    (res = []) => {
      // Since now we have added plugin artifact information to be passed in query params
      // We don't get a list (or list of different versions of the plugin) anymore. Its always a list of 1 item.
      // Overwriting artifact as UI could have artifact ranges while importing draft.
      let lastElementIndex = res.length - 1;
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