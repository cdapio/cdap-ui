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
import SelectWithOptions from 'components/shared/SelectWithOptions';
import {
  NUM_EXECUTORS_OPTIONS,
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import T from 'i18n-react';
import { SPARK_EXECUTOR_INSTANCES } from 'components/PipelineConfigurations/PipelineConfigConstants';
const PREFIX = 'features.PipelineConfigurations.EngineConfig';

const mapStateToProps = (state) => {
  return {
    numExecutors: state.properties[SPARK_EXECUTOR_INSTANCES],
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (e) => {
      dispatch({
        type: PipelineConfigurationsActions.SET_NUM_EXECUTORS,
        payload: { numExecutors: e.target.value },
      });
    },
  };
};

const NumExecutors = ({ numExecutors, onChange }) => {
  return (
    <div className="label-with-toggle numExecutors form-group row">
      <span className="toggle-label col-4">
        {T.translate(`${PREFIX}.numExecutors`)}
      </span>
      <div className="col-7">
        <SelectWithOptions
          className="form-control small-dropdown"
          value={numExecutors}
          options={NUM_EXECUTORS_OPTIONS}
          onChange={onChange}
        />
        <Popover
          target={() => <IconSVG name="icon-info-circle" />}
          showOn="Hover"
          placement="right"
          className="num-executors-tooltip"
        >
          {T.translate(`${PREFIX}.numExecutorsTooltip`)}
        </Popover>
      </div>
    </div>
  );
};

NumExecutors.propTypes = {
  numExecutors: PropTypes.string,
  onChange: PropTypes.func,
};

const ConnectedNumExecutors = connect(
  mapStateToProps,
  mapDispatchToProps
)(NumExecutors);

export default ConnectedNumExecutors;
