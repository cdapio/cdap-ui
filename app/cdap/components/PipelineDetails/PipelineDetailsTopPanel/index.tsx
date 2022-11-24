/*
 * Copyright © 2018 Cask Data, Inc.
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

import React, { useEffect } from 'react';
import { Provider, connect } from 'react-redux';
import PipelineDetailsMetadata from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineDetailsMetadata';
import PipelineDetailsButtons from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineDetailsButtons';
import PipelineDetailsDetailsActions from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineDetailsDetailsActions';
import PipelineDetailStore from 'components/PipelineDetails/store';
import PipelineConfigurationsStore, {
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import PlusButton from 'components/shared/PlusButton';
import { fetchAndUpdateRuntimeArgs } from 'components/PipelineConfigurations/Store/ActionCreator';
import { FeatureProvider } from 'services/react/providers/featureFlagProvider';
import { setEditDraftId } from '../store/ActionCreator';

require('./PipelineDetailsTopPanel.scss');

const mapStateToButtonsProps = (state) => {
  return {
    pipelineType: state.artifact.name,
    pipelineName: state.name,
    schedule: state.config.schedule,
    maxConcurrentRuns: state.config.maxConcurrentRuns,
    scheduleStatus: state.scheduleStatus,
    runs: state.runs,
    currentRun: state.currentRun,
    runButtonLoading: state.runButtonLoading,
    runError: state.runError,
    scheduleButtonLoading: state.scheduleButtonLoading,
    scheduleError: state.scheduleError,
    stopButtonLoading: state.stopButtonLoading,
    stopError: state.stopError,
    change: state.change,
  };
};

const ConnectedPipelineDetailsButtons = connect(mapStateToButtonsProps)(PipelineDetailsButtons);

export const PipelineDetailsTopPanel = () => {
  useEffect(() => {
    const pipelineDetailStore = PipelineDetailStore.getState();
    const pipelineDetailStoreConfig = pipelineDetailStore.config;
    PipelineConfigurationsStore.dispatch({
      type: PipelineConfigurationsActions.SET_PIPELINE_VISUAL_CONFIGURATION,
      payload: {
        pipelineVisualConfiguration: {
          pipelineType: pipelineDetailStore.artifact.name,
        },
      },
    });
    PipelineConfigurationsStore.dispatch({
      type: PipelineConfigurationsActions.INITIALIZE_CONFIG,
      payload: { ...pipelineDetailStoreConfig },
    });
    fetchAndUpdateRuntimeArgs();
    if (window.localStorage.getItem('editDraftId')) {
      setEditDraftId(window.localStorage.getItem('editDraftId'));
      window.localStorage.removeItem('editDraftId');
    }
  }, []);
  return (
    <FeatureProvider>
      <Provider store={PipelineDetailStore}>
        <div className="pipeline-details-top-panel">
          <PipelineDetailsMetadata />
          <ConnectedPipelineDetailsButtons />
          <PipelineDetailsDetailsActions />
          <PlusButton mode={PlusButton.MODE.resourcecenter} />
        </div>
      </Provider>
    </FeatureProvider>
  );
};
