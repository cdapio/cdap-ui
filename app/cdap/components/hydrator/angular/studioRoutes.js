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

import {StudioRoutes} from 'components/hydrator/components/StudioRoutes';
import { HydratorPlusPlusLeftPanelCtrl } from '../../../../hydrator/controllers/create/leftpanel-ctrl';
import { HydratorPlusPlusTopPanelCtrl } from '../../../../hydrator/controllers/create/toppanel-ctrl';

angular.module(PKG.name + '.feature.hydrator')
  .factory('MyLeftPanelCtrl', function($rootScope, HydratorPlusPlusLeftPanelStore, MyCDAPDataSource, HydratorPlusPlusConfigStore, HydratorPlusPlusPluginActions, DAGPlusPlusFactory, DAGPlusPlusNodesActionsFactory, NonStorePipelineErrorFactory, $uibModal, myAlertOnValium, $state, $q, PluginTemplatesDirActions, HydratorPlusPlusOrderingFactory, LEFTPANELSTORE_ACTIONS, myHelpers, $timeout, mySettings, PipelineAvailablePluginsActions, AvailablePluginsStore, AVAILABLE_PLUGINS_ACTIONS, myPipelineApi) {
    return new HydratorPlusPlusLeftPanelCtrl($rootScope, HydratorPlusPlusLeftPanelStore, MyCDAPDataSource, HydratorPlusPlusConfigStore, HydratorPlusPlusPluginActions, DAGPlusPlusFactory, DAGPlusPlusNodesActionsFactory, NonStorePipelineErrorFactory, $uibModal, myAlertOnValium, $state, $q, PluginTemplatesDirActions, HydratorPlusPlusOrderingFactory, LEFTPANELSTORE_ACTIONS, myHelpers, $timeout, mySettings, PipelineAvailablePluginsActions, AvailablePluginsStore, AVAILABLE_PLUGINS_ACTIONS, myPipelineApi);
  })
  .factory('MyTopPanelCtrl', function(
    HydratorPlusPlusConfigStore,
    HydratorPlusPlusConfigActions,
    $uibModal,
    DAGPlusPlusNodesActionsFactory,
    GLOBALS,
    myHelpers,
    HydratorPlusPlusConsoleStore,
    myPipelineExportModalService,
    $timeout,
    HydratorPlusPlusPreviewStore,
    HydratorPlusPlusPreviewActions,
    $interval,
    myPipelineApi,
    $state,
    myAlertOnValium,
    MY_CONFIG,
    PREVIEWSTORE_ACTIONS,
    $q,
    NonStorePipelineErrorFactory,
    // rArtifacts,
    $window,
    myPreviewLogsApi,
    DAGPlusPlusNodesStore,
    myPreferenceApi,
    HydratorPlusPlusHydratorService,
    $rootScope,
    uuid,
    HydratorUpgradeService,
    MyPollingService
  ) {
    return new HydratorPlusPlusTopPanelCtrl(
      HydratorPlusPlusConfigStore,
      HydratorPlusPlusConfigActions,
      $uibModal,
      DAGPlusPlusNodesActionsFactory,
      GLOBALS,
      myHelpers,
      HydratorPlusPlusConsoleStore,
      myPipelineExportModalService,
      $timeout,
      HydratorPlusPlusPreviewStore,
      HydratorPlusPlusPreviewActions,
      $interval,
      myPipelineApi,
      $state,
      myAlertOnValium,
      MY_CONFIG,
      PREVIEWSTORE_ACTIONS,
      $q,
      NonStorePipelineErrorFactory,
      // rArtifacts,
      $window,
      myPreviewLogsApi,
      DAGPlusPlusNodesStore,
      myPreferenceApi,
      HydratorPlusPlusHydratorService,
      $rootScope,
      uuid,
      HydratorUpgradeService,
      MyPollingService
    );
  })
  .directive('studioRoutes',function(MyLeftPanelCtrl, MyTopPanelCtrl, reactDirective) {
    // debugger;
    return reactDirective(
      StudioRoutes,
      ['leftPanelCtrl', 'topPanelCtrl'],
      // ['onArtifactChange','pluginsMap', 'selectedArtifact', 'artifacts', 'groups', 'itemGenericName', 'groupGenericName', 'onPanelItemClick','isEdit', 'createPluginTemplate']
      {},
      {
        leftPanelCtrl: MyLeftPanelCtrl,
        topPanelCtrl: MyTopPanelCtrl,
      }
    );
  })
