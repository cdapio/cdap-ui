/*
 * Copyright © 2018-2022 Cask Data, Inc.
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
import ToggleSwitch from 'components/shared/ToggleSwitch';
import Popover from 'components/shared/Popover';
import PipelineConfigurationsStore, {
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import T from 'i18n-react';
import { GENERATED_RUNTIMEARGS } from 'services/global-constants';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import { getUpdatedRuntimeArgsPair } from '../helper';

const PREFIX = 'features.PipelineConfigurations.PipelineConfig';

const mapStateToInstrumentationProps = (state) => {
  const processTimingEnabledKeyValuePair = state.runtimeArgs.pairs.find(
    (pair) => pair.key === GENERATED_RUNTIMEARGS.PIPELINE_INSTRUMENTATION
  );
  return {
    instrumentation: processTimingEnabledKeyValuePair
      ? processTimingEnabledKeyValuePair.value === 'true'
      : state.processTimingEnabled,
  };
};
const mapDispatchToInstrumentationProps = (dispatch) => {
  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );
  return {
    onToggle: (value) => {
      dispatch({
        type: PipelineConfigurationsActions.SET_INSTRUMENTATION,
        payload: { instrumentation: value },
      });
      if (lifecycleManagementEditEnabled) {
        const { runtimeArgs } = PipelineConfigurationsStore.getState();
        const newRunTimePairs = getUpdatedRuntimeArgsPair(
          runtimeArgs,
          GENERATED_RUNTIMEARGS.PIPELINE_INSTRUMENTATION,
          value
        );
        dispatch({
          type: PipelineConfigurationsActions.SET_RUNTIME_ARGS,
          payload: { runtimeArgs: { pairs: newRunTimePairs } },
        });
      }
    },
  };
};

const Instrumentation = ({ instrumentation, onToggle }) => {
  return (
    <div className="label-with-toggle instrumentation row">
      <span className="toggle-label col-4">
        {T.translate(`${PREFIX}.instrumentation`)}
      </span>
      <div className="col-7 toggle-container">
        <ToggleSwitch
          isOn={instrumentation}
          onToggle={onToggle.bind(null, !instrumentation)}
        />
        <Popover
          target={() => <IconSVG name="icon-info-circle" />}
          showOn="Hover"
          placement="right"
        >
          {T.translate(`${PREFIX}.instrumentationTooltip`)}
        </Popover>
      </div>
    </div>
  );
};

Instrumentation.propTypes = {
  instrumentation: PropTypes.bool,
  onToggle: PropTypes.func,
};

const ConnectedInstrumentation = connect(
  mapStateToInstrumentationProps,
  mapDispatchToInstrumentationProps
)(Instrumentation);

export default ConnectedInstrumentation;
