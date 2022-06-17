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

import React, { Component } from 'react';
import IconSVG from 'components/shared/IconSVG';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { MyArtifactApi } from 'api/artifact';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { preventPropagation } from 'services/helpers';
import { MyPipelineApi } from 'api/pipeline';
import ConfigurationGroup from 'components/shared/ConfigurationGroup';
import { WizardNav } from './WizardNav';

const MATERIAL_UI_Z_INDEX = 1300;

interface IPostRunActionsWizardProps {
  action?: any;
  mode?: string;
  isOpen: boolean;
  toggleModal: () => void;
  artifact?: object;
  isDeployed?: boolean;
  actionCreator?: any;
  getPostActions?: () => any[];
  validatePluginProperties?: (action: any, errorCb: any) => void;
}

export default class PostRunActionsWizard extends Component<IPostRunActionsWizardProps> {
  public state = {
    widgetJson: {},
    action: this.props.action,
    showValidateButton: false,
    errorCount: null,
    propertyErrors: null,
    isValidating: false,
  };

  public setShowValidateButton = (show) => {
    this.setState((prevState) => {
      return { ...prevState, showValidateButton: show };
    });
  };

  public onValidateStart = () => {
    this.setState((prevState) => {
      return { ...prevState, isValidating: true };
    });
  };

  public validateCallback = (errorCount, propertyErrors) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        errorCount,
        propertyErrors,
        isValidating: false,
      };
    });
  };

  public validatePluginProperties = () => {
    this.onValidateStart();
    const errorCb = ({ errorCount, propertyErrors }) => {
      this.validateCallback(errorCount, propertyErrors);
    };
    this.props.validatePluginProperties(this.state.action, errorCb);
  };

  public setActionHandler = (action) => {
    this.setState((prevState) => {
      return { ...prevState, action };
    });
  };

  public componentDidMount() {
    this.pluginFetch(this.props.action);
  }

  // Fetching Backend Properties
  public pluginFetch(action) {
    if (action) {
      const { name, version, scope } = action.plugin.artifact;
      const params = {
        namespace: getCurrentNamespace(),
        artifactId: name,
        version,
        scope,
        extensionType: action.plugin.type,
        pluginName: action.plugin.name,
      };

      MyArtifactApi.fetchPluginDetails(params).subscribe((res) => {
        this.props.action._backendProperties = res[0].properties;
        this.fetchWidgets(action);
      });
    }
  }

  // Fetching Widget JSON for the plugin
  public fetchWidgets(action) {
    const { name, version, scope } = action.plugin.artifact;
    const widgetKey = `widgets.${action.plugin.name}-${action.plugin.type}`;
    const widgetParams = {
      namespace: getCurrentNamespace(),
      artifactName: name,
      scope,
      artifactVersion: version,
      keys: widgetKey,
    };
    MyPipelineApi.fetchWidgetJson(widgetParams).subscribe((res) => {
      try {
        const parsedWidget = JSON.parse(res[widgetKey]);
        this.setState((prevState) => {
          return {
            ...prevState,
            widgetJson: parsedWidget,
          };
        });
      } catch (e) {
        // tslint:disable-next-line: no-console
        console.log(`Cannot parse widget JSON for ${action.plugin.name}`, e);
      }
    });
  }

  public toggleAndPreventPropagation = (e = null) => {
    this.props.toggleModal();
    if (e) {
      preventPropagation(e);
    } else {
      preventPropagation();
    }
  };

  public renderBody = () => {
    return (
      <ConfigurationGroup
        values={this.props.action.plugin.properties}
        pluginProperties={this.props.action._backendProperties}
        widgetJson={this.state.widgetJson}
        disabled={true}
      />
    );
  };

  public render() {
    const action = this.state.action;
    const currentStage = 1;
    if (!this.props.isDeployed) {
      return (
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.toggleAndPreventPropagation}
          backdrop="static"
          modalClassName="post-run-actions-modal hydrator-modal node-config-modal"
          zIndex={MATERIAL_UI_Z_INDEX + 1} // Workaround for material-ui PipelineModeless
        >
          <div className="modal-header clearfix">
            {action ? (
              <h5 className="modal-title pull-left">
                <span>{action.plugin.name || action.name}</span>
                <small className="plugin-version">
                  {action.version || action.plugin.artifact.version}
                </small>
                <p>
                  <small>{action.description}</small>
                </p>
              </h5>
            ) : (
              <h4 className="modal-title pull-left">Alerts</h4>
            )}
            {this.state.errorCount === 0 && <span className="text-success">No errors found.</span>}
            {this.state.errorCount === 1 && <span className="text-danger">1 error found</span>}
            {this.state.errorCount > 1 && (
              <span className="text-danger">{this.state.errorCount} errors found</span>
            )}
            <div className="btn-group pull-right">
              {this.state.showValidateButton && (
                <button
                  className="btn btn-primary validate-btn"
                  data-cy="validate-btn"
                  type="button"
                  onClick={this.validatePluginProperties}
                >
                  {this.state.isValidating ? (
                    <span>
                      <IconSVG name="icon-spinner" className="fa-spin" />
                    </span>
                  ) : (
                    <span>Validate</span>
                  )}
                </button>
              )}
              <a role="button" className="btn" onClick={this.toggleAndPreventPropagation}>
                <IconSVG name="icon-close" />
              </a>
            </div>
          </div>
          <ModalBody>
            {action && this.props.mode === 'edit' ? (
              <WizardNav
                mode={this.props.mode}
                action={this.props.action}
                currentStage={currentStage}
                artifact={this.props.artifact}
                setAction={this.setActionHandler}
                actionCreator={this.props.actionCreator}
                toggle={this.toggleAndPreventPropagation}
                getPostActions={this.props.getPostActions}
                setShowValidateButton={this.setShowValidateButton}
                propertyErrors={this.state.propertyErrors}
                validatePluginProperties={this.props.validatePluginProperties}
                validateCallback={this.validateCallback}
                onValidateStart={this.onValidateStart}
              />
            ) : null}
            {action && this.props.mode === 'view' ? (
              <div className="postrun-configuration-content">{this.renderBody()}</div>
            ) : null}
            {this.props.mode === 'create' ? (
              <WizardNav
                mode={this.props.mode}
                currentStage={currentStage}
                artifact={this.props.artifact}
                setAction={this.setActionHandler}
                actionCreator={this.props.actionCreator}
                toggle={this.toggleAndPreventPropagation}
                getPostActions={this.props.getPostActions}
                setShowValidateButton={this.setShowValidateButton}
                propertyErrors={this.state.propertyErrors}
                validatePluginProperties={this.props.validatePluginProperties}
                validateCallback={this.validateCallback}
                onValidateStart={this.onValidateStart}
              />
            ) : null}
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-blue float-right close-button"
              onClick={this.toggleAndPreventPropagation}
            >
              Close
            </button>
          </ModalFooter>
        </Modal>
      );
    }

    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.toggleAndPreventPropagation}
        backdrop="static"
        modalClassName="post-run-actions-modal hydrator-modal node-config-modal"
        zIndex={MATERIAL_UI_Z_INDEX + 1} // Workaround for material-ui PipelineModeless
      >
        {/* Not using <ModalHeader> here because it wraps the entire header in an h4 */}
        <div className="modal-header">
          <h4 className="modal-title float-left">
            <span>{action.plugin.name || action.name}</span>
            <small className="plugin-version">
              {action.version || action.plugin.artifact.version}
            </small>
            <p>
              <small>{action.description}</small>
            </p>
          </h4>
          <div className="btn-group float-right">
            <a role="button" className="btn" onClick={this.toggleAndPreventPropagation}>
              <IconSVG name="icon-close" />
            </a>
          </div>
        </div>
        <ModalBody>
          <div className="postrun-configuration-content">{this.renderBody()}</div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-blue float-right close-button"
            onClick={this.toggleAndPreventPropagation}
          >
            Close
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}
