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

import React, { useState } from 'react';
import {
  runPipeline,
  schedulePipeline,
  updatePipeline,
  updatePreferences,
} from 'components/PipelineConfigurations/Store/ActionCreator';
import { setRunError } from 'components/PipelineDetails/store/ActionCreator';
import ConfigModelessSaveBtn from 'components/PipelineConfigurations/ConfigurationsContent/ConfigModelessActionButtons/ConfigModelessSaveBtn';
import { Observable } from 'rxjs/Observable';
import PipelineConfigurationsStore from 'components/PipelineConfigurations/Store';
import { convertKeyValuePairsToMap } from 'services/helpers';
import { GLOBALS } from 'services/global-constants';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';

require('./ConfigModelessActionButtons.scss');

interface IConfigModelessActionButtonsProps {
  onClose: () => void;
  isHistoricalRun?: boolean;
  applyRuntimeArguments?: (runtimeArgs: any) => void;
  isDeployed?: boolean;
  isPreview?: boolean;
  studioRunPipeline?: () => void;
  applyBatchConfig?: (...args) => void;
  applyRealtimeConfig?: (...args) => void;
  pipelineType?: string;
  isLatestVersion?: boolean;
}

export const ConfigModelessActionButtons = ({ ...props }: IConfigModelessActionButtonsProps) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveAndRunLoading, setSaveAndRunLoading] = useState(false);
  const [saveAndScheduleLoading, setSaveAndScheduleLoading] = useState(false);
  const [runtimeArgsCopied, setRuntimeArgsCopied] = useState(false);

  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );

  const closeModeless = () => {
    if (typeof props.onClose === 'function') {
      props.onClose();
    }
  };

  const closeModelessAndRun = () => {
    const { runtimeArgs } = PipelineConfigurationsStore.getState();
    closeModeless();
    runPipeline(runtimeArgs);
  };

  const closeModelessAndRunStudio = () => {
    saveReactStoreToAngularStore();
    props.studioRunPipeline();
  };

  const closeModelessAndSchedule = () => {
    closeModeless();
    schedulePipeline();
  };

  const saveConfig = () => {
    if (props.isDeployed) {
      saveAndAction(closeModeless);
    } else {
      saveReactStoreToAngularStore();
      props.onClose();
    }
  };

  const saveAndAction = (actionFn) => {
    setSaveLoading(true);
    let observable;
    if (lifecycleManagementEditEnabled) {
      observable = updatePreferences(lifecycleManagementEditEnabled, true);
    } else {
      observable = Observable.forkJoin(updatePipeline(), updatePreferences());
    }
    observable.subscribe(
      () => {
        actionFn();
        setSaveLoading(false);
      },
      (err) => {
        setRunError(err.response || err);
        setSaveLoading(false);
      }
    );
  };

  const setRuntimeArgsCopiedState = () => {
    setRuntimeArgsCopied(true);
  };

  // This is a temporary measure before 'deploy' button
  // migrates to react
  const saveReactStoreToAngularStore = () => {
    const {
      engine,
      resources,
      driverResources,
      clientResources,
      properties,
      processTimingEnabled,
      stageLoggingEnabled,
      customConfigKeyValuePairs,
      numOfRecordsPreview,
      runtimeArgs,
      backpressure,
      numExecutors,
      disableCheckpoints,
      checkpointDir,
      batchInterval,
      previewTimeoutInMin,
    } = PipelineConfigurationsStore.getState();
    const customConfig = convertKeyValuePairsToMap(Object.values(customConfigKeyValuePairs)[0]);
    if (props.pipelineType === GLOBALS.etlDataPipeline) {
      props.applyBatchConfig(
        engine,
        resources,
        driverResources,
        properties,
        processTimingEnabled,
        stageLoggingEnabled,
        customConfig,
        numOfRecordsPreview,
        runtimeArgs
      );
    } else if (props.pipelineType === GLOBALS.etlDataStreams) {
      props.applyRealtimeConfig(
        resources,
        driverResources,
        processTimingEnabled,
        stageLoggingEnabled,
        customConfig,
        backpressure,
        // the angularjs ctrl doesn't like this to be numeric
        numExecutors.toString(),
        disableCheckpoints,
        checkpointDir,
        batchInterval,
        clientResources,
        previewTimeoutInMin,
        runtimeArgs
      );
    }
  };

  return (
    <div className="configuration-step-navigation">
      <div className="apply-action-container">
        {!props.isHistoricalRun && !props.isPreview ? (
          <ConfigModelessSaveBtn
            saveConfig={saveConfig}
            saveLoading={saveLoading}
            buttonLabel={'save'}
            className={'btn btn-primary'}
            dataTestId="config-apply-close"
          />
        ) : null}
        {props.isPreview && (
          <>
            <ConfigModelessSaveBtn
              saveConfig={closeModelessAndRunStudio}
              saveLoading={saveAndRunLoading}
              buttonLabel={'saveAndRun'}
              className={'btn btn-primary'}
              dataCy={'preview-configure-run-btn'}
            />
            <ConfigModelessSaveBtn
              saveConfig={saveConfig}
              saveLoading={saveLoading}
              buttonLabel={'save'}
              className={'btn btn-secondary'}
              dataTestId="config-apply-close"
            />
          </>
        )}
      </div>
    </div>
  );
};
