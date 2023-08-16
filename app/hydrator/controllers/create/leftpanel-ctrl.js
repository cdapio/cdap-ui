/*
 * Copyright © 2015-2017 Cask Data, Inc.
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
import { StudioRoutes } from 'components/hydrator/components/StudioRoutes';
import NamespaceStore from 'services/NamespaceStore';
import { HydratorPlusPlusOrderingFactory } from '../../services/hydrator-plus-ordering-factory';
// import { uiSupportedArtifacts } from 'services/global-constants';

const uiSupportedArtifacts = ['cdap-sql-pipeline', 'cdap-data-streams', 'cdap-data-pipeline'];
export class HydratorPlusPlusLeftPanelCtrl {
  constructor($rootScope, HydratorPlusPlusLeftPanelStore, MyCDAPDataSource, HydratorPlusPlusConfigStore, HydratorPlusPlusPluginActions, DAGPlusPlusFactory, DAGPlusPlusNodesActionsFactory, NonStorePipelineErrorFactory, $uibModal, myAlertOnValium, $state, $q, PluginTemplatesDirActions, LEFTPANELSTORE_ACTIONS, myHelpers, $timeout, mySettings, PipelineAvailablePluginsActions, AvailablePluginsStore, AVAILABLE_PLUGINS_ACTIONS, myPipelineApi) {
    this.myPipelineApi = myPipelineApi;
    this.$state = $state;
    this.$scope = $rootScope.$new(true, undefined);
    this.HydratorPlusPlusConfigStore = HydratorPlusPlusConfigStore;
    this.DAGPlusPlusFactory = DAGPlusPlusFactory;
    this.DAGPlusPlusNodesActionsFactory = DAGPlusPlusNodesActionsFactory;
    this.NonStorePipelineErrorFactory = NonStorePipelineErrorFactory;
    this.PluginTemplatesDirActions = PluginTemplatesDirActions;
    this.useRootScopeStore = false;
    this.version = undefined;
    if ($rootScope.stores) {
      this.leftpanelStore = $rootScope.stores;
      this.useRootScopeStore = true;
    } else {
      this.leftpanelStore = HydratorPlusPlusLeftPanelStore;
    }
    this.ReactStores = window.ReactStores;

    window.leftPanelStore = this.leftPanelStore;

    this.MyCDAPDataSource = new MyCDAPDataSource();

    this.myAlertOnValium = myAlertOnValium;
    this.$q = $q;
    this.leftpanelActions = HydratorPlusPlusPluginActions;
    this.LEFTPANELSTORE_ACTIONS = LEFTPANELSTORE_ACTIONS;
    this.myHelpers = myHelpers;
    this.mySettings = mySettings;
    this.PipelineAvailablePluginsActions = PipelineAvailablePluginsActions;
    this.AvailablePluginsStore = AvailablePluginsStore;
    this.AVAILABLE_PLUGINS_ACTIONS = AVAILABLE_PLUGINS_ACTIONS;

    this.pluginsMap = [];
    this.sourcesToVersionMap = {};
    this.transformsToVersionMap = {};
    this.sinksToVersionMap = {};
    this.artifacts = [];
    this.configStoreArtifact = this.HydratorPlusPlusConfigStore.getArtifact();
    this.selectedArtifact = undefined;
    this.artifactToRevert = undefined;
    this.availablePluginMap = this.AvailablePluginsStore.getState().plugins.pluginsMap;
    this.onV2ItemClicked = this.onV2ItemClicked.bind(this);
    this.onArtifactChangeV2 = this.onArtifactChangeV2.bind(this);
    this.createPluginTemplateV2 = this.createPluginTemplate.bind(this);
    this.isEdit = new URLSearchParams(window.location.href).get('isEdit') === 'true';
    // this.rVersion();
    this.init();
    
    var sub = this.leftpanelStore.subscribe( () => {
      let state = this.leftpanelStore.getState();

      let extensions = state.extensions;
      let pluginsList = state.plugins.pluginTypes;

      this.pluginsMap = []

      if (!extensions.length) {
        return;
      }

      extensions.forEach( (ext) => {
        let fetchPluginsFromMap = (ext) => {
          return this.pluginsMap.filter( pluginObj => pluginObj.name === HydratorPlusPlusOrderingFactory.getPluginTypeDisplayName(ext));
        };

        let plugins = pluginsList[ext];
        let fetchedPluginsMap = fetchPluginsFromMap(ext);

        if (!fetchedPluginsMap.length) {
          this.pluginsMap.push({
            name: HydratorPlusPlusOrderingFactory.getPluginTypeDisplayName(ext),
            plugins: plugins,
            pluginTypes: [ext] // Since we group plugin types now under one label we need ot keep track of fetchPlugins call for each plugin type.
          });
        } else {
          if (plugins && fetchedPluginsMap[0].plugins) {
            fetchedPluginsMap[0].plugins = fetchedPluginsMap[0].plugins.concat(plugins);
            fetchedPluginsMap[0].pluginTypes.push(ext);
          }
        }
      });
      this.pluginsMap = HydratorPlusPlusOrderingFactory.orderPluginTypes(this.pluginsMap);
      this.ReactStores.dispatch({
        type: 'PLUGINS_MAP_FETCH',
        payload: {
          pluginsMap: this.pluginsMap
        }
      })
    });

    let availablePluginSub = this.AvailablePluginsStore.subscribe(() => {
      this.availablePluginMap = this.AvailablePluginsStore.getState().plugins.pluginsMap;
      this.ReactStores.dispatch({
        type: 'AVAILABLE_PLUGINS_FETCH',
        payload: {
          availablePluginMap: this.availablePluginMap
        }
      })
    });

    var leftPanelStoreTimeout = $timeout(() => {
      this.leftpanelStore.dispatch({
        type: this.LEFTPANELSTORE_ACTIONS.PLUGIN_DEFAULT_VERSION_CHECK_AND_UPDATE
      });
      const defaultVersionMap = this.leftpanelStore.getState().plugins.pluginToVersionMap;
      this.mySettings.get('CURRENT_CDAP_VERSION')
      .then((defaultCDAPVersion) => {
        if (this.version !== defaultCDAPVersion) {
          return this.mySettings
            .set('plugin-default-version', {})
            .then(() => {
              this.mySettings.set('CURRENT_CDAP_VERSION', this.version);
            });
        }
        this.mySettings.set('plugin-default-version', defaultVersionMap);
      });
    }, 10000);


    this.leftPanelStoreFetchExtension = this.leftPanelStoreFetchExtension.bind(this);

    let eventEmitter = window.CaskCommon.ee(window.CaskCommon.ee);
    let globalEvents = window.CaskCommon.globalEvents;

    eventEmitter.on(globalEvents.ARTIFACTUPLOAD, this.leftPanelStoreFetchExtension);

    this.$uibModal = $uibModal;
    this.$scope.$on('$destroy', () => {
      this.leftpanelStore.dispatch({ type: this.LEFTPANELSTORE_ACTIONS.RESET});
      sub();
      availablePluginSub();
      $timeout.cancel(leftPanelStoreTimeout);

      this.AvailablePluginsStore.dispatch({ type: this.AVAILABLE_PLUGINS_ACTIONS.reset });

      eventEmitter.off(globalEvents.ARTIFACTUPLOAD, this.leftPanelStoreFetchExtension);
    });
  }
  getNamespace() {
    // /pipelines/ns/:namespace
    return window.location.pathname.split('/')[3];
  }

  getAllArtifacts() {
    var that = this;

    return fetch(`/api/v3/namespaces/${this.getNamespace()}/artifacts?scope=SYSTEM`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (!res.length) {
          return;
        } else {
          const filteredRes = res
            .filter(artifact => artifact.version === window.CaskCommon.VersionStore.getState().version)
            .filter(r => uiSupportedArtifacts.indexOf(r.name) !== -1 )
            .map(r => {
              r.label = HydratorPlusPlusOrderingFactory.getArtifactDisplayName(r.name);
              return r;
            });
          that.artifacts = filteredRes;
          that.selectedArtifact = filteredRes[1];
          this.ReactStores.dispatch({
            type: 'ARTIFACTS_FETCH',
            payload: {
              artifacts: filteredRes
            }
          })
          this.ReactStores.dispatch({
            type: 'ARTIFACT_SET',
            payload: {
              selectedArtifact: filteredRes[1]
            }
          })
          that.artifactToRevert = that.selectedArtifact;
          return that.selectedArtifact;
        }
      });
  }

  init() {
    var that = this;
    fetch('/api/v3/version').then((res) => res.json()).then((res) => {
      that.version = res.version;
      this.getAllArtifacts().then(() => {
        that.PipelineAvailablePluginsActions.fetchPlugins(
          {
            namespace: that.getNamespace(),
            pipelineType: that.selectedArtifact.name,
            version: that.version,
            scope: that.$scope
          }
        );
        
        if (that.useRootScopeStore) {
          that.leftpanelActions.fetchDefaultVersion();
        } else {
          that.leftpanelStore.dispatch(
            that.leftpanelActions.fetchDefaultVersion()
          );
        }
      })
    })

  }

  leftPanelStoreFetchExtension() {
    this.leftpanelStore.dispatch({ type: this.LEFTPANELSTORE_ACTIONS.RESET});
    this.pluginsMap.splice(0, this.pluginsMap.length);

    this.init();
  }

  onArtifactChange() {
    this._checkAndShowConfirmationModalOnDirtyState()
      .then(proceedToNextStep => {
        if (!proceedToNextStep) {
          this.selectedArtifact = this.artifactToRevert;
        } else {
          this.HydratorPlusPlusConfigStore.setState(this.HydratorPlusPlusConfigStore.getDefaults());
          this.$state.go('hydrator.create', {
            namespace: this.getNamespace(),
            artifactType: this.selectedArtifact.name,
            data: null,
          }, {reload: true, inherit: false});
        }
      });
  }

  onArtifactChangeV2(newArtifact) {
    this.selectedArtifact = this.artifacts.find((art) => {
      return art.name === newArtifact;
    });
    this.ReactStores.dispatch({
      type: 'ARTIFACT_SET',
      payload: {
        selectedArtifact: this.selectedArtifact
      }
    })
    this.PipelineAvailablePluginsActions.fetchPlugins(
      {
        namespace: this.getNamespace(),
        pipelineType: this.selectedArtifact.name,
        version: this.version,
        scope: this.$scope
      }
    );
    this._checkAndShowConfirmationModalOnDirtyState()
      .then(proceedToNextStep => {
        if (!proceedToNextStep) {
          this.selectedArtifact = this.artifactToRevert;
        } else {
          this.HydratorPlusPlusConfigStore.setState(this.HydratorPlusPlusConfigStore.getDefaults());
          this.$state.go('hydrator.create', {
            namespace: this.getNamespace(),
            artifactType: this.selectedArtifact.name,
            data: null,
          }, {reload: true, inherit: false});
        }
      });
  }

  _checkAndShowConfirmationModalOnDirtyState(proceedCb) {
    let goTonextStep = true;
    let isStoreDirty = this.HydratorPlusPlusConfigStore.getIsStateDirty();
    if (isStoreDirty) {
      return this.$uibModal.open({
        templateUrl: '/assets/features/hydrator/templates/create/popovers/canvas-overwrite-confirmation.html',
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowTopClass: 'confirm-modal hydrator-modal center',
        controller: ['$scope', 'HydratorPlusPlusConfigStore', 'HydratorPlusPlusConfigActions', function($scope, HydratorPlusPlusConfigStore, HydratorPlusPlusConfigActions) {
          $scope.isSaving = false;
          $scope.discard = () => {
            goTonextStep = true;
            if (proceedCb) {
              proceedCb();
            }
            $scope.$close();
          };
          $scope.save = () => {
            let pipelineName = HydratorPlusPlusConfigStore.getName();
            if (!pipelineName.length) {
              HydratorPlusPlusConfigActions.saveAsDraft();
              goTonextStep = false;
              $scope.$close();
              return;
            }
            var unsub = HydratorPlusPlusConfigStore.registerOnChangeListener( () => {
              let isStateDirty = HydratorPlusPlusConfigStore.getIsStateDirty();
              // This is solely used for showing the spinner icon until the modal is closed.
              if(!isStateDirty) {
                unsub();
                goTonextStep = true;
                $scope.$close();
              }
            });
            HydratorPlusPlusConfigActions.saveAsDraft();
            $scope.isSaving = true;
          };
          $scope.cancel = () => {
            $scope.$close();
            goTonextStep = false;
          };
        }]
      })
      .closed
      .then(() => {
        return goTonextStep;
      });
    } else {
      if (proceedCb) {
        proceedCb();
      }
      return this.$q.when(goTonextStep);
    }
  }

  /**
   * This is a copy of onLeftSidePanelItemClicked
   * with the scope bound to the function -- copied
   * so we don't break original functionality
   */
  onV2ItemClicked(event, node) {
    if (event) {
      event.stopPropagation();
    }
    if (node.action === 'createTemplate') {
      this.createPluginTemplate(node.contentData, 'create');
    } else if(node.action === 'deleteTemplate') {
      this.deletePluginTemplate(node.contentData);
    } else if(node.action === 'editTemplate') {
      this.createPluginTemplate(node.contentData, 'edit');
    } else {
      this.addPluginToCanvas(event, node);
    }
  }

  onLeftSidePanelItemClicked(event, node) {
    event.stopPropagation();
    if (node.action === 'createTemplate') {
      this.createPluginTemplate(node.contentData, 'create');
    } else if(node.action === 'deleteTemplate') {
      this.deletePluginTemplate(node.contentData);
    } else if(node.action === 'editTemplate') {
      this.createPluginTemplate(node.contentData, 'edit');
    } else {
      this.addPluginToCanvas(event, node);
    }
  }

  deletePluginTemplate(node) {
    let templateType = this.HydratorPlusPlusConfigStore.getArtifact().name;
    this.$uibModal
      .open({
        templateUrl: '/assets/features/hydrator/templates/partial/plugin-delete-confirmation.html',
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowTopClass: 'confirm-modal hydrator-modal',
        controller: 'PluginTemplatesDeleteCtrl',
        resolve: {
          rNode: () => node,
          rTemplateType: () => templateType
        }
      });
  }

  createPluginTemplate(node, mode) {
    let templateType = this.HydratorPlusPlusConfigStore.getArtifact().name;
    this.$uibModal
      .open({
        templateUrl: '/assets/features/hydrator/templates/create/popovers/plugin-templates.html',
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowTopClass: 'plugin-templates-modal hydrator-modal node-config-modal',
        controller: 'PluginTemplatesCreateEditCtrl',
        resolve: {
          rTemplateType: () => templateType
        }
      })
      .rendered
      .then(() => {
        this.PluginTemplatesDirActions.init({
          templateType: node.templateType || this.selectedArtifact.name,
          pluginType: node.pluginType || node.type,
          mode: mode === 'edit'? 'edit': 'create',
          templateName: node.pluginTemplate,
          pluginName: node.pluginName || node.name
        });
      });
  }

  addPluginToCanvas(event, node) {
    const getMatchedPlugin = (plugin) => {
      if (plugin.pluginTemplate) {
        return plugin;
      }
      let item = [plugin];
      let plugins = this.leftpanelStore.getState().plugins.pluginTypes[node.type];
      let matchedPlugin = plugins.filter( plug => plug.name === node.name && !plug.pluginTemplate);
      if (matchedPlugin.length) {
        item = matchedPlugin[0].allArtifacts.filter( plug => angular.equals(plug.artifact, plugin.defaultArtifact));
      }
      return item[0];
    };
    let item;
    if (node.templateName) {
      item = node;
    } else {
      item = getMatchedPlugin(node);
      this.leftpanelStore.dispatch(
        this.leftpanelActions.updateDefaultVersion(item)
      );
    }

    this.DAGPlusPlusNodesActionsFactory.resetSelectedNode();
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
        icon: this.DAGPlusPlusFactory.getIcon(item.pluginName),
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
    this.DAGPlusPlusNodesActionsFactory.addNode(config);
  }
}

angular.module(PKG.name + '.feature.hydrator')
  .controller('HydratorPlusPlusLeftPanelCtrl', HydratorPlusPlusLeftPanelCtrl);
