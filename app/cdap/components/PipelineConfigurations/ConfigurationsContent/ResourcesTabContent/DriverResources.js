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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconSVG from 'components/shared/IconSVG';
import Popover from 'components/shared/Popover';
import PipelineResources from 'components/PipelineResources';
import PipelineConfigurationsStore, {
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import T from 'i18n-react';
import { GENERATED_RUNTIMEARGS } from 'services/global-constants';
import { convertKeyValuePairsToMap, convertMapToKeyValuePairs } from 'services/helpers';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';

const PREFIX = 'features.PipelineConfigurations.Resources';

const mapStateToProps = (state) => {
  const driverResourcesMemory = state.runtimeArgs.pairs.find(
    (pair) => pair.key === GENERATED_RUNTIMEARGS.SYSTEM_DRIVER_RESOURCES_MEMORY
  );
  const driverResourcesCores = state.runtimeArgs.pairs.find(
    (pair) => pair.key === GENERATED_RUNTIMEARGS.SYSTEM_DRIVER_RESOURCES_CORES
  );
  return {
    virtualCores: driverResourcesCores
      ? driverResourcesCores.value
      : state.driverResources.virtualCores,
    memoryMB: driverResourcesMemory ? driverResourcesMemory.value : state.driverResources.memoryMB,
  };
};
const mapDispatchToProps = (dispatch) => {
  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );
  return {
    onVirtualCoresChange: (e) => {
      const { runtimeArgs } = PipelineConfigurationsStore.getState();
      const pairs = [...runtimeArgs.pairs];
      const runtimeObj = convertKeyValuePairsToMap(pairs, true);
      runtimeObj[GENERATED_RUNTIMEARGS.SYSTEM_DRIVER_RESOURCES_CORES] = e.target.value;
      const newRunTimePairs = convertMapToKeyValuePairs(runtimeObj);
      dispatch({
        type: PipelineConfigurationsActions.SET_DRIVER_VIRTUAL_CORES,
        payload: { virtualCores: e.target.value },
      });
      dispatch({
        type: PipelineConfigurationsActions.SET_RUNTIME_ARGS,
        payload: { runtimeArgs: { pairs: newRunTimePairs } },
      });
    },
    onMemoryMBChange: (e) => {
      const { runtimeArgs } = PipelineConfigurationsStore.getState();
      const pairs = [...runtimeArgs.pairs];
      const runtimeObj = convertKeyValuePairsToMap(pairs, true);
      runtimeObj[GENERATED_RUNTIMEARGS.SYSTEM_DRIVER_RESOURCES_MEMORY] = e.target.value;
      const newRunTimePairs = convertMapToKeyValuePairs(runtimeObj);
      dispatch({
        type: PipelineConfigurationsActions.SET_DRIVER_MEMORY_MB,
        payload: { memoryMB: e.target.value },
      });
      if (lifecycleManagementEditEnabled) {
        dispatch({
          type: PipelineConfigurationsActions.SET_RUNTIME_ARGS,
          payload: { runtimeArgs: { pairs: newRunTimePairs } },
        });
      }
    },
  };
};

const DriverResources = ({ virtualCores, onVirtualCoresChange, memoryMB, onMemoryMBChange }) => {
  return (
    <div className="driver" data-cy="resources-config-tab-driver">
      <div className="resource-title-icon">
        <span className="resource-title">{T.translate(`${PREFIX}.driver`)}</span>
        <Popover
          target={() => <IconSVG name="icon-info-circle" />}
          showOn="Hover"
          placement="right"
        >
          {T.translate(`${PREFIX}.driverTooltip`)}
        </Popover>
      </div>
      <PipelineResources
        virtualCores={virtualCores}
        onVirtualCoresChange={onVirtualCoresChange}
        memoryMB={memoryMB}
        onMemoryMBChange={onMemoryMBChange}
      />
    </div>
  );
};

DriverResources.propTypes = {
  virtualCores: PropTypes.number,
  onVirtualCoresChange: PropTypes.func,
  memoryMB: PropTypes.number,
  onMemoryMBChange: PropTypes.func,
};

const ConnectedDriverResources = connect(mapStateToProps, mapDispatchToProps)(DriverResources);

export default ConnectedDriverResources;
