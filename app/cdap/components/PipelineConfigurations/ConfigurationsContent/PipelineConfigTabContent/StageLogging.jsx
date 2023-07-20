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
import ToggleSwitch from 'components/shared/ToggleSwitch';
import Popover from 'components/shared/Popover';
import { ACTIONS as PipelineConfigurationsActions } from 'components/PipelineConfigurations/Store';
import T from 'i18n-react';

const PREFIX = 'features.PipelineConfigurations.PipelineConfig';

const mapStateToStageLoggingProps = (state) => {
  return {
    stageLogging: state.stageLoggingEnabled,
  };
};
const mapDispatchToStageLoggingProps = (dispatch) => {
  return {
    onToggle: (value) => {
      dispatch({
        type: PipelineConfigurationsActions.SET_STAGE_LOGGING,
        payload: { stageLogging: value },
      });
    },
  };
};

const StageLogging = ({ stageLogging, onToggle }) => {
  return (
    <div className="label-with-toggle stageLogging row">
      <span className="toggle-label col-4">
        {T.translate(`${PREFIX}.stageLogging`)}
      </span>
      <div className="col-7 toggle-container">
        <ToggleSwitch
          isOn={stageLogging}
          onToggle={onToggle.bind(null, !stageLogging)}
        />
        <Popover
          target={() => <IconSVG name="icon-info-circle" />}
          showOn="Hover"
          placement="right"
        >
          {T.translate(`${PREFIX}.stageLoggingTooltip`)}
        </Popover>
      </div>
    </div>
  );
};

StageLogging.propTypes = {
  stageLogging: PropTypes.bool,
  onToggle: PropTypes.func,
};

const ConnectedStageLogging = connect(
  mapStateToStageLoggingProps,
  mapDispatchToStageLoggingProps
)(StageLogging);

export default ConnectedStageLogging;
