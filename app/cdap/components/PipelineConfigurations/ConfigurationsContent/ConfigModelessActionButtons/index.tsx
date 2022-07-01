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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  updatePipeline,
  runPipeline,
  schedulePipeline,
  updatePreferences,
} from 'components/PipelineConfigurations/Store/ActionCreator';
import { setRunError } from 'components/PipelineDetails/store/ActionCreator';
import ConfigModelessSaveBtn from 'components/PipelineConfigurations/ConfigurationsContent/ConfigModelessActionButtons/ConfigModelessSaveBtn';
import { Observable } from 'rxjs/Observable';
import PipelineConfigurationsStore from 'components/PipelineConfigurations/Store';
import { convertKeyValuePairsToMap } from 'services/helpers';
import { GLOBALS } from 'services/global-constants';

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
}

export default class ConfigModelessActionButtons extends Component<
  IConfigModelessActionButtonsProps
> {
  public state = {
    saveLoading: false,
    saveAndRunLoading: false,
    saveAndScheduleLoading: false,
    runtimeArgsCopied: false,
  };

  public closeModeless = () => {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };

  public closeModelessAndRun = () => {
    const { runtimeArgs } = PipelineConfigurationsStore.getState();
    this.closeModeless();
    runPipeline(runtimeArgs);
  };

  public closeModelessAndRunStudio = () => {
    this.saveReactStoreToAngularStore();
    this.props.studioRunPipeline();
  };

  public closeModelessAndSchedule = () => {
    this.closeModeless();
    schedulePipeline();
  };

  public saveConfig = () => {
    if (this.props.isDeployed) {
      this.saveAndAction('saveLoading', this.closeModeless);
    } else {
      this.saveReactStoreToAngularStore();
      this.props.onClose();
    }
  };

  public saveAndAction = (loadingState, actionFn) => {
    this.setState({
      [loadingState]: true,
    });
    Observable.forkJoin(updatePipeline(), updatePreferences()).subscribe(
      () => {
        actionFn();
        this.setState({
          [loadingState]: false,
        });
      },
      (err) => {
        setRunError(err.response || err);
        this.setState({
          [loadingState]: false,
        });
      }
    );
  };

  public setRuntimeArgsCopiedState = () => {
    this.setState({
      runtimeArgsCopied: true,
    });
  };

  // This is a temporary measure before 'deploy' button
  // migrates to react
  public saveReactStoreToAngularStore = () => {
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
    if (this.props.pipelineType === GLOBALS.etlDataPipeline) {
      this.props.applyBatchConfig(
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
    } else if (this.props.pipelineType === GLOBALS.etlDataStreams) {
      this.props.applyRealtimeConfig(
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

  public render() {
    return (
      <div className="configuration-step-navigation">
        <div className="apply-action-container">
          {!this.props.isHistoricalRun && !this.props.isPreview ? (
            <ConfigModelessSaveBtn
              saveConfig={this.saveConfig}
              saveLoading={this.state.saveLoading}
              buttonLabel={'save'}
              className={'btn btn-primary'}
              dataTestId="config-apply-close"
            />
          ) : null}
          {this.props.isPreview && (
            <>
              <ConfigModelessSaveBtn
                saveConfig={this.closeModelessAndRunStudio}
                saveLoading={this.state.saveAndRunLoading}
                buttonLabel={'saveAndRun'}
                className={'btn btn-primary'}
                dataCy={'preview-configure-run-btn'}
              />
              <ConfigModelessSaveBtn
                saveConfig={this.saveConfig}
                saveLoading={this.state.saveLoading}
                buttonLabel={'save'}
                className={'btn btn-secondary'}
                dataTestId="config-apply-close"
              />
            </>
          )}
        </div>
      </div>
    );
  }
}
