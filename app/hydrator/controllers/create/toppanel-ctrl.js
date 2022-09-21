/*
 * Copyright © 2015-2020 Cask Data, Inc.
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

class HydratorPlusPlusTopPanelCtrl {
  constructor(
    $stateParams,
    HydratorPlusPlusConfigStore,
    HydratorPlusPlusConfigActions,
    $uibModal,
    DAGPlusPlusNodesActionsFactory,
    GLOBALS,
    myHelpers,
    HydratorPlusPlusConsoleStore,
    myPipelineExportModalService,
    $timeout,
    $scope,
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
    rArtifacts,
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
    this.consoleStore = HydratorPlusPlusConsoleStore;
    this.myPipelineExportModalService = myPipelineExportModalService;
    this.HydratorPlusPlusConfigStore = HydratorPlusPlusConfigStore;
    this.GLOBALS = GLOBALS;
    this.HydratorPlusPlusConfigActions = HydratorPlusPlusConfigActions;
    this.$uibModal = $uibModal;
    this.DAGPlusPlusNodesActionsFactory = DAGPlusPlusNodesActionsFactory;
    this.parsedDescription = this.HydratorPlusPlusConfigStore.getDescription();
    this.myHelpers = myHelpers;
    this.$timeout = $timeout;
    this.PREVIEWSTORE_ACTIONS = PREVIEWSTORE_ACTIONS;
    this.previewStore = HydratorPlusPlusPreviewStore;
    this.previewActions = HydratorPlusPlusPreviewActions;
    this.$interval = $interval;
    this.myPipelineApi = myPipelineApi;
    this.myPreviewLogsApi = myPreviewLogsApi;
    this.myPreferenceApi = myPreferenceApi;
    this.DAGPlusPlusNodesStore = DAGPlusPlusNodesStore;
    this.$state = $state;
    this.myAlertOnValium = myAlertOnValium;
    this.currentPreviewId = null;
    this.$window = $window;
    this.viewConfig = false;
    this.viewScheduler = false;
    this.viewLogs = false;
    this.$q = $q;
    this.NonStorePipelineErrorFactory = NonStorePipelineErrorFactory;
    this.HydratorPlusPlusHydratorService = HydratorPlusPlusHydratorService;
    this.artifacts = rArtifacts;
    this.$rootScope = $rootScope;
    this.uuid = uuid;
    this.macrosMap = {};
    this.resolvedMacros = {};
    this.userRuntimeArgumentsMap = {};
    this.runtimeArguments = {};
    this.doesPreviewHaveEmptyMacros = true;
    this.$stateParams = $stateParams;
    this.HydratorUpgradeService = HydratorUpgradeService;
    this.startingPipeline = false;
    this.enablePipelineUpdate = false;
    this.pollingService = new MyPollingService($scope);

    this.closeLogs = this.closeLogs.bind(this);
    this.saveMetadataV2 = this.saveMetadataV2.bind(this);
    this.resetMetadataV2 = this.resetMetadataV2.bind(this);
    this.togglePreviewModeV2 = this.togglePreviewModeV2.bind(this);
    this.toggleConfigV2 = this.toggleConfigV2.bind(this);
    this.toggleSchedulerV2 = this.toggleSchedulerV2.bind(this);
    this.closeScheduler = this.closeScheduler.bind(this);
    this.onSaveDraftV2 = this.onSaveDraftV2.bind(this);
    this.onPublishV2 = this.onPublishV2.bind(this);
    this.onImportV2 = this.onImportV2.bind(this);
    this.onExportV2 = this.onExportV2.bind(this);
    this.startOrStopPreviewV2 = this.startOrStopPreviewV2.bind(this);
    this.onClickLogs = this.onClickLogs.bind(this);
    this.openMetadataV2 = this.openMetadataV2.bind(this);
    this.importFile2 = this.importFile2.bind(this);
    this.applyRuntimeArgumentsFromReactStore = this.applyRuntimeArgumentsFromReactStore.bind(
      this
    );
    this.getPostActions = this.getPostActions.bind(this);
    this.applyAndRunPipeline = this.applyAndRunPipeline.bind(this);
    this.saveChangeSummary = this.saveChangeSummary.bind(this);
    this.applyBatchConfigFromReactStore = this.applyBatchConfigFromReactStore.bind(this);
    this.applyRealtimeConfigFromReactStore = this.applyRealtimeConfigFromReactStore.bind(this);
    this.validatePluginProperties = this.validatePluginProperties.bind(this);
    this.getRuntimeArgumentsV2 = this.getRuntimeArgumentsV2.bind(this);
    this.getStoreConfig = this.getStoreConfig.bind(this);
    this.getScheduleInfo = this.getScheduleInfo.bind(this);
    this.getConfigForExport = this.getConfigForExport.bind(this);
    this.getParentVersion = this.getParentVersion.bind(this);

    this.setState();
    this.setActiveNodes();
    this.HydratorPlusPlusConfigStore.registerOnChangeListener(
      this.setState.bind(this)
    );
    this.DAGPlusPlusNodesStore.registerOnChangeListener(
      this.setActiveNodes.bind(this)
    );
    this.focusTimeout = null;
    this.fetchMacrosTimeout = null;
    this.timeoutInMinutes = 2;

    const themeShowSchedule =
      window.CaskCommon.ThemeHelper.Theme.showSchedules !== false;
    this.showSchedule =
      this.state.artifact.name === this.GLOBALS.etlDataPipeline &&
      themeShowSchedule;
    this.isEdit = this.$stateParams.isEdit ? this.$stateParams.isEdit === "true" : false;

    if ($stateParams.isClone) {
      this.openMetadata();
    }

    this.currentDraftId = this.HydratorPlusPlusConfigStore.getDraftId();
    if (
      this.currentDraftId &&
      this.currentDraftId ===
        this.$window.localStorage.getItem("LastDraftId") &&
      this.$window.localStorage.getItem("LastPreviewId") !== "null"
    ) {
      this.currentPreviewId = this.$window.localStorage.getItem(
        "LastPreviewId"
      );
      this.previewStore.dispatch(
        this.previewActions.setPreviewId(this.currentPreviewId)
      );
    }

    this.isPreviewEnabled =
      angular.isObject(MY_CONFIG.hydrator) &&
      MY_CONFIG.hydrator.previewEnabled === true;

    this.previewMode = false;
    this.previewLoading = true;

    if (this.currentPreviewId) {
      this.myPreviewLogsApi
        .getLogsStatus({
          namespace: this.$state.params.namespace,
          previewId: this.currentPreviewId,
        })
        .$promise.then(
          (statusRes) => {
            this.previewStartTime = statusRes.submitTime;
            this.previewLoading = false;

            this.previewStore.dispatch({
              type: this.PREVIEWSTORE_ACTIONS.SET_PREVIEW_STATUS,
              payload: {
                status: statusRes.status,
              },
            });

            const {
              WAITING,
              ACQUIRED,
              INIT,
              RUNNING,
            } = window.CaskCommon.PREVIEW_STATUS;
            this.updateTimerLabelAndTitle(statusRes);
            if ([WAITING, ACQUIRED, INIT, RUNNING].includes(statusRes.status)) {
              this.previewRunning = true;
              this.startTimer();
              this.startPollPreviewStatus(this.currentPreviewId);
            } else {
              this.calculateDuration(statusRes.endTime);
            }
          },
          (statusErr) => {
            console.log("ERROR: ", statusErr);
            this.setDefault();
          }
        );
    } else {
      this.setDefault();
    }

    let unsub = this.previewStore.subscribe(() => {
      let state = this.previewStore.getState().preview;
      this.previewMode = state.isPreviewModeEnabled;
      this.macrosMap = state.macros;
      this.userRuntimeArgumentsMap = state.userRuntimeArguments;
      this.timeoutInMinutes = state.timeoutInMinutes;
    });

    this.macrosMap = this.previewStore.getState().preview.macros;
    this.userRuntimeArgumentsMap = this.previewStore.getState().preview.userRuntimeArguments;

    if (Object.keys(this.macrosMap).length === 0) {
      if (this.fetchMacrosTimeout) {
        this.$timeout.cancel(this.fetchMacrosTimeout);
      }
      this.fetchMacrosTimeout = this.$timeout(() => {
        this.fetchMacros();
      });
    }

    $scope.$on("$destroy", () => {
      unsub();
      this.stopPreview(true);
      this.previewStore.dispatch(this.previewActions.togglePreviewMode(false));
      this.previewStore.dispatch(this.previewActions.resetPreview());
      this.$interval.cancel(this.previewTimerInterval);
      this.$timeout.cancel(this.focusTimeout);
      this.$timeout.cancel(this.fetchMacrosTimeout);
    });
  }

  setDefault() {
    this.previewStartTime = null;
    this.setDisplayDuration();
    this.updateTimerLabelAndTitle();
    this.previewTimerInterval = null;
    this.previewLoading = false;
    this.previewRunning = false;
  }

  setMetadata(metadata) {
    this.state.metadata = metadata;
  }
  setState() {
    this.state = {
      metadata: {
        name: this.HydratorPlusPlusConfigStore.getName(),
        description: this.HydratorPlusPlusConfigStore.getDescription(),
      },
      viewSettings:
        this.myHelpers.objectQuery(this.state, "viewSettings") || false,
      artifact: this.HydratorPlusPlusConfigStore.getArtifact(),
    };
  }
  setActiveNodes() {
    this.hasNodes = !!this.DAGPlusPlusNodesStore.getNodes().length;
    this.fetchMacros();
  }

  openMetadata() {
    this.metadataExpanded = true;
    this.invalidName = false;

    this.$timeout.cancel(this.focusTimeout);
    this.focusTimeout = this.$timeout(() => {
      document.getElementById("pipeline-name-input").focus();
    });
  }

  openMetadataV2() {
    this.metadataExpanded = true;
    this.invalidName = false;

    this.$timeout.cancel(this.focusTimeout);
    this.focusTimeout = this.$timeout(() => {
      document.getElementById("pipeline-name-input").focus();
    });
  }

  getPostActions() {
    return this.HydratorPlusPlusConfigStore.getPostActions();
  }

  getScheduleInfo() {
    const schedule = this.HydratorPlusPlusConfigStore.getSchedule();
    const maxConcurrentRuns = this.HydratorPlusPlusConfigStore.getMaxConcurrentRuns();
    return {schedule, maxConcurrentRuns};
  }

  applyAndRunPipeline() {
    const applyAndRun = () => {
      this.startingPipeline = false;
      this.applyConfig();
      this.doStartOrStopPreview();
    };
    this.startingPipeline = true;
    if (this.enablePipelineUpdate) {
      this.updatePipeline(false).then(applyAndRun.bind(this), (err) => {
        this.startingPipeline = false;
        this.myAlertOnValium.show({
          type: "danger",
          content:
            typeof err === "object" ? 
              JSON.stringify(err) : 
              "Updating pipeline failed: " + err,
        });
      });
    } else {
      applyAndRun.call(this);
    }
  }

  saveChangeSummary(changeSummary) {
    this.HydratorPlusPlusConfigStore.setChangeSummary(changeSummary);
  }

  applyBatchConfigFromReactStore(
    engine,
    resources,
    driverResources,
    properties,
    processTimingEnabled,
    stageLoggingEnabled,
    customConfig,
    numOfRecordsPreview,
    runtimeArgs
  ) {
    let forceDynamicExecution = this.HydratorPlusPlusConfigStore.getForceDynamicExecution();
    this.applyRuntimeArgumentsFromReactStore(runtimeArgs);
    this.HydratorPlusPlusConfigStore.setEngine(engine);
    this.HydratorPlusPlusConfigStore.setCustomConfig(customConfig);
    this.HydratorPlusPlusConfigStore.setInstrumentation(processTimingEnabled);
    this.HydratorPlusPlusConfigStore.setStageLogging(stageLoggingEnabled);
    this.HydratorPlusPlusConfigStore.setNumRecordsPreview(numOfRecordsPreview);
    this.HydratorPlusPlusConfigStore.setDriverVirtualCores(
      driverResources.virtualCores
    );
    this.HydratorPlusPlusConfigStore.setDriverMemoryMB(
      driverResources.memoryMB
    );
    this.HydratorPlusPlusConfigStore.setMemoryMB(resources.memoryMB);
    this.HydratorPlusPlusConfigStore.setVirtualCores(resources.virtualCores);
    this.HydratorPlusPlusConfigStore.setForceDynamicExecution(
      forceDynamicExecution
    );
    if (forceDynamicExecution === this.GLOBALS.dynamicExecutionForceOff) {
      this.HydratorPlusPlusConfigStore.setNumExecutors(
        properties[
          window.CaskCommon.PipelineConfigConstants.SPARK_EXECUTOR_INSTANCES
        ]
      );
    }
  }

  applyRealtimeConfigFromReactStore(
    resources,
    driverResources,
    processTimingEnabled,
    stageLoggingEnabled,
    customConfig,
    backpressure,
    numExecutors,
    disableCheckpoints,
    checkpointDir,
    batchInterval,
    clientResources,
    previewTimeoutInMin,
    runtimeArgs
  ) {
    this.applyRuntimeArgumentsFromReactStore(runtimeArgs);
    this.HydratorPlusPlusConfigStore.setBackpressure(backpressure);
    this.HydratorPlusPlusConfigStore.setNumExecutors(numExecutors);
    this.HydratorPlusPlusConfigStore.setCustomConfig(customConfig);
    this.HydratorPlusPlusConfigStore.setInstrumentation(processTimingEnabled);
    this.HydratorPlusPlusConfigStore.setStageLogging(stageLoggingEnabled);
    this.HydratorPlusPlusConfigStore.setCheckpointing(disableCheckpoints);
    this.HydratorPlusPlusConfigStore.setCheckpointDir(checkpointDir);
    this.HydratorPlusPlusConfigStore.setBatchInterval(batchInterval);
    this.HydratorPlusPlusConfigStore.setClientVirtualCores(
      clientResources.virtualCores
    );
    this.HydratorPlusPlusConfigStore.setClientMemoryMB(
      clientResources.memoryMB
    );
    this.HydratorPlusPlusConfigStore.setDriverVirtualCores(
      driverResources.virtualCores
    );
    this.HydratorPlusPlusConfigStore.setDriverMemoryMB(
      driverResources.memoryMB
    );
    this.HydratorPlusPlusConfigStore.setMemoryMB(resources.memoryMB);
    this.HydratorPlusPlusConfigStore.setVirtualCores(resources.virtualCores);
    this.previewStore.dispatch(
      this.previewActions.setTimeoutInMinutes(previewTimeoutInMin)
    );
  }

  getStoreConfig() {
    return this.HydratorPlusPlusConfigStore.state.config;
  }

  getConfigForExport() {
    return this.HydratorPlusPlusConfigStore.getConfigForExport();
  }

  getParentVersion() {
    return this.HydratorPlusPlusConfigStore.getParentVersion();
  }

  validatePluginProperties(action, errorCb) {
    this.HydratorPlusPlusConfigStore.HydratorPlusPlusPluginConfigFactory.validatePluginProperties(
      action,
      null,
      errorCb
    );
  }

  /**
   * This is a copy of resetMetadata
   * with the scope bound to the function -- copied
   * so we don't break original functionality
   */
  resetMetadataV2(event) {
    this.setState();
    this.metadataExpanded = false;
    event.preventDefault();
    event.stopPropagation();
  }

  resetMetadata(event) {
    this.setState();
    this.metadataExpanded = false;
    event.preventDefault();
    event.stopPropagation();
  }
  /**
   * This is a copy of saveMetadata
   * with the scope bound to the function -- copied
   * so we don't break original functionality
   */
  saveMetadataV2(event) {
    this.HydratorPlusPlusConfigActions.setMetadataInfo(
      this.state.metadata.name,
      this.state.metadata.description
    );
    if (this.state.metadata.description) {
      this.parsedDescription = this.state.metadata.description.replace(
        /\n/g,
        " "
      );
      this.tooltipDescription = this.state.metadata.description.replace(
        /\n/g,
        "<br />"
      );
    } else {
      this.parsedDescription = "";
      this.tooltipDescription = "";
    }
    this.metadataExpanded = false;
    event.preventDefault();
    event.stopPropagation();
    this.onSaveDraft();
  }

  saveMetadata(event) {
    this.HydratorPlusPlusConfigActions.setMetadataInfo(
      this.state.metadata.name,
      this.state.metadata.description
    );
    if (this.state.metadata.description) {
      this.parsedDescription = this.state.metadata.description.replace(
        /\n/g,
        " "
      );
      this.tooltipDescription = this.state.metadata.description.replace(
        /\n/g,
        "<br />"
      );
    } else {
      this.parsedDescription = "";
      this.tooltipDescription = "";
    }
    this.metadataExpanded = false;
    event.preventDefault();
    event.stopPropagation();
    this.onSaveDraft();
  }
  onEnterOnMetadata(event) {
    // Save when user hits ENTER key.
    if (event.keyCode === 13) {
      this.saveMetadata(event);
      this.metadataExpanded = false;
    } else if (event.keyCode === 27) {
      // Reset if the user hits ESC key.
      this.resetMetadata(event);
    }
  }

  onImport() {
    let fileBrowserClickCB = () => {
      document.getElementById("pipeline-import-config-link").click();
    };
    // This is not using the promise pattern as browsers NEED to have the click on the call stack to generate the click on input[type=file] button programmatically in like line:115.
    // When done in promise we go into the promise ticks and the then callback is called in the next tick which prevents the browser to open the file dialog
    // as a file dialog is opened ONLY when manually clicked by the user OR transferring the click to another button in the same call stack
    // TL;DR Can't open file dialog programmatically. If we need to, we need to transfer the click from a user on a button directly into the input file dialog button.
    this._checkAndShowConfirmationModalOnDirtyState(fileBrowserClickCB);
  }

  onImportV2() {
    const fileBrowserClickCB = () => {
      document.getElementById("pipeline-import-config-link").click();
    };
    this._checkAndShowConfirmationModalOnDirtyState(fileBrowserClickCB);
  }

  onExport() {
    this.DAGPlusPlusNodesActionsFactory.resetSelectedNode();
    let config = angular.copy(
      this.HydratorPlusPlusConfigStore.getDisplayConfig()
    );
    let exportConfig = this.HydratorPlusPlusConfigStore.getConfigForExport();
    delete exportConfig.__ui__;
    // Only show export modal with pipeline JSON when running e2e tests
    if (window.Cypress) {
      this.myPipelineExportModalService.show(config, exportConfig);
    } else {
      window.CaskCommon.DownloadFile(exportConfig);
    }
  }
  onExportV2() {
    this.DAGPlusPlusNodesActionsFactory.resetSelectedNode();
    const config = angular.copy(
      this.HydratorPlusPlusConfigStore.getDisplayConfig()
    );
    let exportConfig = this.HydratorPlusPlusConfigStore.getConfigForExport();
    delete exportConfig.__ui__;
    if (window.Cypress) {
      this.myPipelineExportModalService.show(config, exportConfig);
    } else {
      window.CaskCommon.DownloadFile(exportConfig);
    }
  }
  onSaveDraft() {
    this.HydratorPlusPlusConfigActions.saveAsDraft();
    this.checkNameError();
    this.$window.localStorage.setItem(
      "LastDraftId",
      this.HydratorPlusPlusConfigStore.getDraftId()
    );
    this.$window.localStorage.setItem("LastPreviewId", this.currentPreviewId);
  }
  onSaveDraftV2() {
    this.HydratorPlusPlusConfigActions.saveAsDraft();
    this.checkNameError();
    this.$window.localStorage.setItem(
      "LastDraftId",
      this.HydratorPlusPlusConfigStore.getDraftId()
    );
    this.$window.localStorage.setItem("LastPreviewId", this.currentPreviewId);
  }
  onClickLogs() {
    this.viewLogs = !this.viewLogs;
  }
  checkNameError() {
    let messages = this.consoleStore.getMessages() || [];
    let filteredMessages = messages.filter((message) => {
      return ["MISSING-NAME", "INVALID-NAME"].indexOf(message.type) !== -1;
    });

    this.invalidName = filteredMessages.length ? true : false;
  }
  onPublish() {
    this.HydratorPlusPlusConfigActions.publishPipeline();
    this.checkNameError();
  }
  onPublishV2(isEdit = false) {
    this.HydratorPlusPlusConfigActions.publishPipeline(isEdit);
    this.checkNameError();
  }
  showSettings() {
    this.state.viewSettings = !this.state.viewSettings;
  }

  // PREVIEW
  setStartTime() {
    let startTime = new Date();
    this.previewStartTime = startTime;
    this.previewStore.dispatch(
      this.previewActions.setPreviewStartTime(startTime)
    );
  }

  startTimer() {
    this.previewTimerInterval = this.$interval(() => {
      this.calculateDuration();
    }, 500);
  }

  stopTimer() {
    this.$interval.cancel(this.previewTimerInterval);
  }

  calculateDuration(endTime) {
    if (!endTime) {
      endTime = new Date();
    }
    let duration = (endTime - this.previewStartTime) / 1000;
    duration = duration >= 0 ? duration : 0;

    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    this.setDisplayDuration(minutes, seconds);
  }

  setDisplayDuration(minutes, seconds) {
    this.displayDuration = {
      minutes: minutes || "--",
      seconds: seconds || "--",
    };
  }

  updateTimerLabelAndTitle(res) {
    // set default
    if (!res) {
      this.timerLabel = this.GLOBALS.en.hydrator.studio.PREVIEW.timerLabels.DURATION;
      this.queueStatus = "";
      return;
    }

    const {
      WAITING,
      ACQUIRED,
      INIT,
      RUNNING,
    } = window.CaskCommon.PREVIEW_STATUS;
    if (res.status === WAITING && res.positionInWaitingQueue > 0) {
      const runsAheadInQueue = res.positionInWaitingQueue;
      this.queueStatus = `${runsAheadInQueue} ${
        runsAheadInQueue === 1 ? "run" : "runs"
      } ahead in queue`;
      this.timerLabel = `${runsAheadInQueue} ${this.GLOBALS.en.hydrator.studio.PREVIEW.timerLabels.PENDING}`;
    } else if (
      [WAITING, ACQUIRED, INIT, RUNNING].includes(res.status) &&
      this.loadingLabel !== "Stopping"
    ) {
      this.timerLabel = this.GLOBALS.en.hydrator.studio.PREVIEW.timerLabels.RUNNING;
      this.queueStatus = "";
    } else {
      this.timerLabel = this.GLOBALS.en.hydrator.studio.PREVIEW.timerLabels.DURATION;
      this.queueStatus = "";
    }
  }

  fetchMacros() {
    let newMacrosMap = {};
    let nodes = this.HydratorPlusPlusConfigStore.getNodes();

    for (let i = 0; i < nodes.length; i++) {
      let properties = this.myHelpers.objectQuery(
        nodes[i],
        "plugin",
        "properties"
      );
      let backendProperties = this.myHelpers.objectQuery(
        nodes[i],
        "_backendProperties"
      );
      for (let prop in properties) {
        if (
          properties.hasOwnProperty(prop) &&
          backendProperties &&
          backendProperties.hasOwnProperty(prop) &&
          backendProperties[prop].macroSupported
        ) {
          let macroString = properties[prop];
          /* Can handle:
            - Simple nested macro (e.g. '${function(${macro1})}')
            - Multiple macros (e.g. '${macro1}${macro2}')
            - And combined (e,g, '${function(${macro1})}${macro2}')
            More complicated cases will be handled by the backend

            TODO: CDAP-17726 - We need API from backend to get macros, given a pipeline config
            The logic UI uses to parse and understand a macro is faulty and does not cover
            complex cases while running preview.

            This is a temporary fix to not surface simple cases of macro functions.
            Hence the specific check for known macro functions that doesn't need user input.
          */
          if (
            macroString &&
            typeof macroString === "string" &&
            macroString.indexOf("${") !== -1 &&
            macroString.indexOf("}") !== -1 &&
            macroString.indexOf("${logicalStartTime(") === -1 &&
            macroString.indexOf("${secure(") === -1 &&
            macroString.indexOf("${conn(") === -1 &&
            macroString.indexOf("${oauth(") === -1
          ) {
            let macroKeys = [];
            let currentMacroDepth = 0;
            let maxMacroDepth = 0;
            let lastClosingBraceIndex = 0;
            for (let i = macroString.length - 1; i >= 1; i--) {
              let macroChar = macroString[i];
              if (macroChar === "}") {
                lastClosingBraceIndex = i;
                currentMacroDepth += 1;
              }
              if (macroChar === "{" && macroString[i - 1] === "$") {
                currentMacroDepth -= 1;
                if (currentMacroDepth >= maxMacroDepth) {
                  maxMacroDepth = currentMacroDepth;
                  let macroKey = macroString.substring(
                    i + 1,
                    lastClosingBraceIndex
                  );
                  macroKeys.push(macroKey);
                }
              }
            }
            macroKeys.forEach((key) => {
              newMacrosMap[key] = "";
            });
          }
        }
      }
    }

    if (Object.keys(newMacrosMap).length > 0) {
      /*
        Will resolve macros from preferences, if the new macro object is different than
        the one we already have (this.macrosMap). We have a new macro object when the
        user adds or removes macro(s) from the config of a stage.
      */

      let differentMacroKeys = false;
      if (
        Object.keys(newMacrosMap).length !== Object.keys(this.macrosMap).length
      ) {
        differentMacroKeys = true;
      } else {
        for (let macroKey in newMacrosMap) {
          if (
            newMacrosMap.hasOwnProperty(macroKey) &&
            !this.macrosMap.hasOwnProperty(macroKey)
          ) {
            differentMacroKeys = true;
            break;
          }
        }
      }

      if (differentMacroKeys) {
        this.getRuntimeArguments(newMacrosMap);
      }
    } else {
      this.getRuntimeArguments(newMacrosMap);
    }
  }

  getRuntimeArguments(newMacrosMap = this.macrosMap) {
    // if there are no runtime arguments at all
    if (
      Object.keys(newMacrosMap).length === 0 &&
      Object.keys(this.userRuntimeArgumentsMap).length === 0
    ) {
      this.macrosMap = newMacrosMap;
      this.previewStore.dispatch(this.previewActions.setMacros(this.macrosMap));
      this.runtimeArguments.pairs = [
        {
          key: "",
          value: "",
          uniqueId: "id-" + this.uuid.v4(),
        },
      ];
      this.doesPreviewHaveEmptyMacros = this.checkForEmptyMacrosForPreview();
      this.previewStore.dispatch(
        this.previewActions.setRuntimeArgsForDisplay(
          _.cloneDeep(this.runtimeArguments)
        )
      );
      return this.$q.when(this.runtimeArguments);
    }

    this.macrosMap = this.previewStore.getState().preview.macros;
    this.userRuntimeArgumentsMap = this.previewStore.getState().preview.userRuntimeArguments;
    let currentRuntimeArgsForDisplay = this.previewStore.getState().preview
      .runtimeArgsForDisplay;

    // if there are non-zero number of macros
    if (Object.keys(newMacrosMap).length !== 0) {
      let preferenceParam = {
        namespace: this.$state.params.namespace,
      };

      return this.myPreferenceApi
        .getNamespacePreferenceResolved(preferenceParam)
        .$promise.then(
          (res) => {
            let newResolvedMacros = this.HydratorPlusPlusHydratorService.getPrefsRelevantToMacros(
              res,
              this.macrosMap
            );
            let newPrefs = {};

            // if the higher level preferences have changed
            if (!angular.equals(newResolvedMacros, this.resolvedMacros)) {
              for (let macroKey in newResolvedMacros) {
                if (
                  newResolvedMacros.hasOwnProperty(macroKey) &&
                  this.resolvedMacros.hasOwnProperty(macroKey) &&
                  this.macrosMap.hasOwnProperty(macroKey)
                ) {
                  if (
                    newResolvedMacros[macroKey] !==
                      this.resolvedMacros[macroKey] &&
                    this.resolvedMacros[macroKey] === this.macrosMap[macroKey]
                  ) {
                    newPrefs[macroKey] = newResolvedMacros[macroKey];
                  }
                }
              }
              this.resolvedMacros = newResolvedMacros;
            }

            if (
              !angular.equals(newMacrosMap, this.macrosMap) ||
              Object.keys(newPrefs).length > 0
            ) {
              // if user added or removed macros in the stage config
              if (!angular.equals(newMacrosMap, this.macrosMap)) {
                this.resolvedMacros = Object.assign(
                  {},
                  this.HydratorPlusPlusHydratorService.getPrefsRelevantToMacros(
                    res,
                    newMacrosMap
                  )
                );
                this.macrosMap = Object.assign(
                  {},
                  newMacrosMap,
                  this.resolvedMacros
                );
              }
              // only update the macros that have new resolved values
              if (Object.keys(newPrefs).length > 0) {
                this.resolvedMacros = Object.assign(
                  {},
                  this.resolvedMacros,
                  newResolvedMacros
                );
                this.macrosMap = Object.assign({}, this.macrosMap, newPrefs);
              }
              this.previewStore.dispatch(
                this.previewActions.setMacros(this.macrosMap)
              );
            }
            this.runtimeArguments = this.HydratorPlusPlusHydratorService.getRuntimeArgsForDisplay(
              currentRuntimeArgsForDisplay,
              this.macrosMap,
              this.userRuntimeArgumentsMap
            );
            this.previewStore.dispatch(
              this.previewActions.setRuntimeArgsForDisplay(
                _.cloneDeep(this.runtimeArguments)
              )
            );
            this.doesPreviewHaveEmptyMacros = this.checkForEmptyMacrosForPreview();
            return this.runtimeArguments;
          },
          (err) => {
            console.log("ERROR", err);
          }
        );

      // if there are zero macros, but there are user-set runtime arguments
    } else {
      this.macrosMap = newMacrosMap;
      this.previewStore.dispatch(this.previewActions.setMacros(this.macrosMap));
      this.runtimeArguments = this.HydratorPlusPlusHydratorService.getRuntimeArgsForDisplay(
        currentRuntimeArgsForDisplay,
        this.macrosMap,
        this.userRuntimeArgumentsMap
      );
      this.previewStore.dispatch(
        this.previewActions.setRuntimeArgsForDisplay(
          _.cloneDeep(this.runtimeArguments)
        )
      );
      this.doesPreviewHaveEmptyMacros = this.checkForEmptyMacrosForPreview();
      return this.$q.when(this.runtimeArguments);
    }
  }

  getRuntimeArgumentsV2(newMacrosMap = this.macrosMap) {
    // if there are no runtime arguments at all
    if (
      Object.keys(newMacrosMap).length === 0 &&
      Object.keys(this.userRuntimeArgumentsMap).length === 0
    ) {
      this.macrosMap = newMacrosMap;
      this.previewStore.dispatch(this.previewActions.setMacros(this.macrosMap));
      this.runtimeArguments.pairs = [
        {
          key: "",
          value: "",
          uniqueId: "id-" + this.uuid.v4(),
        },
      ];
      this.doesPreviewHaveEmptyMacros = this.checkForEmptyMacrosForPreview();
      this.previewStore.dispatch(
        this.previewActions.setRuntimeArgsForDisplay(
          _.cloneDeep(this.runtimeArguments)
        )
      );
      return this.$q.when(this.runtimeArguments);
    }

    this.macrosMap = this.previewStore.getState().preview.macros;
    this.userRuntimeArgumentsMap = this.previewStore.getState().preview.userRuntimeArguments;
    let currentRuntimeArgsForDisplay = this.previewStore.getState().preview
      .runtimeArgsForDisplay;

    // if there are non-zero number of macros
    if (Object.keys(newMacrosMap).length !== 0) {
      let preferenceParam = {
        namespace: this.$state.params.namespace,
      };

      return this.myPreferenceApi
        .getNamespacePreferenceResolved(preferenceParam)
        .$promise.then(
          (res) => {
            let newResolvedMacros = this.HydratorPlusPlusHydratorService.getPrefsRelevantToMacros(
              res,
              this.macrosMap
            );
            let newPrefs = {};

            // if the higher level preferences have changed
            if (!angular.equals(newResolvedMacros, this.resolvedMacros)) {
              for (let macroKey in newResolvedMacros) {
                if (
                  newResolvedMacros.hasOwnProperty(macroKey) &&
                  this.resolvedMacros.hasOwnProperty(macroKey) &&
                  this.macrosMap.hasOwnProperty(macroKey)
                ) {
                  if (
                    newResolvedMacros[macroKey] !==
                      this.resolvedMacros[macroKey] &&
                    this.resolvedMacros[macroKey] === this.macrosMap[macroKey]
                  ) {
                    newPrefs[macroKey] = newResolvedMacros[macroKey];
                  }
                }
              }
              this.resolvedMacros = newResolvedMacros;
            }

            if (
              !angular.equals(newMacrosMap, this.macrosMap) ||
              Object.keys(newPrefs).length > 0
            ) {
              // if user added or removed macros in the stage config
              if (!angular.equals(newMacrosMap, this.macrosMap)) {
                this.resolvedMacros = Object.assign(
                  {},
                  this.HydratorPlusPlusHydratorService.getPrefsRelevantToMacros(
                    res,
                    newMacrosMap
                  )
                );
                this.macrosMap = Object.assign(
                  {},
                  newMacrosMap,
                  this.resolvedMacros
                );
              }
              // only update the macros that have new resolved values
              if (Object.keys(newPrefs).length > 0) {
                this.resolvedMacros = Object.assign(
                  {},
                  this.resolvedMacros,
                  newResolvedMacros
                );
                this.macrosMap = Object.assign({}, this.macrosMap, newPrefs);
              }
              this.previewStore.dispatch(
                this.previewActions.setMacros(this.macrosMap)
              );
            }
            this.runtimeArguments = this.HydratorPlusPlusHydratorService.getRuntimeArgsForDisplay(
              currentRuntimeArgsForDisplay,
              this.macrosMap,
              this.userRuntimeArgumentsMap
            );
            this.previewStore.dispatch(
              this.previewActions.setRuntimeArgsForDisplay(
                _.cloneDeep(this.runtimeArguments)
              )
            );
            this.doesPreviewHaveEmptyMacros = this.checkForEmptyMacrosForPreview();
            return this.runtimeArguments;
          },
          (err) => {
            console.log("ERROR", err);
          }
        );

      // if there are zero macros, but there are user-set runtime arguments
    } else {
      this.macrosMap = newMacrosMap;
      this.previewStore.dispatch(this.previewActions.setMacros(this.macrosMap));
      this.runtimeArguments = this.HydratorPlusPlusHydratorService.getRuntimeArgsForDisplay(
        currentRuntimeArgsForDisplay,
        this.macrosMap,
        this.userRuntimeArgumentsMap
      );
      this.previewStore.dispatch(
        this.previewActions.setRuntimeArgsForDisplay(
          _.cloneDeep(this.runtimeArguments)
        )
      );
      this.doesPreviewHaveEmptyMacros = this.checkForEmptyMacrosForPreview();
      return this.$q.when(this.runtimeArguments);
    }
  }

  toggleConfig() {
    this.getRuntimeArguments().then(() => {
      this.viewConfig = !this.viewConfig;
    });
  }

  toggleConfigV2() {
    this.getRuntimeArguments().then(() => {
      this.viewConfig = !this.viewConfig;
    });
  }

  startOrStopPreview() {
    if (this.doesPreviewHaveEmptyMacros) {
      this.doStartOrStopPreview();
    } else {
      // Validate and show runtime arguments if there are
      // un-fulfilled macros.
      this.toggleConfig();
    }
  }

  startOrStopPreviewV2() {
    if (this.doesPreviewHaveEmptyMacros) {
      this.doStartOrStopPreview();
    } else {
      this.toggleConfig();
    }
  }

  doStartOrStopPreview() {
    this.getRuntimeArguments().then(() => {
      if (this.previewRunning) {
        this.stopPreview();
      } else {
        this.onPreviewStart();
      }
    });
  }

  toggleScheduler(e) {
    this.viewScheduler = !this.viewScheduler;
    e.stopPropagation();
  }

  toggleSchedulerV2(e) {
    this.viewScheduler = !this.viewScheduler;
    e.stopPropagation();
  }

  setRuntimeArguments(runtimeArguments) {
    this.runtimeArguments = runtimeArguments;
  }

  closeScheduler(){
    this.viewScheduler = false;
  }

  applyRuntimeArguments() {
    let macros = this.HydratorPlusPlusHydratorService.convertRuntimeArgsToMacros(
      this.runtimeArguments
    );
    this.macrosMap = macros.macrosMap;
    this.userRuntimeArgumentsMap = macros.userRuntimeArgumentsMap;
    // have to do this because cannot do two `this.previewStore.dispatch` in a row
    this.previewStore.dispatch(
      this.previewActions.setMacrosAndUserRuntimeArgs(
        this.macrosMap,
        this.userRuntimeArgumentsMap
      )
    );
    this.previewStore.dispatch(
      this.previewActions.setRuntimeArgsForDisplay(
        _.cloneDeep(this.runtimeArguments)
      )
    );
    this.doesPreviewHaveEmptyMacros = this.checkForEmptyMacrosForPreview();
  }

  applyRuntimeArgumentsFromReactStore(runtimeArguments) {
    this.setRuntimeArguments(runtimeArguments);
    let macros = this.HydratorPlusPlusHydratorService.convertRuntimeArgsToMacros(
      this.runtimeArguments
    );
    this.macrosMap = macros.macrosMap;
    this.userRuntimeArgumentsMap = macros.userRuntimeArgumentsMap;
    // have to do this because cannot do two `this.previewStore.dispatch` in a row
    this.previewStore.dispatch(
      this.previewActions.setMacrosAndUserRuntimeArgs(
        this.macrosMap,
        this.userRuntimeArgumentsMap
      )
    );
    this.previewStore.dispatch(
      this.previewActions.setRuntimeArgsForDisplay(
        _.cloneDeep(this.runtimeArguments)
      )
    );
    this.doesPreviewHaveEmptyMacros = this.checkForEmptyMacrosForPreview();
  }

  checkForEmptyMacrosForPreview() {
    return !this.HydratorPlusPlusHydratorService.keyValuePairsHaveMissingValues(
      this.runtimeArguments
    );
  }

  onPreviewStart() {
    this._checkAndShowConfirmationModalOnActionPlugin(
      this.runPreview.bind(this)
    );
  }

  runPreview() {
    this.previewLoading = true;
    this.loadingLabel = "Starting";
    this.viewConfig = false;

    this.setDisplayDuration();
    this.updateTimerLabelAndTitle();

    this.currentPreviewId = null;
    this.previewStore.dispatch(
      this.previewActions.setPreviewId(this.currentPreviewId)
    );
    this.$window.localStorage.removeItem(
      "LastPreviewId",
      this.currentPreviewId
    );

    let params = {
      namespace: this.$state.params.namespace,
      scope: this.$scope,
    };

    // GENERATING PREVIEW CONFIG
    // This might/should be extracted out to a factory

    let pipelineConfig = this.HydratorPlusPlusConfigStore.getConfigForExport();
    /**
     *  This is a cheat way for generating preview for the entire pipeline
     **/

    let macrosWithNonEmptyValues = this.HydratorPlusPlusHydratorService.getMacrosWithNonEmptyValues(
      this.macrosMap
    );
    let previewConfig = {
      startStages: [],
      endStages: [],
      runtimeArgs: Object.assign(
        {},
        macrosWithNonEmptyValues,
        this.userRuntimeArgumentsMap
      ),
    };

    if (this.state.artifact.name === this.GLOBALS.etlDataPipeline) {
      pipelineConfig.preview = Object.assign({}, previewConfig, {
        realDatasets: [],
        programName: "DataPipelineWorkflow",
        programType: "Workflow",
      });
    } else if (this.state.artifact.name === this.GLOBALS.etlDataStreams) {
      pipelineConfig.preview = Object.assign({}, previewConfig, {
        realDatasets: [],
        programName: "DataStreamsSparkStreaming",
        programType: "Spark",
        timeout: this.timeoutInMinutes,
      });
    }
    // Get start stages and end stages
    // Current implementation:
    //    - start stages mean sources
    //    - end stages mean sinks
    angular.forEach(pipelineConfig.config.stages, (node) => {
      if (this.GLOBALS.pluginConvert[node.plugin.type] === "source") {
        previewConfig.startStages.push(node.name);
      } else if (this.GLOBALS.pluginConvert[node.plugin.type] === "sink") {
        previewConfig.endStages.push(node.name);
      }
    });
    pipelineConfig.config.preview = previewConfig;

    if (
      previewConfig.startStages.length === 0 ||
      previewConfig.endStages.length === 0
    ) {
      this.myAlertOnValium.show({
        type: "danger",
        content: this.GLOBALS.en.hydrator.studio.error.PREVIEW[
          "NO-SOURCE-SINK"
        ],
      });
      this.previewLoading = false;
      return;
    }

    this.myPipelineApi.runPreview(params, pipelineConfig).$promise.then(
      (res) => {
        this.previewStore.dispatch(
          this.previewActions.setPreviewId(res.application)
        );
        this.setStartTime();
        this.startTimer();
        this.currentPreviewId = res.application;
        this.$window.localStorage.setItem(
          "LastDraftId",
          this.HydratorPlusPlusConfigStore.getDraftId()
        );
        this.$window.localStorage.setItem(
          "LastPreviewId",
          this.currentPreviewId
        );
        this.startPollPreviewStatus(res.application);
      },
      (err) => {
        this.previewLoading = false;
        let errMsg = this.myHelpers.extractErrorMessage(err);
        this.myAlertOnValium.show({
          type: "danger",
          content: errMsg,
        });
      }
    );
  }

  resetButtonsAndStopPoll() {
    // stop timer, run/stop button, pollId, and stop polling when pipeline is stopped or complete
    this.stopTimer();
    this.previewLoading = false;
    this.previewRunning = false;
    this.pollingService.stopPoll(this.pollId);
    this.pollId = null;
  }

  stopPreview(silentMode = false) {
    if (
      !this.currentPreviewId ||
      !this.previewRunning ||
      this.loadingLabel === "Stopping"
    ) {
      return;
    }
    let params = {
      namespace: this.$state.params.namespace,
      scope: this.$scope,
      previewId: this.currentPreviewId,
    };
    this.previewLoading = true;
    this.loadingLabel = "Stopping";
    const pipelineName = this.HydratorPlusPlusConfigStore.getName();
    const pipelinePreviewPlaceholder = `The preview of the pipeline${
      pipelineName.length > 0 ? ` "${pipelineName}"` : ""
    }`;
    this.myPipelineApi.stopPreview(params, {}).$promise.then(
      () => {
        this.resetButtonsAndStopPoll();
        this.updateTimerLabelAndTitle();

        if (silentMode) {
          return;
        }
        this.myAlertOnValium.show({
          type: "success",
          content: `${pipelinePreviewPlaceholder} was stopped.`,
        });
      },
      (err) => {
        // If error is due to run already having completed, reset UI as if stop succeeded
        if (err.statusCode === 400) {
          this.resetButtonsAndStopPoll();
          this.updateTimerLabelAndTitle();
          if (silentMode) {
            return;
          }
          this.myAlertOnValium.show({
            type: "success",
            content: `${pipelinePreviewPlaceholder} was stopped.`,
          });
          return;
        }
        // If backend returns error while stopping, still show preview run button to retry stopping
        this.previewLoading = false;
        this.previewRunning = true;
        if (silentMode) {
          return;
        }
        this.myAlertOnValium.show({ type: "danger", content: err.data });
      }
    );
  }

  startPollPreviewStatus(previewId) {
    this.previewLoading = false;
    this.previewRunning = true;

    this.pollingService.poll(() => {
      return this.myPipelineApi.getPreviewStatus({
        namespace: this.$state.params.namespace,
        previewId,
      });
    }, 1000,
      (res, pollId) => {
        this.pollId = pollId;
        if (this.previewStore) {
          this.previewStore.dispatch({
            type: this.PREVIEWSTORE_ACTIONS.SET_PREVIEW_STATUS,
            payload: {
              status: res.status,
            },
          });
        }
        const {
          WAITING,
          ACQUIRED,
          INIT,
          RUNNING,
          COMPLETED,
          DEPLOY_FAILED,
          RUN_FAILED,
          KILLED_BY_TIMER,
          KILLED_BY_EXCEEDING_MEMORY_LIMIT,
        } = window.CaskCommon.PREVIEW_STATUS;
        this.updateTimerLabelAndTitle(res);
        if ([RUNNING, INIT, ACQUIRED, WAITING].indexOf(res.status) === -1) {
          this.resetButtonsAndStopPoll();
          let pipelineName = this.HydratorPlusPlusConfigStore.getName();
          const pipelinePreviewPlaceholder = `The preview of the pipeline${
            pipelineName.length > 0 ? ` "${pipelineName}"` : ""
          }`;
          if (res.status === COMPLETED || res.status === KILLED_BY_TIMER) {
            this.pollingService.stopPoll(this.pollId);
            this.pollId = null;
            this.myAlertOnValium.show({
              type: "success",
              content: `${pipelinePreviewPlaceholder} has completed successfully.`,
            });
          } else {
            let failureMsg =
              this.myHelpers.objectQuery(res, "throwable", "message") ||
              `${pipelinePreviewPlaceholder} has failed. Please check the logs for more information.`;
            if (
              res.status === DEPLOY_FAILED ||
              res.status === KILLED_BY_EXCEEDING_MEMORY_LIMIT
            ) {
              failureMsg =
                this.myHelpers.objectQuery(res, "throwable", "message") ||
                "Unable to run preview. Please try again in sometime.";
            }
            if (res.status === RUN_FAILED) {
              failureMsg = `${pipelinePreviewPlaceholder} has failed. Please check the logs for more information.`;
            }
            this.myAlertOnValium.show({
              type: "danger",
              content: failureMsg,
            });
          }
        }
      },
      (err) => {
        this.stopTimer();
        this.updateTimerLabelAndTitle();
        let errorMsg = this.myHelpers.extractErrorMessage(err);
        this.myAlertOnValium.show({
          type: "danger",
          content: "Pipeline preview failed : " + errorMsg,
        });
        this.previewRunning = false;
        this.pollingService.stopPoll(this.pollId);
        this.pollId = null;
      }
    );
  }

  closeLogs() {
    this.viewLogs = false;
  }

  togglePreviewMode() {
    if (this.previewRunning && this.previewMode) {
      this.stopPreview(true);
    }
    this.previewStore.dispatch(
      this.previewActions.togglePreviewMode(!this.previewMode)
    );
  }

  togglePreviewModeV2() {
    if (this.previewRunning && this.previewMode) {
      this.stopPreview(true);
    }
    this.previewStore.dispatch(
      this.previewActions.togglePreviewMode(!this.previewMode)
    );
  }

  importFile(files) {
    if (!files.length) {
      return;
    }

    let uploadedFile = files[0];
    this.HydratorUpgradeService.validateAndUpgradeConfigFile(uploadedFile);
  }

  importFile2(files) {
    if (!files.length) {
      return;
    }

    let uploadedFile = files[0];
    this.HydratorUpgradeService.validateAndUpgradeConfigFile(uploadedFile);
  }

  _checkAndShowConfirmationModalOnDirtyState(proceedCb) {
    let goTonextStep = true;
    let isStoreDirty = this.HydratorPlusPlusConfigStore.getIsStateDirty();
    if (isStoreDirty) {
      return this.$uibModal
        .open({
          templateUrl:
            "/assets/features/hydrator/templates/create/popovers/canvas-overwrite-confirmation.html",
          size: "lg",
          backdrop: "static",
          keyboard: false,
          windowTopClass: "confirm-modal hydrator-modal center",
          controller: [
            "$scope",
            "HydratorPlusPlusConfigStore",
            "HydratorPlusPlusConfigActions",
            function(
              $scope,
              HydratorPlusPlusConfigStore,
              HydratorPlusPlusConfigActions
            ) {
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
                var unsub = HydratorPlusPlusConfigStore.registerOnChangeListener(
                  () => {
                    let isStateDirty = HydratorPlusPlusConfigStore.getIsStateDirty();
                    // This is solely used for showing the spinner icon until the modal is closed.
                    if (!isStateDirty) {
                      unsub();
                      goTonextStep = true;
                      $scope.$close();
                    }
                  }
                );
                HydratorPlusPlusConfigActions.saveAsDraft();
                $scope.isSaving = true;
              };
              $scope.cancel = () => {
                $scope.$close();
                goTonextStep = false;
              };
            },
          ],
        })
        .closed.then(() => {
          return goTonextStep;
        });
    } else {
      if (proceedCb) {
        proceedCb();
      }
      return this.$q.when(goTonextStep);
    }
  }

  _checkAndShowConfirmationModalOnActionPlugin(proceedCb) {
    const isPipelineValid = this.HydratorPlusPlusConfigStore.validateState({
      showConsoleMessage: true,
      validateBeforePreview: true,
    });
    if (!isPipelineValid) {
      return;
    }

    let config = this.HydratorPlusPlusConfigStore.getConfigForExport().config;

    let actions = config.stages.filter((stage) => {
      return stage.plugin.type === "action";
    });

    let postActions = config.postActions;

    if (actions.length > 0 || postActions.length > 0) {
      this.viewConfig = false;
      let confirmModal = this.$uibModal.open({
        templateUrl:
          "/assets/features/hydrator/templates/create/popovers/run-preview-action-confirmation-modal.html",
        size: "lg",
        backdrop: "static",
        keyboard: false,
        windowTopClass: "confirm-modal hydrator-modal center",
      });

      confirmModal.result.then((confirm) => {
        if (confirm && proceedCb) {
          proceedCb();
        }
      });
    } else {
      if (proceedCb) {
        proceedCb();
      }
    }
  }
}

angular.module(PKG.name + ".feature.hydrator")
  .controller("HydratorPlusPlusTopPanelCtrl", HydratorPlusPlusTopPanelCtrl);
