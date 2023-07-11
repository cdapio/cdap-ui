/*
 * Copyright © 2023 Cask Data, Inc.
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
import { Observable } from 'rxjs/Observable';
import { AvailablePluginsMap, IPipelineConfig, IPipelineStage } from '../types';
import {
  createPluginInfo,
  getAvailabePluginsMapKeyFromArtifact,
  getPluginKeyFromPluginProps,
} from '../util/helpers';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

interface IFetchPipelineOptions {
  namespace: any;
  appId: any;
  topVersion: any;
  bottomVersion: any;
}
interface IFetchPipelineRepsonse {
  topPipelineConfig: IPipelineConfig;
  bottomPipelineConfig: IPipelineConfig;
}
/**
 * @param options required options to fetch two pipeline versions
 * @returns Observable that provides the two typed pipelines
 */
export function fetchPipelineConfig(
  options: IFetchPipelineOptions
): Observable<IFetchPipelineRepsonse> {
  const { namespace, appId, topVersion, bottomVersion } = options;
  return Observable.forkJoin(
    MyPipelineApi.getAppVersion({
      namespace,
      appId,
      version: topVersion,
    }),
    MyPipelineApi.getAppVersion({
      namespace,
      appId,
      version: bottomVersion,
    })
  ).pipe(
    switchMap(([topRes, bottomRes]: [any, any]) => {
      const topPipelineConfig: IPipelineConfig = JSON.parse(topRes.configuration);
      const bottomPipelineConfig: IPipelineConfig = JSON.parse(bottomRes.configuration);
      return of({ topPipelineConfig, bottomPipelineConfig });
    })
  );
}

interface IFetchExtraPluginPropertiesOptions {
  namespace: any;
  stages: IPipelineStage[];
}

interface IFetchExtraPluginPropertiesResponse {
  availablePluginsMap: AvailablePluginsMap;
}
/**
 * Fetches extra plugin properties and generates an available plugins map, provieds the
 * map through an observable.
 * @param options required options to fetch the extra plugin properties
 * @returns Observable that provides a available plugins map
 */
export function fetchExtraPluginProperties(
  options: IFetchExtraPluginPropertiesOptions
): Observable<IFetchExtraPluginPropertiesResponse> {
  const { stages, namespace } = options;

  const availablePluginsMap = {};
  const reqBody = [];
  stages.forEach((stage) => {
    const plugin = stage.plugin;
    const pluginInfo = createPluginInfo(plugin);

    reqBody.push(pluginInfo.info);
    availablePluginsMap[pluginInfo.key] = {
      pluginInfo: stage.plugin,
    };
  });
  return MyPipelineApi.fetchAllPluginsProperties({ namespace }, reqBody).pipe(
    switchMap((res: any[]) => {
      res.forEach((plugin) => {
        const pluginProperties = Object.keys(plugin.properties);
        if (pluginProperties.length === 0) {
          return;
        }
        const pluginKey = getPluginKeyFromPluginProps(pluginProperties);
        const key = getAvailabePluginsMapKeyFromArtifact(pluginKey, plugin);

        availablePluginsMap[key].doc = plugin.properties[`doc.${pluginKey}`];

        let parsedWidgets;
        const widgets = plugin.properties[`widgets.${pluginKey}`];

        if (widgets) {
          try {
            parsedWidgets = JSON.parse(widgets);
          } catch (e) {
            console.log('failed to parse widgets', e, pluginKey);
          }
        }
        availablePluginsMap[key].widgets = parsedWidgets;
      });
      return of({ availablePluginsMap });
    })
  );
}
