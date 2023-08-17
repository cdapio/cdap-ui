/*
 * Copyright © 2018 Cask Data, Inc.
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
import { MyPipelineApi } from 'api/pipeline';
import { Observable } from 'rxjs/Observable';

interface IPipelineConfig {
  name: string;
  description: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
  config: any;
  version?: string;
  parentVersion?: string;
}

/**
 * Duplicate selected pipeline and navigate to studio page
 *
 * @param {string} pipelineName - input pipeline name
 * @param {object} config - pipeline config object, if not provided
 *                          will fetch the config through given pipelineName
 * @returns
 */
export function duplicatePipeline(pipelineName: string, config?: IPipelineConfig): void {
  const newName = getClonePipelineName(pipelineName);

  if (config) {
    setConfigAndNavigate({ ...config, name: newName });
    return;
  }

  getPipelineConfig(pipelineName).subscribe((pipelineConfig) => {
    setConfigAndNavigate({ ...pipelineConfig, name: newName });
  });
}

/**
 * Edit selected pipeline and navigate to studio page
 *
 * @param {string} pipelineName - input pipeline name
 * @param {object} config - pipeline config object, if not provided
 *                          will fetch the config through given pipelineName
 * @returns
 */
export function editPipeline(pipelineName: string, config?: IPipelineConfig): void {
  if (config) {
    setConfigAndNavigate({ ...config }, true);
    return;
  }

  getPipelineConfig(pipelineName).subscribe((pipelineConfig) => {
    setConfigAndNavigate({ ...pipelineConfig }, true);
  });
}

/**
 * Get pipeline config from pipeline name
 *
 * @param {string} pipelineName - input pipeline name
 * @returns {Observable}
 */
export function getPipelineConfig(pipelineName: string): Observable<IPipelineConfig> {
  return Observable.create((observer) => {
    const params = {
      namespace: getCurrentNamespace(),
      appId: pipelineName,
    };

    MyPipelineApi.get(params).subscribe((res) => {
      const pipelineConfig = {
        name: res.name,
        description: res.description,
        artifact: res.artifact,
        config: JSON.parse(res.configuration),
        version: res.appVersion,
      };

      observer.next(pipelineConfig);
      observer.complete();
    });
  });
}

function setConfigAndNavigate(config: IPipelineConfig, isEdit = false): void {
  const newConfig = { ...config };
  newConfig.parentVersion = newConfig.version;
  delete newConfig.version;
  window.localStorage.setItem(newConfig.name, JSON.stringify(newConfig));

  const hydratorLink = window.getHydratorUrl({
    stateName: 'hydrator.create',
    stateParams: {
      namespace: getCurrentNamespace(),
      cloneId: newConfig.name,
      artifactType: newConfig.artifact.name,
      isEdit: isEdit.toString(),
    },
  });

  window.location.href = hydratorLink;
}

function getClonePipelineName(name: string): string {
  const match = name.match(/(_copy[\d]*)$/g);
  let copy;
  let existingSuffix;
  if (Array.isArray(match)) {
    copy = match.pop();
    existingSuffix = copy;
    copy = copy.replace('_copy', '');
    copy = '_copy' + ((!isNaN(parseInt(copy, 10)) ? parseInt(copy, 10) : 1) + 1);
  } else {
    copy = '_copy';
  }
  return name.split(existingSuffix)[0] + copy;
}
