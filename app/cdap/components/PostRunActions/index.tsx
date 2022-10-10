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
import styled from 'styled-components';
import PostRunActionsWizard from 'components/PostRunActions/PostRunActionsWizard';
import PipelineConfigurationsStore, {
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import IconSVG from 'components/shared/IconSVG';

require('./PostRunActions.scss');

interface IPostRunActionsProps {
  actions: any[];
  isDeployed?: boolean;
  artifact?: object;
  actionCreator?: any;
  getPostActions?: () => any[];
  validatePluginProperties?: (action: any, errorCb: any) => void;
}

const AddAlerts = styled.div`
  cursor: pointer;
  padding: 0;
  background: #ebebeb;
  border-radius: 0;
  background: transparent;
  border: 2px dashed #b1b1b1;
  margin: 10px;
  text-align: center !important;
`;

const AlertTableTitle = styled.h2`
  color: #5f6674;
  font-size: 20px;
  font-weight: 300;
`;

export default class PostRunActions extends Component<IPostRunActionsProps> {
  public state = {
    activeActionWizard: null,
    mode: null,
    // TODO: studio pipeline needs a different store to get actions
    actions: this.props.isDeployed ? this.props.actions : this.props.getPostActions(),
  };

  public setActiveActionWizard = (action = null, mode = null) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        activeActionWizard: action,
        mode,
      };
    });
    if (!this.props.isDeployed) {
      // only do this in studio
      this.getPostActions();
    }
  };

  public getPostActions = () => {
    const actions = this.props.getPostActions();
    this.setState((prevState) => {
      return {
        ...prevState,
        actions,
      };
    });
  };

  public deletePostRunAction = (action) => {
    PipelineConfigurationsStore.dispatch({
      type: PipelineConfigurationsActions.DELETE_POST_ACTION,
      payload: {
        deletedAction: action,
      },
    });
    this.props.actionCreator.deletePostAction(action);
    this.getPostActions();
  };

  public render() {
    if (!this.props.isDeployed) {
      return (
        <>
          {this.state.actions.length > 0 && (
            <div data-cy="saved-alerts">
              <AlertTableTitle>Saved Alerts</AlertTableTitle>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Alert</th>
                    <th>Event</th>
                    <th />
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.state.actions.map((action) => {
                    return (
                      <tr>
                        <td>{action.plugin.name}</td>
                        <td>{action.plugin.properties.runCondition}</td>
                        <td className="text-center">
                          <a
                            role="button"
                            onClick={() => {
                              this.setActiveActionWizard(action, 'edit');
                            }}
                          >
                            <CreateOutlinedIcon />
                          </a>
                        </td>
                        <td className="text-center">
                          <a
                            role="button"
                            onClick={() => {
                              this.deletePostRunAction(action);
                            }}
                          >
                            <IconSVG name="icon-trash" className="text-danger" />
                          </a>
                        </td>
                        <td className="text-center">
                          <a
                            role="button"
                            data-cy="action-view"
                            onClick={() => {
                              this.setActiveActionWizard(action, 'view');
                            }}
                          >
                            <IconSVG name="icon-eye" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <AddAlerts data-cy="post-run-alerts-create">
            <h1
              onClick={() => {
                this.setActiveActionWizard(null, 'create');
              }}
            >
              +
            </h1>
          </AddAlerts>
          {this.state.activeActionWizard || this.state.mode ? (
            <PostRunActionsWizard
              action={this.state.activeActionWizard}
              isOpen={this.state.activeActionWizard !== null || this.state.mode !== null}
              mode={this.state.mode}
              toggleModal={this.setActiveActionWizard}
              artifact={this.props.artifact}
              isDeployed={this.props.isDeployed}
              actionCreator={this.props.actionCreator}
              getPostActions={this.props.getPostActions}
              validatePluginProperties={this.props.validatePluginProperties}
            />
          ) : null}
        </>
      );
    }
    if (!this.props.actions.length) {
      return (
        <div className="post-run-actions-table well well-sm text-center empty-table disabled">
          <h2>No alerts configured for this pipeline</h2>
        </div>
      );
    }

    return (
      <div className="post-run-actions-table">
        <h2>Saved Alerts</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Alert</th>
              <th>Event</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.actions.map((action) => {
              return (
                <tr>
                  <td>{action.plugin.name}</td>
                  <td>{action.plugin.properties.runCondition}</td>
                  <td className="text-center">
                    <a
                      role="button"
                      data-cy="action-view"
                      onClick={this.setActiveActionWizard.bind(this, action)}
                    >
                      View
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.state.activeActionWizard !== null ? (
          <PostRunActionsWizard
            action={this.state.activeActionWizard}
            isOpen={this.state.activeActionWizard !== null}
            toggleModal={this.setActiveActionWizard}
            isDeployed={this.props.isDeployed}
          />
        ) : null}
      </div>
    );
  }
}
