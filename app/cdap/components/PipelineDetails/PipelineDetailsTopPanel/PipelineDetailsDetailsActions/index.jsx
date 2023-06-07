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
import styled from 'styled-components';
import T from 'i18n-react';
import PipelineDetailsActionsButton from 'components/PipelineDetails/PipelineDetailsTopPanel/PipelineDetailsDetailsActions/PipelineDetailsActionsButton';
import { useFeatureFlagDefaultFalse } from 'services/react/customHooks/useFeatureFlag';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { getHydratorUrl } from 'services/UiUtils/UrlGenerator';

require('./PipelineDetailsDetailsActions.scss');

const StyledLinkToLatest = styled.a`
  padding-top: 22px;
  font-size: 10px;
  cursor: pointer;
`;

const mapDetailsStateToProps = (state) => {
  return {
    pipelineName: state.name,
    description: state.description,
    artifact: state.artifact,
    config: state.config,
    version: state.version,
    editDraftId: state.editDraftId,
    change: state.change,
  };
};

const PipelineDetailsDetailsActions = ({
  pipelineName,
  description,
  artifact,
  config,
  version,
  editDraftId,
  change,
}) => {
  const lifecycleManagementEditEnabled = useFeatureFlagDefaultFalse(
    'lifecycle.management.edit.enabled'
  );
  const sourceControlManagementEnabled = useFeatureFlagDefaultFalse(
    'source.control.management.git.enabled'
  );
  const isLatestVersion = change ? change.latest : true;
  return (
    <div className="pipeline-details-buttons pipeline-details-details-actions">
      {!isLatestVersion && (
        <StyledLinkToLatest
          onClick={() => {
            window.location.href = getHydratorUrl({
              stateName: 'hydrator.detail',
              stateParams: {
                namespace: getCurrentNamespace(),
                pipelineId: pipelineName,
              },
            });
          }}
        >
          {T.translate('features.LifeCycleManagement.returnToLatest')}
        </StyledLinkToLatest>
      )}
      <PipelineDetailsActionsButton
        pipelineName={pipelineName}
        description={description}
        artifact={artifact}
        config={config}
        version={version}
        lifecycleManagementEditEnabled={lifecycleManagementEditEnabled}
        sourceControlManagementEnabled={sourceControlManagementEnabled}
        editDraftId={editDraftId}
        isLatestVersion={isLatestVersion}
      />
    </div>
  );
};

PipelineDetailsDetailsActions.propTypes = {
  pipelineName: PropTypes.string,
  description: PropTypes.string,
  artifact: PropTypes.object,
  config: PropTypes.object,
  version: PropTypes.string,
  editDraftId: PropTypes.string,
  change: PropTypes.object,
};

const ConnectedPipelineDetailsDetailsActions = connect(mapDetailsStateToProps)(
  PipelineDetailsDetailsActions
);
export default ConnectedPipelineDetailsDetailsActions;
