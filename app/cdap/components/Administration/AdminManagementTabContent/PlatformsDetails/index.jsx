/*
 * Copyright © 2017-2018 Cask Data, Inc.
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
import GenericDetails from 'components/Administration/AdminManagementTabContent/PlatformsDetails/Genericdetails';
import LoadingSVG from 'components/shared/LoadingSVG';

require('./PlatformDetails.scss');

export default class PlatformsDetails extends Component {
  static propTypes = {
    platformDetails: PropTypes.object,
  };

  static defaultProps = {
    platformDetails: {},
  };

  state = {
    platformDetails: this.props.platformDetails,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      platformDetails: nextProps.platformDetails,
    });
  }

  render() {
    if (!Object.keys(this.state.platformDetails).length) {
      return (
        <div className="platform-details loading">
          <LoadingSVG />
        </div>
      );
    }

    return (
      <div className="platform-details">
        <div className="platform-header">
          <strong>
            {T.translate('features.Administration.systemMetrics')}
          </strong>
        </div>
        <div className="platform-content">
          <GenericDetails details={this.state.platformDetails} />
        </div>
      </div>
    );
  }
}
