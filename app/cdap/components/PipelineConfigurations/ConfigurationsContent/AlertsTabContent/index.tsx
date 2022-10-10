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
import PropTypes from 'prop-types';
import PostRunActions from 'components/PostRunActions';
import PipelineConfigurationsStore from 'components/PipelineConfigurations/Store';
import T from 'i18n-react';

require('./AlertsTabContent.scss');

const PREFIX = 'features.PipelineConfigurations.Alerts';

interface IAlertsTabContentProps {
  isDeployed?: boolean;
  artifact?: object;
  actionCreator?: any;
  getPostActions?: () => any[];
  validatePluginProperties?: (action: any, errorCb: any) => void;
}

export default class AlertsTabContent extends Component<IAlertsTabContentProps> {
  public static defaultProps = {
    isDeployed: true,
  };

  public render() {
    const postActions = PipelineConfigurationsStore.getState().postActions;
    return (
      <div
        id="alerts-tab-content"
        className="configuration-step-content configuration-content-container"
      >
        <div className="step-content-heading">{T.translate(`${PREFIX}.contentHeading`)}</div>
        <PostRunActions
          actions={postActions}
          isDeployed={this.props.isDeployed}
          artifact={this.props.artifact}
          actionCreator={this.props.actionCreator}
          getPostActions={this.props.getPostActions}
          validatePluginProperties={this.props.validatePluginProperties}
        />
      </div>
    );
  }
}
