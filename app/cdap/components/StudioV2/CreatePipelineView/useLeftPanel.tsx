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
import { fetchPluginsDefaultVersions } from '../store/plugins/actions';

interface IStudioV2PageParams {
  namespace: string;
  isEdit?: boolean;
}

interface IHydratorConfigStore {
  // TODO: fill in the details from ../stores
}

interface IPluginActions {
  // TODO: fill in the details from ../actions
}

interface IHydratorNodeActions {
  // TODO: fill in the details from ../actions
}

interface IHydratorUiModalActions {
  // TODO: fill in the details from ../actions
}

interface IHydratorSettings {
  // fill in the types
  get();
  set();
}

interface ILeftPanelController {
  artifacts: any[];
  selectedArtifact: any;
  pluginsMap: any[];

  onArtifactChange: (value: any) => void;
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
  const pluginsList = useSelector((state) => state.plugins.pluginTypes);
  const availablePluginsMap = useSelector((state) => state.availablePlugins.pluginsMap);

  useEffect(() => {
    fetchSystemArtifacts();
    init();
  }, []);

  let pluginsMap = [];
  const fetchPluginsFromMap = (ext) => {
    return pluginsMap.filter((pluginObj) => pluginObj.name === getPluginTypeDisplayName(ext));
  };

  extensions.forEach((ext) => {
    const plugins = pluginsList[ext];
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

  async function checkAndShowConfirmationModalOnDirtyState() {
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

    console.log(newSelectedArtifact);
    setSelectedArtifact(newSelectedArtifact);
    // TODO: set relevant configs for the selected artifact
  }

  return {
    artifacts,
    selectedArtifact,
    pluginsMap,
    onArtifactChange,
  };
}
