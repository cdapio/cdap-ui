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

import PipelineScheduler from 'components/PipelineScheduler';
import PreviewLogs from 'components/PreviewLogs';
import ResourceCenterButton from 'components/ResourceCenterButton';
import React from 'react';
import { ActionButtons } from './ActionButtons';
import { NameAndDescription } from './NameAndDescription';

export interface IGlobalObj {
  etlRealtime?: string;
  etlDataStreams?: string;
  etlBatchPipelines?: string[];
}

interface IMetadata {
  description: string;
  name: string;
}

interface IArtifact {
  name: string;
  scope: string;
  version: string;
}

export interface INameState {
  metadata?: IMetadata;
  artifact?: IArtifact;
  viewSettings?: boolean;
}

export interface IDuration {
  minutes: string;
  seconds: string;
}

interface ITopPanelProps {
  metadataExpanded?: boolean;
  globals?: IGlobalObj;
  state?: INameState;
  invalidName?: string;
  parsedDescription?: string;
  saveMetadata?: (event: MouseEvent | KeyboardEvent) => void;
  resetMetadata?: (event: MouseEvent | KeyboardEvent) => void;
  openMetadata?: () => void;
  previewMode: boolean;
  previewEnabled: boolean;
  togglePreviewMode: () => void;
  toggleConfig: () => void;
  closeScheduler: () => void;
  viewConfig: boolean;
  showSchedule: boolean;
  viewScheduler: boolean;
  toggleScheduler: () => void;
  hasNodes: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onImport: () => void;
  onFileSelect: (files: FileList) => void;
  onExport: () => void;
  onClickLogs: () => void;
  previewLoading: boolean;
  previewRunning: boolean;
  startOrStopPreview: () => void;
  queueStatus: string;
  displayDuration: IDuration;
  loadingLabel: string;
  currentPreviewId: string;
  viewLogs: boolean;
  onCloseLog: () => void;
  timerLabel: string;
  namespace: string;
  store: any;
  actionCreator: any;
}

export const TopPanel = ({
  metadataExpanded,
  globals,
  state,
  invalidName,
  parsedDescription,
  saveMetadata,
  resetMetadata,
  openMetadata,
  previewMode,
  previewEnabled,
  togglePreviewMode,
  toggleConfig,
  viewConfig,
  showSchedule,
  viewScheduler,
  toggleScheduler,
  closeScheduler,
  hasNodes,
  onSaveDraft,
  onPublish,
  onImport,
  onFileSelect,
  onExport,
  onClickLogs,
  previewLoading,
  previewRunning,
  startOrStopPreview,
  queueStatus,
  displayDuration,
  loadingLabel,
  currentPreviewId,
  viewLogs,
  onCloseLog,
  timerLabel,
  namespace,
  store,
  actionCreator,
}: ITopPanelProps) => {
  const schedule = store.getSchedule();
  const maxConcurrentRuns = store.getMaxConcurrentRuns();
  return (
    <>
      <div className="side-panel top text-center">
        <NameAndDescription
          globals={globals}
          metadataExpanded={metadataExpanded}
          state={state}
          invalidName={invalidName}
          parsedDescription={parsedDescription}
          saveMetadata={saveMetadata}
          resetMetadata={resetMetadata}
          openMetadata={openMetadata}
        ></NameAndDescription>
        <ActionButtons
          previewMode={previewMode}
          previewEnabled={previewEnabled}
          togglePreviewMode={togglePreviewMode}
          toggleConfig={toggleConfig}
          viewConfig={viewConfig}
          showSchedule={showSchedule}
          viewScheduler={viewScheduler}
          toggleScheduler={toggleScheduler}
          hasNodes={hasNodes}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          onImport={onImport}
          onFileSelect={onFileSelect}
          onExport={onExport}
          onClickLogs={onClickLogs}
          previewLoading={previewLoading}
          previewRunning={previewRunning}
          startOrStopPreview={startOrStopPreview}
          queueStatus={queueStatus}
          displayDuration={displayDuration}
          loadingLabel={loadingLabel}
          currentPreviewId={currentPreviewId}
          viewLogs={viewLogs}
          timerLabel={timerLabel}
        ></ActionButtons>
        <ResourceCenterButton></ResourceCenterButton>
      </div>
      {viewScheduler && (
        <div className="pipeline-scheduler">
          <PipelineScheduler
            schedule={schedule}
            maxConcurrentRuns={maxConcurrentRuns}
            actionCreator={actionCreator}
            pipelineName={state.metadata.name}
            onClose={closeScheduler}
            open={true}
            suppressAnimation={true}
            anchorEl="pipeline-schedule-modeless-btn"
          ></PipelineScheduler>
        </div>
      )}
      {viewLogs && (
        <div className="pipeline-settings pipeline-logs-section">
          <PreviewLogs
            namespace={namespace}
            previewId={currentPreviewId}
            stopPoll={!previewRunning}
            onClose={onCloseLog}
          ></PreviewLogs>
        </div>
      )}
    </>
  );
};
