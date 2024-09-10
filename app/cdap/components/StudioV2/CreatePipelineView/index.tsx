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

import React from 'react';
import { useHideFooterInPage } from 'components/FooterContext';
import { Provider } from 'react-redux';
import { CanvasWrapper, DagWrapper, LeftPanelWrapper, RightWrapper } from '../styles';
import { IScheduleInfo, TopPanel } from 'components/hydrator/components/TopPanel/TopPanel';
import DagComponent from './DagComponent';
import AuthRefresher from 'components/AuthRefresher';
import LeftPanelV2 from './LeftPanelV2';
import StudioV2Store from '../store';
import StudioModalsManager from '../modals/StudioModalsManager';

// @ts-ignore
function noop() {}

export default function CreatePipelineView() {
  useHideFooterInPage();

  function getSchedulerInfo(): IScheduleInfo {
    return {
      schedule: '',
      maxConcurrentRuns: 1,
    };
  }

  function getPostActions() {
    return [];
  }

  function getConfigForExport() {
    return {
      config: {},
    };
  }

  console.log('IN THE PAGE');
  return (
    <Provider store={StudioV2Store}>
      <CanvasWrapper>
        <LeftPanelWrapper>
        <LeftPanelV2 />
        </LeftPanelWrapper>
        <RightWrapper>
          <TopPanel
            state={{
              metadata: {
                description: 'some pipeline desc',
                name: 'some_pipeline',
              },
              artifact: {
                name: 'cdap-data-pipeline',
                scope: 'SYSTEM',
                version: '6.11.0-SNAPSHOT',
              },
              viewSettings: false,
            }}
            globals={{
              etlRealtime: 'cdap-data-streams',
              etlDataStreams: 'cdap-data-streams',
              etlBatchPipelines: [],
            }}
            previewMode={false}
            previewEnabled={false}
            togglePreviewMode={noop}
            toggleConfig={noop}
            toggleScheduler={noop}
            closeScheduler={noop}
            viewConfig={false}
            showSchedule={false}
            viewScheduler={false}
            hasNodes={false}
            onSaveDraft={noop}
            onPublish={noop}
            onImport={noop}
            onFileSelect={noop}
            onExport={noop}
            onClickLogs={noop}
            previewLoading={false}
            previewRunning={false}
            startOrStopPreview={noop}
            queueStatus=""
            displayDuration={{ minutes: '', seconds: '' }}
            loadingLabel=""
            currentPreviewId=""
            viewLogs={false}
            onCloseLog={noop}
            timerLabel=""
            namespace="default"
            getScheduleInfo={getSchedulerInfo}
            actionCreator={true}
            applyRuntimeArguments={noop}
            applyBatchConfig={noop}
            applyRealtimeConfig={noop}
            getPostActions={getPostActions}
            validatePluginProperties={noop}
            getRuntimeArgs={noop}
            getStoreConfig={noop}
            getConfigForExport={getConfigForExport}
            isEdit={false}
            saveChangeSummary={noop}
            getParentVersion={noop}
            stateParams={{}}
          />
          <DagWrapper id="dag-wrapper">
            {/* <ReactFlowProvider> */}
            <DagComponent />
            {/* </ReactFlowProvider> */}
          </DagWrapper>
        </RightWrapper>
        <AuthRefresher />
      </CanvasWrapper>
      <StudioModalsManager />
    </Provider>
  );
}
