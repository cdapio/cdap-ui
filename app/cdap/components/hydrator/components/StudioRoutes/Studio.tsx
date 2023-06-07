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

import React from 'react';
import { LeftPanel } from 'components/hydrator/components/LeftPanel/LeftPanel';
import { TopPanel } from 'components/hydrator/components/TopPanel/TopPanel';

export interface IStudioCreateState {
  topPanelCtrl: any;
  leftPanelCtrl: any;
}

export const Studio = ({leftPanelCtrl, topPanelCtrl}: IStudioCreateState) => {
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
              namespace={topPanelCtrl.$state.params.namespace}
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
            {/* <div
              className="canvas"
              dangerouslySetInnerHTML={{
                __html: `
                  <my-dag-plus ng-class="{'canvas-scroll': CanvasCtrl.state.setScroll}"
                    nodes="CanvasCtrl.nodes"
                    connections="CanvasCtrl.connections"
                    context="CanvasCtrl"
                    node-delete="CanvasCtrl.deleteNode",
                    separation="200"
                    preview-mode="CanvasCtrl.previewMode"
                  ></my-dag-plus>
                `,
              }}
            /> */}

          </div>
        </div>
      </div>
    </div>
  );
};
