/*
 * Copyright © 2016-2017 Cask Data, Inc.
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
import T from 'i18n-react';
require('./EntityCardHeader.scss');
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { getType } from 'services/metadata-parser';

export default class EntityCardHeader extends Component {
  constructor(props) {
    super(props);
  }

  getEntityType() {
    return getType(this.props.entity);
  }

  render() {
    return (
      <div className="card-header-wrapper">
        {!isEmpty(this.props.successMessage) ? (
          <div className="entity-card-header success-message">
            <div>
              <span>{this.props.successMessage}</span>
            </div>
          </div>
        ) : (
          <div
            onClick={this.props.onClick}
            className={classnames('entity-card-header', this.props.className)}
          >
            <div>
              <IconSVG name={this.props.entity.icon} className="entity-icon" />
              <span className="entity-type">
                {T.translate(`commons.entity.${this.getEntityType()}.singular`)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

EntityCardHeader.propTypes = {
  entity: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  successMessage: PropTypes.string,
};
