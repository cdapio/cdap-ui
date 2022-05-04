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

import IconSVG from 'components/shared/IconSVG';
import React from 'react';
import {
  ActionButtonsContainer,
  BorderRightButton,
  ButtonLabel,
  CommonButton,
  CustomTooltip,
  IconLoading,
  IconPlay,
  IconSchedule,
  IconSliders,
  IconStop,
  PreviewModeButton,
  RunTimeSpan,
} from './styles';

interface IDuration {
  minutes: string;
  seconds: string;
}

interface IActionButtonsProps {
  previewMode: boolean;
  previewEnabled: boolean;
  togglePreviewMode: () => void;
  toggleConfig: () => void;
  viewConfig: boolean;
  showSchedule: boolean;
  viewScheduler: boolean;
  toggleScheduler: () => void;
  hasNodes: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
  onImport: () => void;
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
  timerLabel: string;
}

export const ActionButtons = ({
  previewMode,
  previewEnabled,
  togglePreviewMode,
  toggleConfig,
  viewConfig,
  showSchedule,
  viewScheduler,
  toggleScheduler,
  hasNodes,
  onSaveDraft,
  onPublish,
  onImport,
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
  timerLabel,
}: IActionButtonsProps) => {
  return (
    <ActionButtonsContainer>
      {previewMode ? (
        //   PREVIEW MODE BUTTONS
        <>
          <PreviewModeButton onClick={togglePreviewMode} data-cy="preview-active-btn">
            <div>
              <IconSVG name="icon-eye"></IconSVG>
              <ButtonLabel>Preview</ButtonLabel>
            </div>
          </PreviewModeButton>
          <CommonButton
            active={viewConfig}
            disabled={previewLoading || previewRunning}
            onClick={!previewLoading && !previewRunning && toggleConfig}
            data-cy="preview-config-btn"
          >
            <div>
              <IconSliders name="icon-sliders"></IconSliders>
              <ButtonLabel>Configure</ButtonLabel>
            </div>
          </CommonButton>
          {!previewLoading &&
            (!previewRunning ? (
              <CustomTooltip
                title={hasNodes ? '' : 'Start building a pipeline before starting preview'}
                arrow
                placement="bottom"
              >
                <span>
                  <CommonButton
                    disabled={!hasNodes}
                    onClick={hasNodes && startOrStopPreview}
                    data-cy="preview-top-run-btn"
                  >
                    <div>
                      <IconPlay name="icon-play" disabled={!hasNodes}></IconPlay>
                      <ButtonLabel>Run</ButtonLabel>
                    </div>
                  </CommonButton>
                </span>
              </CustomTooltip>
            ) : (
              <CommonButton onClick={startOrStopPreview} data-cy="stop-preview-btn">
                <div>
                  <IconStop name="icon-stop"></IconStop>
                  <ButtonLabel>Stop</ButtonLabel>
                </div>
              </CommonButton>
            ))}
          {previewLoading && (
            <CommonButton data-cy="starting-preview-btn">
              <div>
                <IconLoading className="fa fa-refresh fa-spin"></IconLoading>
                <ButtonLabel>{loadingLabel}</ButtonLabel>
              </div>
            </CommonButton>
          )}
          <CommonButton title={queueStatus}>
            <div>
              <RunTimeSpan>
                {displayDuration.minutes}:{displayDuration.seconds}
              </RunTimeSpan>
              <ButtonLabel>{timerLabel}</ButtonLabel>
            </div>
          </CommonButton>
          <CommonButton disabled={!currentPreviewId} active={viewLogs} onClick={onClickLogs}>
            <div>
              <IconSVG name="icon-file-text-o"></IconSVG>
              <ButtonLabel>Logs</ButtonLabel>
            </div>
          </CommonButton>
        </>
      ) : (
        <>
          <CustomTooltip
            title={previewEnabled ? '' : 'Pipeline preview is not available in distributed mode'}
            arrow
            placement="bottom"
          >
            <BorderRightButton
              disabled={!previewEnabled}
              onClick={previewEnabled && togglePreviewMode}
              data-cy="pipeline-preview-btn"
            >
              <div>
                <IconSVG name="icon-eye"></IconSVG>
                <ButtonLabel>Preview</ButtonLabel>
              </div>
            </BorderRightButton>
          </CustomTooltip>
          <CommonButton
            active={viewConfig}
            onClick={toggleConfig}
            data-cy="pipeline-configure-modeless-btn"
          >
            <div>
              <IconSliders name="icon-sliders"></IconSliders>
              <ButtonLabel>Configure</ButtonLabel>
            </div>
          </CommonButton>
          {showSchedule && (
            <CustomTooltip
              title={hasNodes ? '' : 'Start building a pipeline before scheduling'}
              arrow
              placement="bottom"
            >
              <span>
                <CommonButton
                  active={viewScheduler}
                  disabled={!hasNodes}
                  onClick={!hasNodes || toggleScheduler}
                  id="pipeline-schedule-modeless-btn"
                  data-cy="pipeline-schedule-modeless-btn"
                >
                  <div>
                    <IconSchedule name="icon-runtimestarttime"></IconSchedule>
                    <ButtonLabel>Schedule</ButtonLabel>
                  </div>
                </CommonButton>
              </span>
            </CustomTooltip>
          )}
          <CustomTooltip
            title={hasNodes ? '' : 'Start building a pipeline before saving'}
            arrow
            placement="bottom"
          >
            <span>
              <CommonButton
                disabled={!hasNodes}
                onClick={!hasNodes || onSaveDraft}
                data-cy="pipeline-draft-save-btn"
              >
                <div>
                  <IconSVG name="icon-savedraft"></IconSVG>
                  <ButtonLabel>Save</ButtonLabel>
                </div>
              </CommonButton>
            </span>
          </CustomTooltip>
          <CustomTooltip
            title={hasNodes ? '' : 'Start building a pipeline before deploying'}
            arrow
            placement="bottom"
          >
            <span>
              <BorderRightButton
                disabled={!hasNodes}
                onClick={!hasNodes || onPublish}
                data-cy="deploy-pipeline-btn"
              >
                <div>
                  <IconSVG name="icon-publish"></IconSVG>
                  <ButtonLabel>Deploy</ButtonLabel>
                </div>
              </BorderRightButton>
            </span>
          </CustomTooltip>
          <CommonButton onClick={onImport} data-cy="pipeline-import-btn">
            <div>
              <IconSVG name="icon-import"></IconSVG>
              <ButtonLabel>Import</ButtonLabel>
            </div>
          </CommonButton>
          <CustomTooltip
            title={hasNodes ? '' : 'Start building a pipeline before exporting'}
            arrow
            placement="bottom"
          >
            <span>
              <BorderRightButton
                disabled={!hasNodes}
                onClick={!hasNodes || onExport}
                data-cy="pipeline-export-btn"
              >
                <div>
                  <IconSVG name="icon-export"></IconSVG>
                  <ButtonLabel>Export</ButtonLabel>
                </div>
              </BorderRightButton>
            </span>
          </CustomTooltip>
        </>
      )}
    </ActionButtonsContainer>
  );
};
