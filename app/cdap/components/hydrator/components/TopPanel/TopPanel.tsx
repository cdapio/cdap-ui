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

import { Button, TextareaAutosize } from '@material-ui/core';
import { MyPipelineApi } from 'api/pipeline';
import PipelineScheduler from 'components/PipelineScheduler';
import PreviewLogs from 'components/PreviewLogs';
import ResourceCenterButton from 'components/ResourceCenterButton';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import React, { useEffect, useReducer, useState } from 'react';
import { getCurrentNamespace } from 'services/NamespaceStore';
import styled from 'styled-components';
import { ActionButtons } from './ActionButtons';
import { NameAndDescription } from './NameAndDescription';
import ErrorBanner from 'components/shared/ErrorBanner';
import T from 'i18n-react';
import { editPipeline } from 'services/PipelineUtils';
import downloadFile from 'services/download-file';
import { cleanseAndCompareTwoObjects } from 'services/helpers';

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

export interface IScheduleInfo {
  schedule: string;
  maxConcurrentRuns: number;
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

const TopPanelContainer = styled.div`
  background-color: white;
  border-bottom: 1px solid #dddddd;
  border-left: 0;
  border-top: 0;
  display: flex;
  text-align: center !important;
  transition: all 0.2s ease;
`;

const PipelinePreviewLogs = styled.div`
  background: lightgray;
  display: flex;
  left: 0;
  max-width: initial;
  max-height: initial;
  overflow: auto;
  position: fixed;
  transition: all 0.2s ease;
  top: 91px;
  right: 0;
  z-index: 1001;
`;

const ReturnButton = styled(Button)`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: black;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 999;
`;

const StyledTextarea = styled(TextareaAutosize)`
  width: 100%;
  height: 90px;
`;

const ErrorExportButton = styled(Button)`
  color: white;
`;

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
  onPublish: (isEdit) => void;
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
  getScheduleInfo: () => IScheduleInfo;
  actionCreator: any;
  applyRuntimeArguments: (runtimeArgs) => void;
  applyBatchConfig: (...args) => void;
  applyRealtimeConfig: (...args) => void;
  getPostActions: () => any[];
  validatePluginProperties: (action: any, errorCb: any) => void;
  getRuntimeArgs: () => any;
  getStoreConfig: () => any;
  getConfigForExport: () => any;
  isEdit: boolean;
  saveChangeSummary: (changeSummary: string) => any;
  getParentVersion: () => any;
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
  getScheduleInfo,
  actionCreator,
  applyRuntimeArguments,
  applyBatchConfig,
  applyRealtimeConfig,
  getPostActions,
  validatePluginProperties,
  getRuntimeArgs,
  getStoreConfig,
  getConfigForExport,
  isEdit,
  saveChangeSummary,
  getParentVersion,
}: ITopPanelProps) => {
  const sheculdeInfo = getScheduleInfo();
  const [isChangeSummaryOpen, setIsChangeSummaryOpen] = useState<boolean>(false);
  const [changeSummary, setChangeSummary] = useState('');
  const [parentConfig, setParentConfig] = useState({ ...getConfigForExport().config });
  const [editStatus, setEditStatus] = useState(null);

  const initialError = {
    errorMessage: null,
    actionElements: null,
  };

  const exportDraftAndRedirect = () => {
    downloadFile(getConfigForExport());
    window.onbeforeunload = null;
    editPipeline(state.metadata.name);
  };

  const outdatedDraftErrorActionElements = () => {
    return (
      <div>
        <ErrorExportButton
          variant="outlined"
          onClick={() => {
            exportDraftAndRedirect();
          }}
        >
          Export
        </ErrorExportButton>
      </div>
    );
  };

  const PREFIX = 'features.LifeCycleManagement';

  const errorReducer = (eState, action) => {
    switch (action.type) {
      case 'noEditChangeError':
        return {
          errorMessage: T.translate(`${PREFIX}.errors.noEditChangeError`),
          actionElements: null,
        };
      case 'outdatedDraftError':
        return {
          errorMessage: T.translate(`${PREFIX}.errors.outdatedDraftError`, {
            pipelineName: state.metadata.name,
          }),
          actionElements: outdatedDraftErrorActionElements(),
        };
      case 'reset':
        return initialError;
    }
  };

  const [errorState, errorDispatch] = useReducer(errorReducer, initialError);

  const onSummaryChange = (value: string) => {
    setChangeSummary(value);
  };

  const closeChangeSummary = () => {
    setIsChangeSummaryOpen(false);
  };

  const publishPipeline = () => {
    if (isEdit) {
      // check for if parentVersion is still good
      const params = {
        namespace: getCurrentNamespace(),
        appId: state.metadata.name,
      };
      MyPipelineApi.get(params).subscribe(
        (res) => {
          // check for if edit has new changes
          if (cleanseAndCompareTwoObjects(parentConfig, getConfigForExport().config)) {
            errorDispatch({ type: 'noEditChangeError' });
            return;
          }
          if (res.appVersion !== getParentVersion()) {
            errorDispatch({ type: 'outdatedDraftError' });
            setEditStatus('Draft out of date');
            return;
          }
          setIsChangeSummaryOpen(true);
        },
        (err) => {
          // Draft is orphaned, can do normal deploy
          onPublish(!isEdit);
        }
      );
    } else {
      onPublish(isEdit);
    }
  };

  // poll the edit status every 5 seconds
  useEffect(() => {
    if (!isEdit) {
      return;
    }
    const params = {
      namespace: getCurrentNamespace(),
      appId: state.metadata.name,
    };

    // first time execute before interval
    MyPipelineApi.get(params).subscribe(
      (res) => {
        setParentConfig(JSON.parse(res.configuration));
        if (res.appVersion === getParentVersion()) {
          setEditStatus('Editing in progress');
          return;
        }
        if (res.appVersion !== getParentVersion()) {
          setEditStatus('Draft out of date');
          return;
        }
      },
      (err) => {
        setEditStatus('Orphaned draft');
      }
    );
    const interval = setInterval(() => {
      MyPipelineApi.get(params).subscribe({
        next(res) {
          if (res.appVersion === getParentVersion()) {
            setEditStatus('Editing in progress');
            return;
          }
          if (res.appVersion !== getParentVersion()) {
            setEditStatus('Draft out of date');
            return;
          }
        },
        error(err) {
          setEditStatus('Orphaned draft');
        },
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updatePipeline = () => {
    saveChangeSummary(changeSummary);
    onPublish(isEdit);
    closeChangeSummary();
  };

  const confirmationElem = (
    <StyledTextarea
      rowsMin={3}
      autoFocus={true}
      onChange={(e) => onSummaryChange(e.target.value)}
      value={changeSummary}
    />
  );
  return (
    <>
      {errorState.errorMessage && (
        <ErrorBanner
          error={errorState.errorMessage}
          actionElements={errorState.actionElements}
          onClose={() => {
            errorDispatch({ type: 'reset' });
          }}
        />
      )}
      <TopPanelContainer>
        <NameAndDescription
          globals={globals}
          metadataExpanded={metadataExpanded}
          state={state}
          invalidName={invalidName}
          parsedDescription={parsedDescription}
          saveMetadata={saveMetadata}
          resetMetadata={resetMetadata}
          openMetadata={openMetadata}
          isEdit={isEdit}
          editStatus={editStatus}
        ></NameAndDescription>
        <ActionButtons
          previewMode={previewMode}
          previewEnabled={previewEnabled}
          togglePreviewMode={togglePreviewMode}
          toggleConfig={toggleConfig}
          viewConfig={viewConfig}
          showSchedule={showSchedule && !isEdit}
          viewScheduler={viewScheduler}
          toggleScheduler={toggleScheduler}
          hasNodes={hasNodes}
          onSaveDraft={onSaveDraft}
          onPublish={publishPipeline}
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
          applyRuntimeArguments={applyRuntimeArguments}
          state={state}
          runPipeline={startOrStopPreview}
          applyBatchConfig={applyBatchConfig}
          applyRealtimeConfig={applyRealtimeConfig}
          actionCreator={actionCreator}
          getPostActions={getPostActions}
          validatePluginProperties={validatePluginProperties}
          getRuntimeArgs={getRuntimeArgs}
          getStoreConfig={getStoreConfig}
        ></ActionButtons>
        <ResourceCenterButton></ResourceCenterButton>
      </TopPanelContainer>
      {viewScheduler && (
        <PipelineScheduler
          schedule={sheculdeInfo.schedule}
          maxConcurrentRuns={sheculdeInfo.maxConcurrentRuns}
          actionCreator={actionCreator}
          pipelineName={state.metadata.name}
          onClose={closeScheduler}
          open={true}
          suppressAnimation={true}
          anchorEl="pipeline-schedule-modeless-btn"
        ></PipelineScheduler>
      )}
      {viewLogs && (
        <PipelinePreviewLogs>
          <PreviewLogs
            namespace={namespace}
            previewId={currentPreviewId}
            stopPoll={!previewRunning}
            onClose={onCloseLog}
          ></PreviewLogs>
        </PipelinePreviewLogs>
      )}
      {(viewLogs || viewConfig) && (
        <ReturnButton
          onClick={() => {
            onCloseLog();
            if (viewConfig) {
              toggleConfig();
            }
          }}
        ></ReturnButton>
      )}
      <ConfirmationModal
        headerTitle="Enter Change Summary"
        isOpen={isChangeSummaryOpen}
        cancelFn={closeChangeSummary}
        confirmButtonText="Deploy"
        toggleModal={closeChangeSummary}
        confirmationElem={confirmationElem}
        confirmFn={updatePipeline}
      />
    </>
  );
};
