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
import Instrumentation from 'components/PipelineConfigurations/ConfigurationsContent/PipelineConfigTabContent/Instrumentation';
import Checkpointing from 'components/PipelineConfigurations/ConfigurationsContent/PipelineConfigTabContent/Checkpointing';
import BatchInterval from 'components/PipelineConfigurations/ConfigurationsContent/PipelineConfigTabContent/BatchInterval';
import ServiceAccountPath from 'components/PipelineConfigurations/ConfigurationsContent/PipelineConfigTabContent/ServiceAccountPath';
import { connect } from 'react-redux';
import T from 'i18n-react';
import { GLOBALS } from 'services/global-constants';
require('./PipelineConfigTabContent.scss');

const PREFIX = 'features.PipelineConfigurations.PipelineConfig';

function PipelineConfigTabContent({ pipelineType }) {
  return (
    <div
      id="pipeline-config-tab-content"
      className="configuration-step-content"
    >
      <div className="step-content-heading">
        {T.translate(`${PREFIX}.contentHeading`)}
      </div>
      {pipelineType === GLOBALS.etlDataStreams ? (
        <div>
          <BatchInterval />
          <Checkpointing />
        </div>
      ) : null}
      {pipelineType === GLOBALS.eltSqlPipeline ? <ServiceAccountPath /> : null}
      <Instrumentation />
    </div>
  );
}

PipelineConfigTabContent.propTypes = {
  pipelineType: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    pipelineType: state.pipelineVisualConfiguration.pipelineType,
  };
};
const ConnectedPipelineConfigTabContent = connect(mapStateToProps)(
  PipelineConfigTabContent
);

export default ConnectedPipelineConfigTabContent;
