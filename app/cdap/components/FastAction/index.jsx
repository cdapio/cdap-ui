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
import DeleteAction from 'components/FastAction/DeleteAction';
import TruncateAction from 'components/FastAction/TruncateAction';
import StartStopAction from 'components/FastAction/StartStopAction';
import SetPreferenceAction from 'components/FastAction/SetPreferenceAction';
import LogAction from 'components/FastAction/LogAction';
import { objectQuery } from 'services/helpers';

export default class FastAction extends Component {
  constructor(props) {
    super(props);
  }

  // This function is using switch statement because just using const mapping,
  // react already creating virtual DOM element for it, so it was failing the
  // Props validation.
  renderFastAction(type) {
    switch (type) {
      case 'delete':
        return (
          <DeleteAction
            entity={this.props.entity}
            onSuccess={this.props.onSuccess}
            argsToAction={objectQuery(this.props.argsToAction)}
          />
        );
      case 'truncate':
        return (
          <TruncateAction
            entity={this.props.entity}
            onSuccess={this.props.onSuccess}
            argsToAction={objectQuery(this.props.argsToAction)}
          />
        );
      case 'startStop':
        return (
          <StartStopAction
            entity={this.props.entity}
            onSuccess={this.props.onSuccess}
            argsToAction={objectQuery(this.props.argsToAction)}
          />
        );
      case 'setPreferences':
        return (
          <SetPreferenceAction
            entity={this.props.entity}
            onSuccess={this.props.onSuccess}
            argsToAction={objectQuery(this.props.argsToAction)}
          />
        );
      case 'log':
        return (
          <LogAction
            entity={this.props.entity}
            argsToAction={objectQuery(this.props.argsToAction)}
          />
        );
      default:
        return null;
    }
  }

  render() {
    return this.renderFastAction(this.props.type);
  }
}

FastAction.propTypes = {
  type: PropTypes.oneOf([
    'delete',
    'truncate',
    'startStop',
    'explore',
    'setPreferences',
    'log',
  ]),
  entity: PropTypes.object,
  onSuccess: PropTypes.func,
  opened: PropTypes.bool,
  argsToAction: PropTypes.object,
};
