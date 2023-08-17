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

import { rPipelineDetails } from 'components/hydrator/helpers/rPipeline';
import globalEvents from 'services/global-events';
import debounce from 'lodash/debounce';
import { objectQuery } from 'services/helpers';
import { StudioRoutes } from 'components/hydrator/components/StudioRoutes';
import { HydratorPlusPlusLeftPanelCtrl } from 'hydrator/controllers/create/leftpanel-ctrl';
import { HydratorPlusPlusTopPanelCtrl } from 'hydrator/controllers/create/toppanel-ctrl';
import { MyDAGController } from '../../../../directives/dag-plus/my-dag-ctrl';
import { HydratorPlusPlusCreateCanvasCtrl } from 'hydrator/controllers/create/canvas-ctrl';
import { HydratorPlusPlusStudioCtrl } from 'hydrator/controllers/create/create-studio-ctrl';
import { isVersionInRange } from 'hydrator/services/hydrator-service';
import { GLOBALS } from 'services/global-constants';
import { HydratorPlusPlusOrderingFactory } from 'hydrator/services/hydrator-plus-ordering-factory';
import { PipeDetailsCtrl } from 'hydrator/controllers/detail-ctrl';
import { PipeCanvasCtrl } from 'hydrator/controllers/detail/canvas-ctrl';

const uiSupportedArtifacts = () => {
  const theme = window.CaskCommon.ThemeHelper.Theme;
  const uiSupported = [GLOBALS.etlDataPipeline];

  if (theme.showRealtimePipeline !== false) {
    uiSupported.push(GLOBALS.etlDataStreams);
  }

  if (theme.showSqlPipeline !== false) {
    uiSupported.push(GLOBALS.eltSqlPipeline);
  }

  return uiSupported;
}

const getVersion = () => {
  const rCDAPVersion = window.CaskCommon.VersionStore.getState().version;
  if (rCDAPVersion !== '') {
    return Promise.resolve(rCDAPVersion);
  } else {
    return fetch(`/api/v3/version`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      window.CaskCommon.VersionStore.dispatch({
        type: window.CaskCommon.VersionActions.updateVersion,
        payload: {
          version: res.version
        }
      });

      return res.version;
    });
  }

}

const fetchArtifacts = () => {
  return getVersion().then((version) => {
    return fetchArtifactsWithVersion(version)
  });
}

const fetchArtifactsWithVersion = (rVersion) => {
  const namespace = window.location.pathname.split('/')[3];
  return fetch(`/api/v3/namespaces/${namespace}/artifacts`).then((res) => {
    return res.json();
  }).then((res) => {
    return res
      .filter(artifact => artifact.version === rVersion)
      .filter(r => uiSupportedArtifacts().indexOf(r.name) !== -1 )
      .map(r => {
        r.label = HydratorPlusPlusOrderingFactory.getArtifactDisplayName(r.name);
        return r;
      });
  });

}    


angular.module(PKG.name + '.feature.hydrator')
  .service('FetchArtifacts', function() {
    return fetchArtifacts; 
  })
  .factory('MySelectedArtifact', function($rootScope, GLOBALS) {
    const $stateParams = $rootScope.$stateParams;
    $rootScope.$stateParams.namespace = window.location.pathname.split('/')[3];
    return getVersion().then((rCDAPVersion) => {
      let isArtifactValid = (backendArtifacts, artifact) => {
        return backendArtifacts.filter( a =>
          (a.name === artifact && a.version === rCDAPVersion)
        ).length;
      };
  
      let isAnyUISupportedArtifactPresent = (backendArtifacts) => {
        return backendArtifacts
          .filter( artifact => artifact.version === rCDAPVersion)
          .filter( artifact => uiSupportedArtifacts().indexOf(artifact.name) !== -1);
      };
  
      let getValidUISupportedArtifact = (backendArtifacts) => {
        let validUISupportedArtifact = isAnyUISupportedArtifactPresent(backendArtifacts);
        return validUISupportedArtifact.length ?  validUISupportedArtifact[0]: false;
      };
  
      let showError = (error) => {
        window.CaskCommon.ee.emit(globalEvents.PAGE_LEVEL_ERROR, error);
      };
      const namespace = window.location.pathname.split('/')[3];
      return fetch(`/api/v3/namespaces/${namespace}/artifacts`).then((res) => {
        return res.json();
      }).then((artifactsFromBackend) => {
        let showNoArtifactsError = () => {
          showError({ data: GLOBALS.en.hydrator.studio.error['MISSING-SYSTEM-ARTIFACTS'], statusCode: 404 });
        };
  
        let chooseDefaultArtifact = () => {
          if (!isArtifactValid(artifactsFromBackend, GLOBALS.etlDataPipeline)) {
            if (!isAnyUISupportedArtifactPresent(artifactsFromBackend).length) {
              return showNoArtifactsError();
            } else {
              $stateParams.artifactType = getValidUISupportedArtifact(artifactsFromBackend).name;
              return $stateParams.artifactType;
            }
          } else {
            $stateParams.artifactType = GLOBALS.etlDataPipeline;
            return $stateParams.artifactType;
          }
        };
  
        if (!artifactsFromBackend.length) {
          return showNoArtifactsError();
        }
  
        if (!$stateParams.artifactType) {
          $stateParams.artifactType = getValidUISupportedArtifact(artifactsFromBackend).name;
        }
  
        if (!isArtifactValid(artifactsFromBackend, $stateParams.artifactType)) {
          return chooseDefaultArtifact();
        } else {
          return $stateParams.artifactType;
        }
      }).catch((err) => {
        showError(err);
      });
    });
   })
  .service('ConfigResolver', function(
      $rootScope, mySettings, $q, myHelpers, $window, HydratorPlusPlusHydratorService, myPipelineApi
    ) {
      const $stateParams = $rootScope.$stateParams;
      return getVersion().then((rCDAPVersion) => {
        const data = {
          authorizedRoles: '*',
          highlightTab: 'development'
        }
        let resolver = {};
        const defer = new Promise((resolve) => resolve(resolver));
        const urlParams = new URLSearchParams(window.location.href);
        const processDraft = (draft) => {
          if (draft instanceof Object) {
            let versionIsInRange = isVersionInRange({
                supportedVersion: rCDAPVersion,
                versionRange: draft.artifact.version
              });

            if (versionIsInRange) {
              draft.artifact.version = rCDAPVersion;
            } else {
              resolver = { valid: false, config: draft, upgrade: true };
              return;
            }
            resolver = { valid: true, config: draft };
          } else {
            resolver = { valid: false };
          }
        };

        if (false) {
          // if stateparams.data - set by routes.js directly on the state
          // on the same level as onEnter or url ie state('', { data: {}})
          // this seems to always be set because rConfig runs on the create route?
          // This is being used while cloning a published a pipeline.
          // the data here must be from a previous config?
          let isVersionInRange = HydratorPlusPlusHydratorService
            .isVersionInRange({
              supportedVersion: rCDAPVersion,
              versionRange: $stateParams.data.artifact.version
            });
          if (isVersionInRange) {
            $stateParams.data.artifact.version = rCDAPVersion;
          } else {
            resolver = { valid: false };
          }
          resolver = {
            config: $stateParams.data,
            valid: true
          };
          return defer;
        }

        if (urlParams.has('draftId')) {
          const namespace = window.location.pathname.split('/')[3];
          const pipelineId = window.location.pathname.split('/')[5];
          const draftId = urlParams.get('draftId');
          const params = {
            context: namespace,
            pipelineId,
            draftId
          };
          // fetch(`/api/v3/namespaces/${namespace}/apps/:pipeline`).then((res) => {
          //   return res.json();
          // }).then((res) => {
          //   mySettings.get('hydratorDrafts', true)
          //     .then((res) => {

          //     })
          // });

          myPipelineApi.getDraft(params)
            .$promise
            .then(processDraft, () => {
              mySettings.get('hydratorDrafts', true)
                .then(function(res) {
                  processDraft(objectQuery(res, namespace, draftId));
                });
            });
        } else if (urlParams.has('configParams')) {
          // This is being used while adding a dataset/stream as source/sink from metadata to pipeline studio
          try {
            let config = JSON.parse(urlParams.configParams);
            resolver = { valid: true, config };
          } catch (e) {
            resolver = { valid: false };
          }
        } else if (urlParams.has('workspaceId')) {
          const workspaceId = urlParams.get('workspaceId');
          // This is being used by dataprep to pipelines transition
          try {
            let configParams = $window.localStorage.getItem(workspaceId);
            let config = JSON.parse(configParams);
            resolver = { valid: true, config };
          } catch (e) {
            resolver = { valid: false };
          }
          $window.localStorage.removeItem(workspaceId);
        } else if (urlParams.has('rulesengineid')) {
          const rulesengineId = urlParams.get('rulesengineid');
          try {
            let configParams = $window.localStorage.getItem(rulesengineId);
            let config = JSON.parse(configParams);
            resolver = { valid: true, config };
          } catch (e) {
            resolver = { valid: false };
          }
          $window.localStorage.removeItem(rulesengineId);
        } else if (urlParams.has('cloneId')) {
          const cloneId = urlParams.get('cloneId');
          try {
            let configParams = $window.localStorage.getItem(cloneId);
            let config = JSON.parse(configParams);
            resolver = { valid: true, config };
          } catch (e) {
            resolver = { valid: false };
          }
          $window.localStorage.removeItem(cloneId);
        } else {
          resolver = { valid: false };
        }

        return defer;
      })
      // const rCDAPVersion = function() {
      //   var defer = $q.defer();
      //   let cdapversion = window.CaskCommon.VersionStore.getState().version;
      //   if (cdapversion) {
      //     defer.resolve(cdapversion);
      //     return defer.promise;
      //   }
      //   const subscription = window.CaskCommon.VersionStore.subscribe(() => {
      //     let cdapversion = window.CaskCommon.VersionStore.getState().version;
      //     if (cdapversion) {
      //       defer.resolve(cdapversion);
      //       subscription();
      //     }
      //   });
      //   return defer.promise;
      // };
    })
  .factory('MyStudioCtrl', function(HydratorPlusPlusConfigActions, ConfigResolver, $rootScope, DAGPlusPlusNodesActionsFactory, HydratorPlusPlusHydratorService, HydratorPlusPlusConsoleActions, MySelectedArtifact, FetchArtifacts, myLocalStorage, HydratorPlusPlusConfigStore, $window, HydratorPlusPlusConsoleTabService, HydratorUpgradeService) {
    return new HydratorPlusPlusStudioCtrl(HydratorPlusPlusConfigActions, ConfigResolver, $rootScope, DAGPlusPlusNodesActionsFactory, HydratorPlusPlusHydratorService, HydratorPlusPlusConsoleActions, MySelectedArtifact, FetchArtifacts, myLocalStorage, HydratorPlusPlusConfigStore, $window, HydratorPlusPlusConsoleTabService, HydratorUpgradeService);
  })
  .factory('MyLeftPanelCtrl', function(
      $rootScope, HydratorPlusPlusLeftPanelStore, MyCDAPDataSource, HydratorPlusPlusConfigStore, HydratorPlusPlusPluginActions, DAGPlusPlusFactory, DAGPlusPlusNodesActionsFactory, NonStorePipelineErrorFactory, $uibModal, myAlertOnValium, $state, $q, PluginTemplatesDirActions, LEFTPANELSTORE_ACTIONS, myHelpers, $timeout, mySettings, PipelineAvailablePluginsActions, AvailablePluginsStore, AVAILABLE_PLUGINS_ACTIONS, myPipelineApi
    ) {
    return new HydratorPlusPlusLeftPanelCtrl($rootScope, HydratorPlusPlusLeftPanelStore, MyCDAPDataSource, HydratorPlusPlusConfigStore, HydratorPlusPlusPluginActions, DAGPlusPlusFactory, DAGPlusPlusNodesActionsFactory, NonStorePipelineErrorFactory, $uibModal, myAlertOnValium, $state, $q, PluginTemplatesDirActions, LEFTPANELSTORE_ACTIONS, myHelpers, $timeout, mySettings, PipelineAvailablePluginsActions, AvailablePluginsStore, AVAILABLE_PLUGINS_ACTIONS, myPipelineApi);
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
  .factory('MyDagCtrl', function(
      jsPlumb, $rootScope, $timeout, DAGPlusPlusFactory, GLOBALS, DAGPlusPlusNodesActionsFactory, $window, DAGPlusPlusNodesStore, $modifiedPopover, uuid, DAGPlusPlusNodesDispatcher, NonStorePipelineErrorFactory, AvailablePluginsStore, myHelpers, HydratorPlusPlusCanvasFactory, HydratorPlusPlusConfigStore, HydratorPlusPlusPreviewActions, HydratorPlusPlusPreviewStore
    ) {
    return new MyDAGController(jsPlumb, $rootScope, $timeout, DAGPlusPlusFactory, GLOBALS, DAGPlusPlusNodesActionsFactory, $window, DAGPlusPlusNodesStore, $modifiedPopover, uuid, DAGPlusPlusNodesDispatcher, NonStorePipelineErrorFactory, AvailablePluginsStore, myHelpers, HydratorPlusPlusCanvasFactory, HydratorPlusPlusConfigStore, HydratorPlusPlusPreviewActions, HydratorPlusPlusPreviewStore);
  })
  .factory('MyCanvasCtrl', function(
    $rootScope, DAGPlusPlusNodesStore, HydratorPlusPlusConfigStore, HydratorPlusPlusHydratorService, $uibModal, GLOBALS, DAGPlusPlusNodesActionsFactory, HydratorPlusPlusPreviewStore
  ) {
    return new HydratorPlusPlusCreateCanvasCtrl($rootScope, DAGPlusPlusNodesStore, HydratorPlusPlusConfigStore, HydratorPlusPlusHydratorService, $uibModal, GLOBALS, DAGPlusPlusNodesActionsFactory, HydratorPlusPlusPreviewStore);
  })
  .factory('MyPipeDetailsCtrl', function($rootScope, PipelineAvailablePluginsActions, GLOBALS, myHelpers, HydratorPlusPlusHydratorService, DAGPlusPlusNodesStore, myAlertOnValium) {
    if (window.location.href.match('/studio')) {
      return {};
    }

    return rPipelineDetails($rootScope.$stateParams.namespace, myAlertOnValium).then((rPipelineDetail) => {
      return new PipeDetailsCtrl(
        $rootScope, PipelineAvailablePluginsActions, GLOBALS, myHelpers, HydratorPlusPlusHydratorService, DAGPlusPlusNodesStore, rPipelineDetail
      );
    });
  })
  .factory('MyPipeCanvasCtrl', function(
    $rootScope, myAlertOnValium,
    DAGPlusPlusNodesActionsFactory, HydratorPlusPlusHydratorService, DAGPlusPlusNodesStore, $uibModal, MyPipelineStatusMapper, moment, $interval, myHelpers
  ) {
    if (window.location.href.match('/studio')) {
      return {};
    }

    return new PipeCanvasCtrl(
      $rootScope, myAlertOnValium,
      DAGPlusPlusNodesActionsFactory, HydratorPlusPlusHydratorService, DAGPlusPlusNodesStore, $uibModal, MyPipelineStatusMapper, moment, $interval, myHelpers)
  })
  .directive('studioRoutes',function(reactDirective,) {
    return reactDirective(
      StudioRoutes,
      ['leftPanelCtrl', 'topPanelCtrl', 'canvasCtrl', 'dagCtrl', 'pipeDetails', 'pipeCanvas'
      // 'nodes', 'connections', 'previewMode'
      ,'counter'],

    );
  })
  /**
   * BodyCtrl
   * attached to the <body> tag, mostly responsible for
   *  setting the className based events from $state and caskTheme
   */
  .controller('BodyCtrl', function ($scope, $cookies, $cookieStore, caskTheme, CASK_THEME_EVENT, $rootScope, $state, $log, MYSOCKET_EVENT, MyCDAPDataSource, MY_CONFIG, MYAUTH_EVENT, EventPipe, myAuth, $window, myAlertOnValium, myLoadingService, myHelpers,
    MyStudioCtrl, MyLeftPanelCtrl, MyTopPanelCtrl, MyCanvasCtrl, MyDagCtrl, DAGPlusPlusNodesStore, MyPipeDetailsCtrl, MyPipeCanvasCtrl
    // $http
    ) {
    this.$scope = $scope;
    this.studioCtrl = MyStudioCtrl;
    this.leftPanelCtrl = MyLeftPanelCtrl;
    this.topPanelCtrl = MyTopPanelCtrl;
    this.canvasCtrl = MyCanvasCtrl;
    this.dagCtrl = MyDagCtrl;
    this.pipeDetails = MyPipeDetailsCtrl;
    this.pipeCanvas = MyPipeCanvasCtrl;
    // this.nodes = DAGPlusPlusNodesStore.getNodes();
    // this.connections = DAGPlusPlusNodesStore.getConnections();
    // this.previewMode = MyCanvasCtrl.previewMode;
    window.BodyCtrl = this;
    window.CaskCommon.CDAPHelpers.setupExperiments();
    var activeThemeClass = caskTheme.getClassName();
    getVersion();
    $rootScope.stores = window.ReactStores;
    this.eventEmitter = window.CaskCommon.ee(window.CaskCommon.ee);
    this.pageLevelError = null;
    this.apiError = false;
    this.updateCounter = debounce(() => {
      this.counter = this.counter + 1;
    }, 100);

    // this.eventEmitter.on(globalEvents.NONAMESPACE, () => {
    //   this.pageLevelError = {
    //     errorCode: 403
    //   };
    // });
    // this.eventEmitter.on(globalEvents.PAGE_LEVEL_ERROR, (error) => {
    //   // If we already have no namespace error thrown it trumps all other 404s
    //   // and UI should show that the user does not have access to the namespace
    //   // instead of specific 404s which will be misleading.
    //   if (this.pageLevelError && this.pageLevelError.errorCode === 403) {
    //     return;
    //   }
    //   if (error.reset === true) {
    //     this.pageLevelError = null;
    //   } else {
    //     this.pageLevelError = myHelpers.handlePageLevelError(error);
    //   }
    // });    
    this.eventEmitter.on(globalEvents.UPDATE_BODY_CTRL, () => {
      // how ngReact works is kinda weird - controller updates don't propagate down to the children unless
      // its shallowly watching something. Essentially here we trigger an update of ngReact if something
      // in the controller updates. This was by far the easiest way to trigger that just having a counter increase
      // -- this should work up to the max int number.
      // -- this may be due to how the controllers feed things into the props of the react components. Its like
      // some kind of weird reference bug or something like that. Very confusing. Will be a lot better once we remove
      // all the angular
      this.updateCounter();
    });

    this.eventEmitter.on(globalEvents.API_ERROR, (hasError) => {
      if (this.apiError !== hasError) {
        this.apiError = true;
      }
    });

    $scope.copyrightYear = new Date().getFullYear();

    function getVersion() {
      fetch(`${document.location.origin}/api/v3/version`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      })
        .then((res) => {
          return res.json();
        })
        .then(function(res) {
          var data = res;

          $scope.version = data.version;
          $rootScope.cdapVersion = $scope.version;

          window.CaskCommon.VersionStore.dispatch({
            type: window.CaskCommon.VersionActions.updateVersion,
            payload: {
              version: data.version
            }
          });
        });
    }

    $scope.$on(CASK_THEME_EVENT.changed, function (event, newClassName) {
      if (!event.defaultPrevented) {
        $scope.bodyClass = $scope.bodyClass.replace(activeThemeClass, newClassName);
        activeThemeClass = newClassName;
      }
    });
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
      var classes = [];
      if (toState.data && toState.data.bodyClass) {
        classes = [toState.data.bodyClass];
      }
      else {
        var parts = toState.name.split('.'),
            count = parts.length + 1;
        while (1<count--) {
          classes.push('state-' + parts.slice(0,count).join('-'));
        }
      }
      if (toState.name !== fromState.name && myAlertOnValium.isAnAlertOpened()) {
        myAlertOnValium.destroy();
      }
      classes.push(activeThemeClass);

      $scope.bodyClass = classes.join(' ');

      myLoadingService.hideLoadingIcon();

      /**
       *  This is to make sure that the sroll position goes back to the top when user
       *  change state. UI Router has this function ($anchorScroll), but for some
       *  reason it is not working.
       **/
      $window.scrollTo(0, 0);
    });

    EventPipe.on(MYSOCKET_EVENT.reconnected, function () {
      $log.log('[DataSource] reconnected.');
      myLoadingService.hideLoadingIcon();
    });

    console.timeEnd(PKG.name);
  })

  .directive('initStores', function() {
    return {
      restrict: 'E',
      scope: {
        stores: '=',

      },
      bindToController: true,
      controller: 'BodyCtrl as BodyCtrl',
      template: `
        <my-global-navbar></my-global-navbar>
        <main class="container" id="app-container">
          <div ng-if="!BodyCtrl.pageLevelError">
              <studio-routes
                counter="BodyCtrl.counter"
                leftPanelCtrl="BodyCtrl.leftPanelCtrl"
                topPanelCtrl="BodyCtrl.topPanelCtrl"
                canvasCtrl="BodyCtrl.canvasCtrl"
                dagCtrl="BodyCtrl.dagCtrl"
                pipeDetails="BodyCtrl.pipeDetails"
                pipeCanvas="BodyCtrl.pipeCanvas"
              ></studio-routes>
          </div>
          <page403
            ng-if="BodyCtrl.pageLevelError && BodyCtrl.pageLevelError.errorCode === 403"
            message="BodyCtrl.pageLevelError.message"
          ></page403> 
          <page404
            ng-if="BodyCtrl.pageLevelError && BodyCtrl.pageLevelError.errorCode === 404"
            message="BodyCtrl.pageLevelError.message"
          ></page404>
          <page500
            ng-if="BodyCtrl.pageLevelError && BodyCtrl.pageLevelError.errorCode === 500"
            message="BodyCtrl.pageLevelError.message"
          ></page500>
        </main>

        <div class="alerts" id="alerts" data-cy="valium-banner-hydrator" data-testid="valium-banner-hydrator"></div>
        <loading-icon></loading-icon>
        <loading-indicator></loading-indicator>
        <status-alert-message></status-alert-message>
        <global-footer></global-footer>
        <auth-refresher></auth-refresher>
        <api-error-dialog ng-if="BodyCtrl.apiError"></api-error-dialog>
      `
    };
  })
