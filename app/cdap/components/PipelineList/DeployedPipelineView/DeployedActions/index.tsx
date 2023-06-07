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

import * as React from 'react';
import {
  deleteEditDraft,
  deletePipeline,
  pullPipeline,
  setPullStatus,
} from 'components/PipelineList/DeployedPipelineView/store/ActionCreator';
import { Actions } from 'components/PipelineList/DeployedPipelineView/store';
import { IPipeline } from 'components/PipelineList/DeployedPipelineView/types';
import ActionsPopover, { IAction } from 'components/shared/ActionsPopover';
import { duplicatePipeline, editPipeline, getPipelineConfig } from 'services/PipelineUtils';
import PipelineExportModal from 'components/PipelineExportModal';
import ConfirmationModal from 'components/shared/ConfirmationModal';
import { connect } from 'react-redux';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyScheduleApi } from 'api/schedule';
import { GLOBALS } from 'services/global-constants';
import T from 'i18n-react';
import downloadFile from 'services/download-file';
import { DiscardDraftModal } from 'components/shared/DiscardDraftModal';
import { CommitModal } from 'components/SourceControlManagement/LocalPipelineListView/CommitModal';
import { LoadingAppLevel } from 'components/shared/LoadingAppLevel';
import Alert from 'components/shared/Alert';
const PREFIX = 'features.PipelineList.DeleteConfirmation';
const SCM_PREFIX = 'features.SourceControlManagement';

interface IProps {
  pipeline: IPipeline;
  deleteError?: string;
  clearDeleteError: () => void;
  refetch: () => void;
  lifecycleManagementEditEnabled?: boolean;
  sourceControlManagementEnabled?: boolean;
  draftId: string;
  pullLoading: boolean;
  pullStatus: {
    alertType: string;
    message: string;
  };
}

interface ITriggeredPipeline {
  application: string;
}

interface IState {
  showExport: boolean;
  showDeleteConfirmation: boolean;
  triggeredPipelines: ITriggeredPipeline[];
  showPopover?: boolean;
  showDiscardConfirmation: boolean;
  showCommitModal: boolean;
}

class DeployedActionsView extends React.PureComponent<IProps, IState> {
  public state = {
    showExport: false,
    showDeleteConfirmation: false,
    triggeredPipelines: [],
    showPopover: false,
    showDiscardConfirmation: false,
    showCommitModal: false,
  };

  private pipelineConfig = {};

  private handleClick = (e) => {
    e.preventDefault();
  };

  private togglePopover = () => {
    this.setState({ showPopover: !this.state.showPopover });
  };

  private handlePipelineExport = () => {
    getPipelineConfig(this.props.pipeline.name).subscribe((pipelineConfig) => {
      this.pipelineConfig = pipelineConfig;

      if (window.Cypress) {
        this.showExportModal();
        return;
      }

      const postExportCb = () => {
        this.pipelineConfig = {};
        this.setState({ showPopover: false });
      };
      // Unless we are running an e2e test, just export the pipeline JSON
      downloadFile(pipelineConfig, postExportCb);
    });
  };

  private showExportModal = () => {
    this.setState({
      showExport: true,
      showPopover: false,
    });
  };

  private closeExportModal = () => {
    this.pipelineConfig = {};

    this.setState({
      showExport: false,
    });
  };

  private renderConfirmationBody = () => {
    const triggered = this.state.triggeredPipelines;

    if (triggered.length > 0) {
      const triggersText = this.state.triggeredPipelines
        .map((pipeline) => pipeline.application)
        .join(', ');

      return (
        <div>
          {T.translate(`${PREFIX}.pipeline`)}
          <strong>
            <em>{this.props.pipeline.name}</em>
          </strong>
          {T.translate(`${PREFIX}.trigger`)}
          {T.translate(`${PREFIX}.triggerPluralCheck`, {
            context: triggered.length,
          })}
          <em>{triggersText}</em>
          {T.translate(`${PREFIX}.triggerDelete`)}
          <strong>
            <em>{this.props.pipeline.name}</em>
          </strong>
          {T.translate(`${PREFIX}.proceedPrompt`)}
        </div>
      );
    }

    return (
      <div>
        {T.translate(`${PREFIX}.confirmPrompt`)}
        <strong>
          <em>{this.props.pipeline.name}</em>
        </strong>
        ?
      </div>
    );
  };

  private renderDeleteConfirmation = () => {
    if (!this.state.showDeleteConfirmation) {
      return null;
    }

    return (
      <ConfirmationModal
        headerTitle={T.translate(`${PREFIX}.title`)}
        toggleModal={this.toggleDeleteConfirmation}
        confirmationElem={this.renderConfirmationBody()}
        confirmButtonText={T.translate(`${PREFIX}.confirm`)}
        confirmFn={deletePipeline.bind(null, this.props.pipeline, this.props.refetch)}
        cancelFn={this.toggleDeleteConfirmation}
        isOpen={this.state.showDeleteConfirmation}
        errorMessage={!this.props.deleteError ? '' : T.translate(`${PREFIX}.deleteError`)}
        extendedMessage={this.props.deleteError}
      />
    );
  };

  /**
   * If the pipeline is a batch pipeline, we have to fetch the list of schedules first. Otherwise
   * just show the confirmation modal.
   */
  private showDeleteConfirmation = () => {
    const pipeline = this.props.pipeline;

    if (pipeline.artifact.name !== GLOBALS.etlDataPipeline) {
      this.setState({
        showDeleteConfirmation: true,
        triggeredPipelines: [],
        showPopover: false,
      });
      return;
    }

    const namespace = getCurrentNamespace();
    const params = {
      namespace,
      'trigger-namespace-id': namespace,
      'trigger-program-type': 'workflows',
      'trigger-app-name': this.props.pipeline.name,
      'trigger-program-name': 'DataPipelineWorkflow',
      'schedule-status': 'SCHEDULED',
    };

    MyScheduleApi.getTriggeredList(params).subscribe((res) => {
      this.setState({
        showDeleteConfirmation: true,
        triggeredPipelines: res,
        showPopover: false,
      });
    });
  };

  private toggleDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmation: !this.state.showDeleteConfirmation,
      triggeredPipelines: [],
    });

    if (!this.state.showDeleteConfirmation) {
      this.props.clearDeleteError();
    }
  };

  private toggleDiscardConfirmation = () => {
    this.setState({
      showDiscardConfirmation: !this.state.showDiscardConfirmation,
    });
  };

  private toggleCommitModal = () => {
    this.setState({
      showCommitModal: !this.state.showCommitModal,
    });
  };

  private renderCommitModal = () => {
    return (
      <CommitModal
        isOpen={this.state.showCommitModal}
        onToggle={this.toggleCommitModal}
        pipelineName={this.props.pipeline.name}
      />
    );
  };

  private discardAndStartNewEdit = () => {
    this.toggleDiscardConfirmation();
    editPipeline(this.props.pipeline.name);
  };

  private handlePipelineEdit = () => {
    if (!this.props.draftId) {
      editPipeline(this.props.pipeline.name);
      return;
    }
    this.setState({
      showPopover: false,
    });
    this.toggleDiscardConfirmation();
  };

  private handlePipelinePull = () => {
    this.togglePopover();
    pullPipeline(getCurrentNamespace(), this.props.pipeline.name);
  };

  private continueSameDraft = () => {
    const link = window.getHydratorUrl({
      stateName: 'hydrator.create',
      stateParams: {
        namespace: getCurrentNamespace(),
        draftId: this.props.draftId,
        isEdit: true,
      },
    });
    window.location.href = link;
  };

  private getActionsList = () => {
    const actions: IAction[] = [
      {
        label: T.translate('commons.duplicate'),
        actionFn: duplicatePipeline.bind(null, this.props.pipeline.name),
      },
      {
        label: T.translate('commons.export'),
        actionFn: this.handlePipelineExport,
      },
      {
        label: 'separator',
      },
      {
        label: T.translate('commons.delete'),
        actionFn: this.showDeleteConfirmation,
        className: 'delete',
      },
    ];
    if (this.props.sourceControlManagementEnabled) {
      // insert after export
      actions.splice(2, 0, {
        label: 'separator',
      });
      actions.splice(3, 0, {
        label: T.translate(`${SCM_PREFIX}.push.pushButton`),
        actionFn: this.toggleCommitModal,
      });
      actions.splice(4, 0, {
        label: T.translate(`${SCM_PREFIX}.pull.pullButton`),
        actionFn: this.handlePipelinePull,
      });
    }
    if (this.props.lifecycleManagementEditEnabled) {
      actions.splice(0, 0, {
        label: T.translate('commons.edit'),
        actionFn: this.handlePipelineEdit,
        disabled: this.props.pipeline.artifact.name !== 'cdap-data-pipeline',
        disabledTooltip: T.translate('commons.editTooltip.notBatch').toString(),
      });
    }
    return actions;
  };

  private actions: IAction[] = this.getActionsList();

  public renderPullLoadingAndStatus = () => {
    return (
      <div>
        <LoadingAppLevel
          isopen={this.props.pullLoading}
          message={T.translate(`${SCM_PREFIX}.pull.pullAppMessage`, {
            appId: this.props.pipeline.name,
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
    return (
      <div className="action">
        <span onClick={this.handleClick}>
          <ActionsPopover
            actions={this.actions}
            showPopover={this.state.showPopover}
            togglePopover={this.togglePopover}
          />
        </span>

        <PipelineExportModal
          isOpen={this.state.showExport}
          onClose={this.closeExportModal}
          pipelineConfig={this.pipelineConfig}
          onExport={this.handlePipelineExport}
        />

        {this.renderDeleteConfirmation()}
        <DiscardDraftModal
          isOpen={this.state.showDiscardConfirmation}
          toggleModal={this.toggleDiscardConfirmation}
          discardFn={deleteEditDraft.bind(null, this.props.draftId, this.discardAndStartNewEdit)}
          continueFn={this.continueSameDraft}
        />
        {this.renderCommitModal()}
        {this.renderPullLoadingAndStatus()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProp) => {
  return {
    deleteError: state.deployed.deleteError,
    pipeline: ownProp.pipeline,
    pullLoading: state.deployed.pullLoading,
    pullStatus: state.deployed.pullStatus,
  };
};

const mapDispatch = (dispatch) => {
  return {
    clearDeleteError: () => {
      dispatch({
        type: Actions.clearDeleteError,
      });
    },
  };
};

const DeployedActions = connect(mapStateToProps, mapDispatch)(DeployedActionsView);

export default DeployedActions;
