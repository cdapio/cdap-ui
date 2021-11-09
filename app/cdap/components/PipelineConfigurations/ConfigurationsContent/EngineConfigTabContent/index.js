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
import { ENGINE_OPTIONS } from 'components/PipelineConfigurations/PipelineConfigConstants';
import EngineRadioInput from 'components/PipelineConfigurations/ConfigurationsContent/EngineConfigTabContent/EngineRadioInput';
import Backpressure from 'components/PipelineConfigurations/ConfigurationsContent/EngineConfigTabContent/Backpressure';
import NumExecutors from 'components/PipelineConfigurations/ConfigurationsContent/EngineConfigTabContent/NumExecutors';
import CustomConfig from 'components/PipelineConfigurations/ConfigurationsContent/EngineConfigTabContent/CustomConfig';
import { connect } from 'react-redux';
import T from 'i18n-react';
import classnames from 'classnames';
import { GLOBALS } from 'services/global-constants';
require('./EngineConfigTabContent.scss');

const PREFIX = 'features.PipelineConfigurations.EngineConfig';

class EngineConfigTabContent extends Component {
  static propTypes = {
    pipelineType: PropTypes.string,
    isDetailView: PropTypes.bool,
  };

  state = {
    showCustomConfig: false,
  };

  toggleCustomConfig = () => {
    this.setState({
      showCustomConfig: !this.state.showCustomConfig,
    });
  };

  renderBatchEngineConfig() {
    return (
      <div className="engine-config-radio">
        <label className="radio-inline radio-spark">
          <EngineRadioInput value={ENGINE_OPTIONS.SPARK} />
          {T.translate('commons.entity.spark.singular')}
        </label>
        <label className="radio-inline radio-mapReduce">
          <EngineRadioInput value={ENGINE_OPTIONS.MAPREDUCE} />
          {T.translate('commons.entity.mapreduce.singular')}
        </label>
      </div>
    );
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
    const pipelineTypeLabel = GLOBALS.programLabel[this.props.pipelineType];
    const isBatch = GLOBALS.etlBatchPipelines.includes(this.props.pipelineType);
    return (
      <div
        id="engine-config-tab-content"
        className={classnames('configuration-step-content configuration-content-container', {
          'batch-content': isBatch,
          'realtime-content': !isBatch,
        })}
      >
        <fieldset disabled={this.props.isDetailView}>
          <div className="step-content-heading">
            {T.translate(`${PREFIX}.contentHeading`, { pipelineTypeLabel })}
          </div>
          {isBatch
            ? this.renderBatchEngineConfig()
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
  return {
    pipelineType: state.pipelineVisualConfiguration.pipelineType,
    isDetailView: state.pipelineVisualConfiguration.isDetailView,
  };
};

const ConnectedEngineConfigTabContent = connect(mapStateToProps)(EngineConfigTabContent);

export default ConnectedEngineConfigTabContent;
