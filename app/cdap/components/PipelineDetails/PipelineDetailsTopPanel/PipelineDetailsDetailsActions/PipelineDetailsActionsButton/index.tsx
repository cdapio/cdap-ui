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
import { connect } from 'react-redux';
import IconSVG from 'components/shared/IconSVG';
import Popover from 'components/shared/Popover';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyAppApi } from 'api/app';
import PipelineExportModal from 'components/PipelineExportModal';
import TriggeredPipelineStore from 'components/TriggeredPipelines/store/TriggeredPipelineStore';
import T from 'i18n-react';
import classnames from 'classnames';
import { duplicatePipeline, editPipeline } from 'services/PipelineUtils';
import cloneDeep from 'lodash/cloneDeep';
import downloadFile from 'services/download-file';
import { santizeStringForHTMLID } from 'services/helpers';
import { deleteEditDraft } from 'components/PipelineList/DeployedPipelineView/store/ActionCreator';
import { DiscardDraftModal } from 'components/shared/DiscardDraftModal';
import { CommitModal } from 'components/SourceControlManagement/LocalPipelineListView/CommitModal';
import styled from 'styled-components';
import { LoadingAppLevel } from 'components/shared/LoadingAppLevel';
import Alert from 'components/shared/Alert';
import {
  pullPipeline,
  setPullStatus,
  setSourceControlMeta,
} from 'components/PipelineDetails/store/ActionCreator';
require('./PipelineDetailsActionsButton.scss');

const PREFIX = 'features.PipelineDetails.TopPanel';
const SCM_PREFIX = 'features.SourceControlManagement';

const StyledLi = styled.li`
  ${({ isLatestVersion, isBatchPipeline }) =>
    (!isLatestVersion || !isBatchPipeline) &&
    `&:hover {
      background: white !important;
      cursor: not-allowed !important;
    }
    span {
        opacity: 0.5;
    }`}
`;

/**
 * This function is to clean up properties that is not necessary for the pipeline configuration.
 * Pipeline DAG in angular is using __ui__ property to maintain positioning of the node, also
 * _backendProperties to save the properties of the plugin. In addition, angular is assigning
 * $$hashkey for each element of an array being rendered. This function will cleanup these extra properties.
 */
const sanitizeConfig = (pipeline) => {
  const pipelineClone = { ...pipeline };
  pipelineClone.config.stages.forEach((stage) => {
    const keysToSanitize = Object.keys(stage).filter((k) => k.startsWith('_') || k.startsWith('$'));
    keysToSanitize.forEach((k) => {
      delete stage[k];
    });
  });
  pipelineClone.config.stages = pipelineClone.config.stages.map((stage) => {
    return Object.assign({}, stage, {
      id: santizeStringForHTMLID(stage.name),
    });
  });

  return pipelineClone;
};

interface IPipelineDetailsActionsButtonProps {
  pipelineName: string;
  description: string;
  artifact: any;
  config: any;
  version: string;
  lifecycleManagementEditEnabled?: boolean;
  sourceControlManagementEnabled?: boolean;
  editDraftId?: string;
  isLatestVersion?: boolean;
  showCommitModal?: boolean;
  pullLoading?: boolean;
  pullStatus?: {
    alertType: string;
    message: string;
  };
}

class PipelineDetailsActionsButton extends Component<IPipelineDetailsActionsButtonProps> {
  public state = {
    showExportModal: false,
    showDeleteConfirmationModal: false,
    showPopover: false,
    showDiscardConfirmation: false,
    showCommitModal: false,
    loading: false,
    deleteErrMsg: '',
    extendedDeleteErrMsg: '',
  };

  public togglePopover = (showPopover = !this.state.showPopover) => {
    this.setState({
      showPopover,
    });
  };

  public componentWillReceiveProps(nextProps) {
    this.pipelineConfig = {
      ...this.pipelineConfig,
      config: cloneDeep(nextProps.config),
    };
  }

  public pipelineConfig = {
    name: this.props.pipelineName,
    description: this.props.description,
    artifact: this.props.artifact,
    config: cloneDeep(this.props.config), // currently doing a cloneDeep because angular is mutating this state...
    version: this.props.version,
  };

  public duplicateConfigAndNavigate = () => {
    duplicatePipeline(this.props.pipelineName, sanitizeConfig(this.pipelineConfig));
  };

  public toggleDiscardConfirmation = () => {
    this.setState({
      showDiscardConfirmation: !this.state.showDiscardConfirmation,
    });
  };

  public discardAndStartNewEdit = () => {
    this.toggleDiscardConfirmation();
    editPipeline(this.props.pipelineName);
  };

  public handlePipelineEdit = () => {
    if (!this.props.isLatestVersion || this.props.artifact.name !== 'cdap-data-pipeline') {
      return;
    }
    if (!this.props.editDraftId) {
      editPipeline(this.props.pipelineName, sanitizeConfig(this.pipelineConfig));
      return;
    }
    this.setState({
      showPopover: false,
    });
    this.toggleDiscardConfirmation();
  };

  public continueSameDraft = () => {
    const link = window.getHydratorUrl({
      stateName: 'hydrator.create',
      stateParams: {
        namespace: getCurrentNamespace(),
        draftId: this.props.editDraftId,
        isEdit: true,
      },
    });
    window.location.href = link;
  };

  public deletePipeline = () => {
    const namespace = getCurrentNamespace();
    const params = {
      namespace,
      appId: this.props.pipelineName,
    };
    const pipelinesListLink = window.getHydratorUrl({
      stateName: 'hydrator.list',
      stateParams: {
        namespace,
      },
    });

    MyAppApi.delete(params).subscribe(
      () => {
        this.setState({
          deleteErrMsg: '',
          extendedDeleteErrMsg: '',
        });
        window.location.href = pipelinesListLink;
      },
      (err) => {
        this.setState({
          deleteErrMsg: T.translate(`${PREFIX}.deleteError`),
          extendedDeleteErrMsg: err,
        });
      }
    );
  };

  public handlePipelineExport = () => {
    if (window.Cypress) {
      this.toggleExportModal();
      return;
    }
    // Unless we are running an e2e test, just export the pipeline JSON
    const closePopoverCb = () => {
      this.setState({ showPopover: false });
    };
    downloadFile(this.pipelineConfig, closePopoverCb);
  };

  public toggleExportModal = () => {
    this.setState({ showExportModal: !this.state.showExportModal });
  };

  public toggleDeleteConfirmationModal = () => {
    this.setState({
      showDeleteConfirmationModal: !this.state.showDeleteConfirmationModal,
      deleteErrMsg: '',
      extendedDeleteErrMsg: '',
    });
  };

  public toggleCommitModal = () => {
    this.setState({
      showCommitModal: !this.state.showCommitModal,
    });
  };

  public renderExportPipelineModal() {
    if (!this.state.showExportModal) {
      return null;
    }

    return (
      <PipelineExportModal
        isOpen={this.state.showExportModal}
        onClose={this.toggleExportModal}
        pipelineConfig={sanitizeConfig(this.pipelineConfig)}
        onExport={this.handlePipelineExport}
      />
    );
  }

  public getDeleteConfirmationElem = () => {
    const triggeredPipelines = TriggeredPipelineStore.getState().triggered.triggeredPipelines;
    const count = triggeredPipelines.length;

    if (count > 0) {
      const triggersText = triggeredPipelines.map((pipeline) => pipeline.application).join(', ');

      return (
        <div>
          {T.translate(`${PREFIX}.deleteConfirmation.pipeline`)}
          <strong>
            <em>{this.props.pipelineName}</em>
          </strong>
          {T.translate(`${PREFIX}.deleteConfirmation.trigger`)}
          {T.translate(`${PREFIX}.deleteConfirmation.triggerPluralCheck`, { context: count })}
          <em>{triggersText}</em>
          {T.translate(`${PREFIX}.deleteConfirmation.triggerDelete`)}
          <strong>
            <em>{this.props.pipelineName}</em>
          </strong>
          {T.translate(`${PREFIX}.deleteConfirmation.proceedPrompt`)}
        </div>
      );
    }

    return (
      <div>
        {T.translate(`${PREFIX}.deleteConfirmation.confirmPrompt`)}
        <strong>
          <em>{this.props.pipelineName}</em>
        </strong>
        ?
      </div>
    );
  };

  public renderDeleteConfirmationModal() {
    if (!this.state.showDeleteConfirmationModal) {
      return null;
    }

    return (
      <ConfirmationModal
        headerTitle={T.translate(`${PREFIX}.deleteConfirmation.title`)}
        toggleModal={this.toggleDeleteConfirmationModal}
        confirmationElem={this.getDeleteConfirmationElem()}
        confirmButtonText={T.translate(`${PREFIX}.deleteConfirmation.confirm`)}
        confirmFn={this.deletePipeline}
        cancelFn={this.toggleDeleteConfirmationModal}
        isOpen={this.state.showDeleteConfirmationModal}
        isLoading={this.state.loading}
        errorMessage={this.state.deleteErrMsg}
        extendedMessage={this.state.extendedDeleteErrMsg}
      />
    );
  }

  public renderCommitModal = () => {
    return (
      <CommitModal
        isOpen={this.state.showCommitModal}
        onToggle={this.toggleCommitModal}
        pipelineName={this.props.pipelineName}
        updateFileHash={setSourceControlMeta}
      />
    );
  };

  public handlePipelinePull = () => {
    this.togglePopover();
    pullPipeline(getCurrentNamespace(), this.props.pipelineName);
  };

  public renderPullLoadingAndStatus = () => {
    return (
      <div>
        <LoadingAppLevel
          isopen={this.props.pullLoading}
          message={T.translate(`${SCM_PREFIX}.pull.pullAppMessage`, {
            appId: this.props.pipelineName,
          }).toLocaleString()}
          style={{ width: '500px' }}
        />
        {this.props.pullStatus && (
          <Alert
            showAlert={this.props.pullStatus !== null}
            message={this.props.pullStatus.message}
            type={this.props.pullStatus.alertType}
            onClose={() => setPullStatus(null)}
          />
        )}
      </div>
    );
  };

  public render() {
    const ActionsBtnAndLabel = () => {
      return (
        <div
          className="btn pipeline-action-btn pipeline-actions-btn"
          data-testid="pipeline-actions-btn"
        >
          <div className="btn-container">
            <IconSVG name="icon-cog-empty" />
            <div className="button-label">{T.translate(`${PREFIX}.actions`)}</div>
          </div>
        </div>
      );
    };

    const editEnabled =
      this.props.isLatestVersion && this.props.artifact.name === 'cdap-data-pipeline';

    return (
      <div
        className={classnames('pipeline-action-container pipeline-actions-container', {
          active: this.state.showPopover,
        })}
      >
        <Popover
          target={ActionsBtnAndLabel}
          placement="bottom"
          bubbleEvent={false}
          enableInteractionInPopover={true}
          className="pipeline-actions-popper"
          data-testid="pipeline-actions-popper"
          showPopover={this.state.showPopover}
          onTogglePopover={this.togglePopover}
        >
          <ul>
            {this.props.lifecycleManagementEditEnabled && (
              <StyledLi
                isLatestVersion={this.props.isLatestVersion}
                isBatchPipeline={this.props.artifact.name === 'cdap-data-pipeline'}
                onClick={this.handlePipelineEdit}
                data-testid="pipeline-edit-btn"
              >
                {!this.props.isLatestVersion && (
                  <Popover
                    target={() => <span>{T.translate(`${PREFIX}.edit`)}</span>}
                    showOn="Hover"
                    placement="left"
                  >
                    {T.translate('commons.editTooltip.notLatest')}
                  </Popover>
                )}
                {this.props.artifact.name !== 'cdap-data-pipeline' && (
                  <Popover
                    target={() => <span>{T.translate(`${PREFIX}.edit`)}</span>}
                    showOn="Hover"
                    placement="left"
                  >
                    {T.translate('commons.editTooltip.notBatch')}
                  </Popover>
                )}
                {editEnabled && <span>{T.translate(`${PREFIX}.edit`)}</span>}
              </StyledLi>
            )}
            <li role="button" onClick={this.duplicateConfigAndNavigate}>
              {T.translate(`${PREFIX}.duplicate`)}
            </li>
            <li role="button" onClick={this.handlePipelineExport}>
              {T.translate(`${PREFIX}.export`)}
            </li>
            {this.props.sourceControlManagementEnabled && (
              <div>
                <hr />
                <li role="button" onClick={this.toggleCommitModal} data-testid="push-pipeline">
                  {T.translate(`${SCM_PREFIX}.push.pushButton`)}
                </li>
                <li role="button" onClick={this.handlePipelinePull} data-testid="pull-pipeline">
                  {T.translate(`${SCM_PREFIX}.pull.pullButton`)}
                </li>
              </div>
            )}
            <hr />
            <li
              role="button"
              onClick={this.toggleDeleteConfirmationModal}
              className="delete-action"
              data-testid="delete-pipeline"
            >
              {T.translate('commons.delete')}
            </li>
          </ul>
        </Popover>
        {this.renderExportPipelineModal()}
        {this.renderDeleteConfirmationModal()}
        <DiscardDraftModal
          isOpen={this.state.showDiscardConfirmation}
          toggleModal={this.toggleDiscardConfirmation}
          discardFn={deleteEditDraft.bind(
            null,
            this.props.editDraftId,
            this.discardAndStartNewEdit
          )}
          continueFn={this.continueSameDraft}
        />
        {this.renderCommitModal()}
        {this.renderPullLoadingAndStatus()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { pullLoading, pullStatus } = state;
  return {
    pullLoading,
    pullStatus,
  };
};

export default connect(mapStateToProps)(PipelineDetailsActionsButton);
