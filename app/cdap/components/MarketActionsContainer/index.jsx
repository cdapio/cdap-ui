/*
 * Copyright © 2016 Cask Data, Inc.
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
import T from 'i18n-react';
import getIcon from 'services/market-action-icon-map';
import uuidV4 from 'uuid/v4';
import classnames from 'classnames';
import AbstractWizard from 'components/AbstractWizard';
import IconSVG from 'components/shared/IconSVG';
import MarketStore from 'components/Market/store/market-store';

require('./MarketActionsContainer.scss');

export default class MarketActionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedActions: [],
      wizard: {
        actionIndex: null,
        actionType: null,
        action: null,
      },
    };
  }

  closeWizard(returnResult) {
    if (returnResult) {
      this.setState({
        completedActions: this.state.completedActions.concat([
          this.state.wizard.actionIndex,
        ]),
        wizard: {
          actionIndex: null,
          actionType: null,
          action: null,
        },
      });
      if (this.state.wizard.actionIndex === this.props.actions.length - 1) {
        if (this.props.onActionsComplete) {
          this.props.onActionsComplete();
        }
      }
      return;
    }
    this.setState({
      wizard: {
        actionIndex: null,
        actionType: null,
      },
    });
  }

  openWizard(actionIndex, actionType, action) {
    // have to do this because the type returned from the backend is the same,
    // whether this action is in an usecase or in the 'Datapacks' tab
    const usecases = [
      'load_datapack',
      'one_step_deploy_plugin',
      'one_step_deploy_app',
    ];

    const isLastStep = actionIndex === this.props.actions.length - 1;

    if (usecases.indexOf(actionType) !== -1 && !isLastStep) {
      actionType += '_usecase';
    }
    this.setState({
      wizard: {
        actionIndex,
        actionType,
        action,
      },
    });
  }

  render() {
    if (!Array.isArray(this.props.actions)) {
      return null;
    }

    return (
      <div className="market-entity-actions">
        {this.props.actions.map((action, index) => {
          const isCompletedAction =
            this.state.completedActions.indexOf(index) !== -1;
          const actionName = T.translate(
            'features.Market.action-types.' + action.type + '.name'
          );
          const actionIcon = getIcon(action.type);
          return (
            <div
              className="action-container text-center"
              key={uuidV4()}
              onClick={this.openWizard.bind(this, index, action.type, action)}
            >
              <div className="action" key={index}>
                <div className="step text-center">
                  <span
                    className={classnames('tag tag-pill', {
                      completed: isCompletedAction,
                    })}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="action-icon">
                  <div>
                    <IconSVG name={actionIcon} />
                  </div>
                </div>
                <div className="action-description" title={action.label}>
                  {action.label}
                </div>
                <button
                  className={classnames('btn btn-link', {
                    'btn-completed': isCompletedAction,
                  })}
                >
                  {actionName}
                </button>
              </div>
            </div>
          );
        })}
        <AbstractWizard
          isOpen={
            this.state.wizard.actionIndex !== null &&
            this.state.wizard.actionType !== null
          }
          onClose={this.closeWizard.bind(this)}
          wizardType={this.state.wizard.actionType}
          input={{
            action: this.state.wizard.action,
            package: this.context.entity,
            isLastStepInMarket:
              this.state.wizard.actionIndex === this.props.actions.length - 1,
          }}
          displayCTA={MarketStore.getState().displayCTA}
        />
      </div>
    );
  }
}

MarketActionsContainer.contextTypes = {
  entity: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
    label: PropTypes.string,
    author: PropTypes.string,
    description: PropTypes.string,
    org: PropTypes.string,
    created: PropTypes.number,
  }),
};

MarketActionsContainer.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      label: PropTypes.string,
      arguments: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.object,
          ]),
        })
      ),
    })
  ),
  onActionsComplete: PropTypes.func,
};
