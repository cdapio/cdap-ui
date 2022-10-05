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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import IconSVG from 'components/shared/IconSVG';
import PipelineSummary from 'components/PipelineSummary';
import { getCurrentNamespace } from 'services/NamespaceStore';
import PipelineDetailStore from 'components/PipelineDetails/store';
import { GLOBALS } from 'services/global-constants';
import T from 'i18n-react';
import { PrimaryTextLowercaseButton } from 'components/shared/Buttons/PrimaryTextLowercaseButton';

const PREFIX = 'features.PipelineDetails.TopPanel';

export default class PipelineSummaryButton extends Component {
  static propTypes = {
    pipelineType: PropTypes.string,
    pipelineName: PropTypes.string,
  };

  state = {
    showSummary: false,
  };

  constructor(props) {
    super(props);

    this.buttonRef = React.createRef();
  }

  toggleSummary = (open) => {
    this.setState({
      showSummary: open,
    });
  };

  renderSummaryButton() {
    return (
      <div
        className={classnames('btn pipeline-action-btn pipeline-summary-btn', {
          'btn-select': this.state.showSummary,
        })}
        ref={this.buttonRef}
      >
        <PrimaryTextLowercaseButton onClick={() => this.toggleSummary(true)}>
          <div className="btn-container">
            <IconSVG name="icon-line-chart" className="summary-icon" />
            <div className="button-label">{T.translate(`${PREFIX}.summary`)}</div>
          </div>
        </PrimaryTextLowercaseButton>
      </div>
    );
  }

  render() {
    let pipelineType = this.props.pipelineType;
    let programType = GLOBALS.programType[pipelineType];
    let programId = GLOBALS.programId[pipelineType];

    return (
      <div
        className={classnames('pipeline-action-container pipeline-summary-container', {
          active: this.state.showSummary,
        })}
      >
        {this.renderSummaryButton()}
        {this.state.showSummary && (
          <PipelineSummary
            pipelineType={pipelineType}
            namespaceId={getCurrentNamespace()}
            appId={this.props.pipelineName}
            programType={programType}
            programId={programId}
            pipelineConfig={PipelineDetailStore.getState()}
            totalRunsCount={PipelineDetailStore.getState().runs.length}
            onClose={this.toggleSummary.bind(this, false)}
            anchorEl={this.buttonRef.current}
            open={this.state.showSummary}
          />
        )}
      </div>
    );
  }
}
