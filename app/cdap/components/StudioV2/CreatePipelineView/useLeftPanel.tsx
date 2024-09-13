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

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import qs from 'query-string';
import _isEqual from 'lodash/isEqual';

import { getPluginIcon, getPluginTypeDisplayName, orderPluginTypes } from '../utils/pluginUtils';
import { ILabeledArtifactSummary } from '../types';
import { fetchSystemArtifacts, setSelectedArtifact } from '../store/common/actions';
import { UiActions } from '../store/uistate/actions';
import { render } from '@testing-library/react';
import Defer from '../utils/defer';
import DirtyStateConfirmationModal from '../modals/DirtyStateConfirmationModal';
import { MyPipelineApi } from 'api/pipeline';
import { fetchPlugins } from '../store/availablePlugins/actions';
import { getCurrentNamespace } from 'services/NamespaceStore';
import VersionStore from 'services/VersionStore';
import { fetchPluginsDefaultVersions, updatePluginDefaultVersion } from '../store/plugins/actions';


interface IStudioV2PageParams {
  namespace: string;
  isEdit?: boolean;
}

export type TStudioUiMode = 'create' | 'edit';

interface ILeftPanelController {
  artifacts: any[];
  selectedArtifact: any;
  pluginsMap: any[];

  onArtifactChange: (value: any) => void;
  onItemClicked: (event: React.MouseEvent<HTMLElement>, node: any) => void;
  createPluginTemplate: (node: any, mode: TStudioUiMode) => void;
}

export function useLeftPanelController(): ILeftPanelController {
/*
  stores: ILeftPanelStores,
  stateParams: IStudioV2PageParams,
  cdapVersion: string,
  hydratorConfigStore: IHydratorConfigStore,
  leftPanelActions: IPluginActions,
  hydratorNodeActions: IHydratorNodeActions,
  uiModalActions: IHydratorUiModalActions,
  artifacts: ILabeledArtifactSummary[],
  settingsProvider: IHydratorSettings,
  */
  const dispatch = useDispatch();

  const cdapVersion = VersionStore.getState().version;
  const artifacts = useSelector((state) => state.common.artifacts);
  const selectedArtifact = useSelector((state) => state.common.selectedArtifact);

  const extensions = useSelector((state) => state.plugins.extensions);
  const pluginTypes = useSelector((state) => state.plugins.pluginTypes);
  const availablePluginsMap = useSelector((state) => state.availablePlugins.pluginsMap);

  const location = useLocation();
  const queryParams = qs.parse(location.search);
  const isEdit = queryParams.isEdit === 'true';
  console.log(isEdit, queryParams);

  useEffect(() => {
    fetchSystemArtifacts();
    init();
  }, []);

  let pluginsMap = [];
  const fetchPluginsFromMap = (ext) => {
    return pluginsMap.filter((pluginObj) => pluginObj.name === getPluginTypeDisplayName(ext));
  };

  extensions.forEach((ext) => {
    const plugins = pluginTypes[ext];
    const fetchedPluginsMap = fetchPluginsFromMap(ext);

    if (!fetchedPluginsMap.length) {
      pluginsMap.push({
        name: getPluginTypeDisplayName(ext),
        plugins: plugins,
        pluginTypes: [ext],
      });
    } else {
      fetchedPluginsMap[0].plugins = fetchedPluginsMap[0].plugins.concat(plugins);
      fetchedPluginsMap[0].pluginTypes.push(ext);
    }
  });
  pluginsMap = orderPluginTypes(pluginsMap);

  async function init() {
    await fetchPluginsDefaultVersions();

    fetchPlugins({
      namespace: getCurrentNamespace(),
      pipelineType: selectedArtifact.name,
      version: cdapVersion,
    });
  }

  function checkAndShowConfirmationModalOnDirtyState() {
    const proceedDefer = new Defer<boolean>();
    const closeModal = (shouldProceed) => {
      proceedDefer.resolve(shouldProceed);
      dispatch({
        type: UiActions.CLOSE_MODAL,
      });
    };

    dispatch({
      type: UiActions.OPEN_MODAL,
      payload: {
        render: (
          <DirtyStateConfirmationModal 
            onClose={closeModal}
          />
        ),
        onClose: closeModal,
      },
    });

    return proceedDefer.promise;
  }

  async function onArtifactChange(newArtifact) {
    const newSelectedArtifact = artifacts.find((artifact) => artifact.name === newArtifact);
    const proceedToNextStep = await checkAndShowConfirmationModalOnDirtyState();
    if (!proceedToNextStep) {
      return;
    }

    setSelectedArtifact(newSelectedArtifact);
    // TODO: set relevant configs for the selected artifact
  }

  // TODO: Add correct type for node
  function onItemClicked (event: React.MouseEvent<HTMLElement>, node: any) {
    if (event) {
      event.stopPropagation();
    }

    if (node.action === 'createTemplate') {
      createPluginTemplate(node.contentData, 'create');
    } else if (node.action === 'deleteTemplate') {
      deletePluginTemplate(node.contentData);
    } else if (node.action === 'editTemplate') {
      createPluginTemplate(node.contentData, 'edit');
    } else {
      addPluginToCanvas(event, node);
    }
  }

  // TODO: add correct types for node
  async function createPluginTemplate(node: any, mode: TStudioUiMode) {

  }

  // TODO: add correct types for node
  async function deletePluginTemplate(node: any) {

  }

  // TODO: add correct types for node
  async function addPluginToCanvas(event: React.MouseEvent<HTMLElement>, node: any) {
    const getMatchedPlugin = (plugin) => {
      if (plugin.pluginTemplate) {
        return plugin;
      }
      let item = [plugin];
      const plugins = pluginTypes[node.type];
      let matchedPlugin = plugins.filter((plug) => plug.name === node.name && !plug.pluginTemplate);
      if (matchedPlugin.length) {
        item = matchedPlugin[0].allArtifacts.filter((plug) => _isEqual(plug.artifact, plugin.defaultArtifact));
      }
      return item[0];
    };

    let item;
    if (node.templateName) {
      item = node;
    } else {
      item = getMatchedPlugin(node);
      updatePluginDefaultVersion(item);
    }

    ///////////////////////////////
    this.hydratorNodeActions.resetSelectedNode();
    let name = item.name || item.pluginTemplate;
    const configProperties = {};
    let configurationGroups;
    let widgets;

    if (!item.pluginTemplate) {
      let itemArtifact = item.artifact;
      let key = `${item.name}-${item.type}-${itemArtifact.name}-${itemArtifact.version}-${itemArtifact.scope}`;
      widgets = this.myHelpers.objectQuery(this.availablePluginMap, key, 'widgets');
      const displayName = this.myHelpers.objectQuery(widgets, 'display-name');
      configurationGroups = this.myHelpers.objectQuery(widgets, 'configuration-groups');
      if (configurationGroups && configurationGroups.length > 0) {
        configurationGroups.forEach(cg => {
          cg.properties.forEach(prop => {
            configProperties[prop.name] = this.myHelpers.objectQuery(prop, 'widget-attributes', 'default');
          });
        });
      }

      name = displayName || name;
    }

    let filteredNodes = this.HydratorPlusPlusConfigStore.getNodes()
        .filter( node => (node.plugin.label ? node.plugin.label.indexOf(name) !== -1 : false) );
    let config;

    if (item.pluginTemplate) {
      config = {
        plugin: {
          label: (filteredNodes.length > 0 ? item.pluginTemplate + (filteredNodes.length+1) : item.pluginTemplate),
          name: item.pluginName,
          artifact: item.artifact,
          properties: item.properties,
        },
        icon: this.DAGPlusPlusFactory.getIcon(item.pluginName), // use getPluginIcon from utils
        type: item.pluginType,
        outputSchema: item.outputSchema,
        inputSchema: item.inputSchema,
        pluginTemplate: item.pluginTemplate,
        description: item.description,
        lock: item.lock,
        configGroups: configurationGroups,
        filters: widgets && widgets.filters
      };
    } else {
      config = {
        plugin: {
          label: (filteredNodes.length > 0 ? name + (filteredNodes.length+1) : name),
          artifact: item.artifact,
          name: item.name,
          properties: configProperties,
        },
        icon: item.icon,
        description: item.description,
        type: item.type,
        warning: true,
        configGroups: configurationGroups,
        filters: widgets && widgets.filters
      };
    }
    this.hydratorNodeActions.addNode(config);
  }
  

  return {
    artifacts,
    selectedArtifact,
    pluginsMap,

    onArtifactChange,
    onItemClicked,
    createPluginTemplate,
  };
}
