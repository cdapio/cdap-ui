/*
 * Copyright © 2022 Cask Data, Inc.
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
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { switchMap } from 'rxjs/operators';
import { ConnectionsApi } from 'api/connections';
import { MyPipelineApi } from 'api/pipeline';
import { MyArtifactApi } from 'api/artifact';
import { getCurrentNamespace } from 'services/NamespaceStore';

export const STATE_INITIAL_LOADING = 'STATE_INITIAL_LOADING';
export const STATE_AVAILABLE = 'STATE_AVAILABLE';
export const STATE_INITIAL_ERROR = 'STATE_INITIAL_ERROR';
export const STATE_CONFIG_CONFIRMED = 'STATE_CONFIG_CONFIRMED';

export const SET_STATUS_ACTION = 'SET_STATUS_ACTION';
export const SET_PROPERTIES_ACTION = 'SET_PROPERTIES_ACTION';
export const SET_WIDGETS_ACTION = 'SET_WIDGETS_ACTION';
export const SET_LOADING_SUBSCRIPTION_ACTION = 'SET_LOADING_OBSERVABLE_ACTION';
export const SET_PLUGIN_PROPERTIES_ACTION = 'SET_PLUGIN_PROPERTIES_ACTION';
export const SET_INITIAL_STATE_ACTION = 'SET_INITIAL_STATE_ACTION';

export const INITIAL_STATE = {
  selectedProperties: {},
  status: STATE_INITIAL_LOADING,
  widgets: [],
  pluginProperties: {},
  loadingSubscription: null,
};

// Copied from PluginListWidget/index
// TODO Centralize server-defined types
interface IPlugin {
  name: string;
  type: string;
  description: string;
  className: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
}

interface IConnectionSpecification {
  relatedPlugins: IPlugin[];
}

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_INITIAL_STATE_ACTION:
      return {
        ...state,
        ...action.value,
      };
    case SET_STATUS_ACTION:
      return {
        ...state,
        status: action.value,
      };
    case SET_PROPERTIES_ACTION:
      return {
        ...state,
        selectedProperties: action.value,
      };
    case SET_WIDGETS_ACTION:
      return {
        ...state,
        widgets: action.value,
      };
    case SET_LOADING_SUBSCRIPTION_ACTION:
      return {
        ...state,
        loadingSubcription: action.value,
      };
    case SET_PLUGIN_PROPERTIES_ACTION:
      return {
        ...state,
        pluginProperties: action.value,
      };
    default:
      throw new Error();
  }
};

// Copied from PluginListWidget/index
// TODO Centralize server-defined types
interface IPlugin {
  name: string;
  type: string;
  description: string;
  className: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
  };
}

interface IConnectionSpecification {
  relatedPlugins: IPlugin[];
}

export const performInitialLoad = (connection, sampleProperties, entity, dispatch) => {
  const selectedProperties = {};
  // Get the default property values from the entity (provided by the browse response)
  sampleProperties.forEach((sp) => {
    let value = null;
    if (entity.properties[sp.name]) {
      value = entity.properties[sp.name].value;
    }
    selectedProperties[sp.name] = value;
  });

  const namespace = getCurrentNamespace();

  const params = {
    context: namespace,
    connectionId: connection,
  };

  const body = {
    path: entity.path,
    properties: {},
  };

  let widgetKey;
  // Get the connection specification in order to find the source plugin
  const widgetObs = ConnectionsApi.getSpecification(params, body).pipe(
    switchMap((spec: IConnectionSpecification) => {
      const sourcePlugin = spec.relatedPlugins.find((plugin) => plugin.type === 'batchsource');
      widgetKey = `widgets.${sourcePlugin.name}-${sourcePlugin.type}`;
      const { artifact } = sourcePlugin;
      const widgetJsonParams = {
        namespace,
        artifactName: artifact.name,
        artifactVersion: artifact.version,
        scope: artifact.scope,
        keys: widgetKey,
      };
      const pluginDetailsParams = {
        namespace: getCurrentNamespace(),
        artifactId: artifact.name,
        version: artifact.version,
        scope: artifact.scope,
        extensionType: sourcePlugin.type,
        pluginName: sourcePlugin.name,
      };

      // Get the widget JSON (to specific the UI) and the plugin properties
      // (for the semantics of the properties, e.g. required fields)
      return Observable.forkJoin(
        MyPipelineApi.fetchWidgetJson(widgetJsonParams),
        MyArtifactApi.fetchPluginDetails(pluginDetailsParams)
      );
    })
  );

  const loadingSubscription = widgetObs.subscribe(
    ([widgetJson, pluginDetails]) => {
      const sourceWidgets = JSON.parse(widgetJson[widgetKey]);

      const parsingWidgets = [];
      sourceWidgets['configuration-groups'].forEach((cfgGroup) => {
        cfgGroup.properties.forEach((propertyWidget) => {
          if (
            sampleProperties.some((sampleProperty) => propertyWidget.name === sampleProperty.name)
          ) {
            parsingWidgets.push(propertyWidget);

            // set default value
            if (!selectedProperties[propertyWidget.name] && propertyWidget['widget-attributes']) {
              selectedProperties[propertyWidget.name] = propertyWidget['widget-attributes'].default;
            }
          }
        });
      });

      dispatch({
        type: SET_INITIAL_STATE_ACTION,
        value: {
          widgets: parsingWidgets,
          pluginProperties: pluginDetails[0].properties,
          selectedProperties,
          status: STATE_AVAILABLE,
        },
      });
    },
    (error) => {
      // TODO Handle specific error
      dispatch({
        type: SET_STATUS_ACTION,
        value: STATE_INITIAL_ERROR,
      });
    }
  );

  // Keep the subscription so we can unsubscribe
  // (which will cancel the loading operation if it's in progress)
  dispatch({
    type: SET_LOADING_SUBSCRIPTION_ACTION,
    value: loadingSubscription,
  });
};

export const unsubscribe = (state) => {
  const { loadingSubcription } = state;
  if (loadingSubcription) {
    loadingSubcription.unsubscribe();
  }
};
