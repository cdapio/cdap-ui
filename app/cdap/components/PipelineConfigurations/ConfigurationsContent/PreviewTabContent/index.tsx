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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GLOBALS } from 'services/global-constants';
import { RealtimePipelinePreviewConfig } from './RealtimePipelinePreviewConfig';
import { BatchPipelinePreviewConfig } from './BatchPipelinePreviewConfig';

function PreviewConfigTabContent({ pipelineType }) {
  return (
    <>
      {pipelineType === GLOBALS.etlDataStreams ? <RealtimePipelinePreviewConfig /> : null}
      {pipelineType === GLOBALS.etlDataPipeline ? <BatchPipelinePreviewConfig /> : null}
    </>
  );
}

PreviewConfigTabContent.propTypes = {
  pipelineType: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    pipelineType: state.pipelineVisualConfiguration.pipelineType,
  };
};
const ConnectedPreviewConfigTabContent = connect(mapStateToProps)(PreviewConfigTabContent);

export default ConnectedPreviewConfigTabContent;
