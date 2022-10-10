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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ENGINE_OPTIONS,
  SPARK_DYNAMIC_ALLOCATION,
} from 'components/PipelineConfigurations/PipelineConfigConstants';
import EngineRadioInput from './EngineRadioInput';
import Backpressure from 'components/PipelineConfigurations/ConfigurationsContent/EngineConfigTabContent/Backpressure';
import NumExecutors from 'components/PipelineConfigurations/ConfigurationsContent/EngineConfigTabContent/NumExecutors';
import CustomConfig from 'components/PipelineConfigurations/ConfigurationsContent/EngineConfigTabContent/CustomConfig';
import { connect } from 'react-redux';
import T from 'i18n-react';
import classnames from 'classnames';
import { GLOBALS } from 'services/global-constants';
import { Theme } from 'services/ThemeHelper';
import SelectWithOptions from 'components/shared/SelectWithOptions';
import DeprecatedMessage from 'components/shared/DeprecatedMessage';

require('./EngineConfigTabContent.scss');

const PREFIX = 'features.PipelineConfigurations.EngineConfig';

const FORCE_DYNAMIC_EXECUTION_OPTIONS = [
  {
    id: '',
    value: T.translate(`${PREFIX}.dynamicExecution.default`),
  },
  {
    id: GLOBALS.dynamicExecutionForceOn,
    value: T.translate(`${PREFIX}.dynamicExecution.forceOn`),
  },
  {
    id: GLOBALS.dynamicExecutionForceOff,
    value: T.translate(`${PREFIX}.dynamicExecution.forceOff`),
  },
];

class EngineConfigTabContent extends Component {
  static propTypes = {
    pipelineType: PropTypes.string,
    isDetailView: PropTypes.bool,
    forceDynamicExecution: PropTypes.string,
  };

  state = {
    showCustomConfig: false,
  };

  toggleCustomConfig = () => {
    this.setState({
      showCustomConfig: !this.state.showCustomConfig,
    });
  };

  renderBatchEngineConfig(forceDynamicExecution) {
    if (!Theme.allowForceDynamicExecution) {
      return (
        <div className="engine-config-radio">
          <label className="radio-inline radio-spark">
            <EngineRadioInput value={ENGINE_OPTIONS.SPARK} />
            {T.translate('commons.entity.spark.singular')}
          </label>
          <label className="radio-inline radio-mapReduce">
            <EngineRadioInput value={ENGINE_OPTIONS.MAPREDUCE} />
            <DeprecatedMessage />
            {T.translate('commons.entity.mapreduce.singular')}
          </label>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <SelectWithOptions
            value={forceDynamicExecution}
            options={FORCE_DYNAMIC_EXECUTION_OPTIONS}
            className="dynamic-execution-select"
          />
          {forceDynamicExecution === GLOBALS.dynamicExecutionForceOff && <NumExecutors />}
        </React.Fragment>
      );
    }
  }

  renderRealtimeEngineConfig(disabled) {
    return (
      <div>
        <Backpressure disabled={disabled} />
        <NumExecutors />
      </div>
    );
  }

  render() {
    let heading;
    if (!Theme.allowForceDynamicExecution) {
      const pipelineTypeLabel = GLOBALS.programLabel[this.props.pipelineType];
      heading = T.translate(`${PREFIX}.contentHeading`, { pipelineTypeLabel });
    } else {
      heading = T.translate(`${PREFIX}.dynamicExecution.contentHeading`);
    }

    const isBatch = GLOBALS.etlBatchPipelines.includes(this.props.pipelineType);
    return (
      <div
        id="engine-config-tab-content"
        className={classnames('configuration-step-content configuration-content-container', {
          'batch-content': isBatch,
          'realtime-content': !isBatch,
          'allow-force-dynamic-execution': Theme.allowForceDynamicExecution,
        })}
      >
        <fieldset disabled={this.props.isDetailView}>
          <div className="step-content-heading">{heading}</div>
          {isBatch
            ? this.renderBatchEngineConfig(this.props.forceDynamicExecution)
            : this.renderRealtimeEngineConfig(this.props.isDetailView)}
        </fieldset>
        <CustomConfig
          isDetailView={this.props.isDetailView}
          showCustomConfig={this.state.showCustomConfig}
          toggleCustomConfig={this.toggleCustomConfig}
          pipelineType={this.props.pipelineType}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let forceDynamicExecution = '';
  if (Object.prototype.hasOwnProperty.call(state.properties, SPARK_DYNAMIC_ALLOCATION)) {
    if (state.properties[SPARK_DYNAMIC_ALLOCATION] === 'true') {
      forceDynamicExecution = GLOBALS.dynamicExecutionForceOn;
    } else if (state.properties[SPARK_DYNAMIC_ALLOCATION] === 'false') {
      forceDynamicExecution = GLOBALS.dynamicExecutionForceOff;
    }
  }
  return {
    pipelineType: state.pipelineVisualConfiguration.pipelineType,
    isDetailView: state.pipelineVisualConfiguration.isDetailView,
    forceDynamicExecution,
  };
};

const ConnectedEngineConfigTabContent = connect(mapStateToProps)(EngineConfigTabContent);

export default ConnectedEngineConfigTabContent;
