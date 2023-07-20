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

import React, {useEffect, useState} from 'react';
import { LeftPanel } from 'components/hydrator/components/LeftPanel/LeftPanel';
import { TopPanel } from 'components/hydrator/components/TopPanel/TopPanel';
import { WrapperCanvas } from 'components/hydrator/components/Canvas';
import PipelineDetailsRunLevelInfo from 'components/PipelineDetails/RunLevelInfo';

export interface IStudioCreateState {
  topPanelCtrl: any;
  leftPanelCtrl: any;
  canvasCtrl: any;
  studioCtrl: any;
  dagCtrl: any;
  counter: number;
  metadataExpanded: any;
}

export const Studio = ({leftPanelCtrl, topPanelCtrl, canvasCtrl, dagCtrl, metadataExpanded}: IStudioCreateState) => {
  return (
    <div>
      <div className="react-version">
        <div className="canvas-wrapper">
          <div className="left-control">
            <LeftPanel
              onArtifactChange={leftPanelCtrl.onArtifactChangeV2}
              pluginsMap={leftPanelCtrl.pluginsMap}
              selectedArtifact={leftPanelCtrl.selectedArtifact}
              artifacts={leftPanelCtrl.artifacts}
              groups={leftPanelCtrl.pluginsMap}
              itemGenericName="plugins"
              groupGenericName="artifacts"
              onPanelItemClick={leftPanelCtrl.onV2ItemClicked}
              isEdit={leftPanelCtrl.isEdit}
              createPluginTemplate={leftPanelCtrl.createPluginTemplateV2}
            />
          </div>
          <div className="top-panel">
            <TopPanel
              globals={topPanelCtrl.GLOBALS}
              metadataExpanded={topPanelCtrl.metadataExpanded}
              state={topPanelCtrl.state}
              invalidName={topPanelCtrl.invalidName}
              parsedDescription={topPanelCtrl.parsedDescription}
              saveMetadata={topPanelCtrl.saveMetadataV2}
              resetMetadata={topPanelCtrl.resetMetadataV2}
              openMetadata={topPanelCtrl.openMetadataV2}
              previewMode={topPanelCtrl.previewMode}
              previewEnabled={topPanelCtrl.isPreviewEnabled}
              togglePreviewMode={topPanelCtrl.togglePreviewModeV2}
              toggleConfig={topPanelCtrl.toggleConfigV2}
              viewConfig={topPanelCtrl.viewConfig}
              showSchedule={topPanelCtrl.showSchedule}
              viewScheduler={topPanelCtrl.viewScheduler}
              toggleScheduler={topPanelCtrl.toggleSchedulerV2}
              closeScheduler={topPanelCtrl.closeScheduler}
              hasNodes={topPanelCtrl.hasNodes}
              onSaveDraft={topPanelCtrl.onSaveDraftV2}
              onPublish={topPanelCtrl.onPublishV2}
              onImport={topPanelCtrl.onImportV2}
              onFileSelect={topPanelCtrl.importFile2}
              onExport={topPanelCtrl.onExportV2}
              onClickLogs={topPanelCtrl.onClickLogs}
              previewLoading={topPanelCtrl.previewLoading}
              previewRunning={topPanelCtrl.previewRunning}
              startOrStopPreview={topPanelCtrl.startOrStopPreviewV2}
              queueStatus={topPanelCtrl.queueStatus}
              displayDuration={topPanelCtrl.displayDuration}
              loadingLabel={topPanelCtrl.loadingLabel}
              currentPreviewId={topPanelCtrl.currentPreviewId}
              viewLogs={topPanelCtrl.viewLogs}
              onCloseLog={topPanelCtrl.closeLogs}
              timerLabel={topPanelCtrl.timerLabel}
              namespace={topPanelCtrl.$rootScope.$stateParams.namespace}
              getScheduleInfo={topPanelCtrl.getScheduleInfo}
              actionCreator={topPanelCtrl.HydratorPlusPlusConfigActions}
              applyRuntimeArguments={topPanelCtrl.applyRuntimeArgumentsFromReactStore}
              applyBatchConfig={topPanelCtrl.applyBatchConfigFromReactStore}
              applyRealtimeConfig={topPanelCtrl.applyRealtimeConfigFromReactStore}
              getPostActions={topPanelCtrl.getPostActions}
              validatePluginProperties={topPanelCtrl.validatePluginProperties}
              getRuntimeArgs={topPanelCtrl.getRuntimeArgumentsV2}
              getStoreConfig={topPanelCtrl.getStoreConfig}
              getConfigForExport={topPanelCtrl.getConfigForExport}
              isEdit={topPanelCtrl.isEdit}
              saveChangeSummary={topPanelCtrl.saveChangeSummary}
              getParentVersion={topPanelCtrl.getParentVersion}
            />
          </div>
          <div className="right-wrapper">
          {/* <my-dag-plus
  data-is-disabled="true"
  ng-class="{'canvas-scroll': CanvasCtrl.setScroll}"
  context="CanvasCtrl"
  show-metrics="true"
  metrics-data="CanvasCtrl.metrics"
  metrics-popover-template="/assets/features/hydrator/templates/partial/metrics-popover.html"
  disable-metrics-click="CanvasCtrl.totalRuns > 0 ? false : true"
  run-id="CanvasCtrl.runId"
> */}
            
            {/* <PipelineDetailsRunLevelInfo></PipelineDetailsRunLevelInfo> */}
            <WrapperCanvas
              angularNodes={dagCtrl.getNodes()}
              angularConnections={dagCtrl.getConnections()}
              isDisabled={dagCtrl.isDisabled}
              previewMode={canvasCtrl.preview}
              updateNodes={dagCtrl.updateNodesStoreNodes}
              updateConnections={dagCtrl.updateNodesStoreConnections}
              onPropertiesClick={dagCtrl.onNodeClick}
              onMetricsClick={dagCtrl.onMetricsClick}
              getAngularConnections={dagCtrl.getConnections}
              getAngularNodes={dagCtrl.getNodes}
              setSelectedNodes={dagCtrl.setSelectedNodes}
              setSelectedConnections={dagCtrl.setSelectedConnections}
              onKeyboardCopy={dagCtrl.onKeyboardCopy}
              setPluginActiveForComment={dagCtrl.setPluginActiveForComment}
              getActivePluginForComment={dagCtrl.getActivePluginForComment}
              setPluginComments={dagCtrl.setComments}
              getPluginConfiguration={dagCtrl.getPluginConfiguration}
              getCustomIconSrc={dagCtrl.getCustomIconSrc}
              shouldShowAlertsPort={dagCtrl.shouldShowAlertsPort}
              shouldShowErrorsPort={dagCtrl.shouldShowErrorsPort}
              undoActions={dagCtrl.undoActions}
              redoActions={dagCtrl.redoActions}
              pipelineComments={dagCtrl.pipelineComments}
              setPipelineComments={dagCtrl.setPipelineComments}
              onPreviewData={dagCtrl.onPreviewData}
              cleanUpGraph={dagCtrl.cleanUpGraph}
              pipelineArtifactType={dagCtrl.pipelineArtifactType}
              metricsData={{}}
              metricsDisabled={true}
              redoStates={dagCtrl.redoStates}
              undoStates={dagCtrl.undoStates}
              updateNodePositions={dagCtrl.updateNodePositions}
            ></WrapperCanvas>

          </div>
        </div>
      </div>
    </div>
  );
};
