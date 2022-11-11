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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
require('./PipelineDetailsActionsButton.scss');

const PREFIX = 'features.PipelineDetails.TopPanel';

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

export default class PipelineDetailsActionsButton extends Component {
  static propTypes = {
    pipelineName: PropTypes.string,
    description: PropTypes.string,
    artifact: PropTypes.object,
    config: PropTypes.object,
    version: PropTypes.string,
    lifecycleManagementEditEnabled: PropTypes.bool,
    editDraftId: PropTypes.string,
  };

  state = {
    showExportModal: false,
    showDeleteConfirmationModal: false,
    showPopover: false,
    showDiscardConfirmation: false,
  };

  togglePopover = (showPopover = !this.state.showPopover) => {
    this.setState({
      showPopover,
    });
  };

  componentWillReceiveProps(nextProps) {
    this.pipelineConfig = {
      ...this.pipelineConfig,
      config: cloneDeep(nextProps.config),
    };
  }

  pipelineConfig = {
    name: this.props.pipelineName,
    description: this.props.description,
    artifact: this.props.artifact,
    config: cloneDeep(this.props.config), // currently doing a cloneDeep because angular is mutating this state...
    version: this.props.version,
  };

  duplicateConfigAndNavigate = () => {
    duplicatePipeline(this.props.pipelineName, sanitizeConfig(this.pipelineConfig));
  };

  toggleDiscardConfirmation = () => {
    this.setState({
      showDiscardConfirmation: !this.state.showDiscardConfirmation,
    });
  };

  discardAndStartNewEdit = () => {
    this.toggleDiscardConfirmation();
    editPipeline(this.props.pipelineName);
  };

  handlePipelineEdit = () => {
    if (!this.props.editDraftId) {
      editPipeline(this.props.pipelineName, sanitizeConfig(this.pipelineConfig));
      return;
    }
    this.setState({
      showPopover: false,
    });
    this.toggleDiscardConfirmation();
  };

  continueSameDraft = () => {
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

  deletePipeline = () => {
    let namespace = getCurrentNamespace();
    let params = {
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

  handlePipelineExport = () => {
    if (window.Cypress) {
      this.showExportModal();
      return;
    }
    // Unless we are running an e2e test, just export the pipeline JSON
    const closePopoverCb = () => {
      this.setState({ showPopover: false });
    };
    downloadFile(this.pipelineConfig, closePopoverCb);
  };

  toggleExportModal = () => {
    this.setState({ showExportModal: !this.state.showExportModal });
  };

  toggleDeleteConfirmationModal = () => {
    this.setState({
      showDeleteConfirmationModal: !this.state.showDeleteConfirmationModal,
      deleteErrMsg: '',
      extendedDeleteErrMsg: '',
    });
  };

  renderExportPipelineModal() {
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

  getDeleteConfirmationElem = () => {
    let triggeredPipelines = TriggeredPipelineStore.getState().triggered.triggeredPipelines;
    let count = triggeredPipelines.length;

    if (count > 0) {
      let triggersText = triggeredPipelines.map((pipeline) => pipeline.application).join(', ');

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

  renderDeleteConfirmationModal() {
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

  render() {
    const ActionsBtnAndLabel = () => {
      return (
        <div className="btn pipeline-action-btn pipeline-actions-btn" onClick={this.togglePopover}>
          <div className="btn-container">
            <IconSVG name="icon-cog-empty" />
            <div className="button-label">{T.translate(`${PREFIX}.actions`)}</div>
          </div>
        </div>
      );
    };

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
              <li onClick={this.handlePipelineEdit}>{T.translate(`${PREFIX}.edit`)}</li>
            )}
            <li onClick={this.duplicateConfigAndNavigate}>{T.translate(`${PREFIX}.duplicate`)}</li>
            <li onClick={this.handlePipelineExport}>{T.translate(`${PREFIX}.export`)}</li>
            <hr />
            <li
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
      </div>
    );
  }
}
