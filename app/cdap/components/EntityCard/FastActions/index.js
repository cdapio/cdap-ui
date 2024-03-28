/*
 * Copyright © 2016-2018 Cask Data, Inc.
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
import FastAction from 'components/FastAction';
import { objectQuery } from 'services/helpers';
import isNil from 'lodash/isNil';
import { getDataTestid } from '../../../testids/TestidsProvider';

const TESTID_PREFIX = 'features.entityListView.entity.fastActions';

export default class FastActions extends Component {
  constructor(props) {
    super(props);
  }

  listOfFastActions() {
    let fastActionTypes = [];

    switch (this.props.entity.type) {
      case 'artifact':
        fastActionTypes = ['delete'];
        break;
      case 'application':
        fastActionTypes = ['setPreferences', 'delete'];
        break;
      case 'dataset':
        fastActionTypes = ['truncate', 'delete', 'explore'];
        break;
      case 'program':
        fastActionTypes = ['setPreferences', 'startStop', 'log'];
        break;
    }

    return fastActionTypes;
  }

  onSuccess(action) {
    if (action === 'startStop') {
      return;
    }

    if (action === 'setPreferences') {
      if (this.props.onSuccess) {
        this.props.onSuccess();
      }
    }
    if (action === 'delete') {
      if (this.props.onSuccess) {
        this.props.onSuccess(action);
      }
    }
    if (this.props.onUpdate) {
      this.props.onUpdate(action);
    }
  }

  render() {
    const fastActions = this.listOfFastActions();
    let className = this.props.className || 'text-center';
    return (
      <h4 className={className}>
        {fastActions.map((action) => {
          if (this.props.actionToOpen && this.props.actionToOpen === action) {
            return (
              <FastAction
                key={action}
                type={action}
                entity={this.props.entity}
                opened={true}
                onSuccess={this.onSuccess.bind(this, action)}
                argsToAction={
                  isNil(objectQuery(this.props.argsToActions, action))
                    ? {}
                    : this.props.argsToActions[action]
                }
                dataTestId={getDataTestid(`${TESTID_PREFIX}.${action}`)}
              />
            );
          } else {
            return (
              <FastAction
                key={action}
                type={action}
                entity={this.props.entity}
                onSuccess={this.onSuccess.bind(this, action)}
                argsToAction={
                  isNil(objectQuery(this.props.argsToActions, action))
                    ? {}
                    : this.props.argsToActions[action]
                }
                dataTestId={getDataTestid(`${TESTID_PREFIX}.${action}`)}
              />
            );
          }
        })}
      </h4>
    );
  }
}

FastActions.propTypes = {
  entity: PropTypes.object,
  onUpdate: PropTypes.func,
  className: PropTypes.string,
  onSuccess: PropTypes.func,
  actionToOpen: PropTypes.string,
  argsToActions: PropTypes.shape({
    delete: PropTypes.object,
    setPreferences: PropTypes.object,
    truncate: PropTypes.object,
    explore: PropTypes.object,
    sendEvents: PropTypes.object,
    viewEvents: PropTypes.object,
    startStop: PropTypes.object,
    log: PropTypes.object,
  }),
};
