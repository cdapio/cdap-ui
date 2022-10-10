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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconSVG from 'components/shared/IconSVG';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import classnames from 'classnames';
import { Provider } from 'react-redux';
import PipelineConfigurationsStore from 'components/PipelineConfigurations/Store';
import RuntimeArgsModeless from 'components/PipelineDetails/PipelineRuntimeArgsDropdownBtn/RuntimeArgsModeless/index.tsx';
import { fetchAndUpdateRuntimeArgs } from 'components/PipelineConfigurations/Store/ActionCreator';
import ThemeWrapper from 'components/ThemeWrapper';

require('./PipelineRuntimeArgsDropdownBtn.scss');

export default class PipelineRuntimeArgsDropdownBtn extends Component {
  static propTypes = {
    showRunOptions: PropTypes.bool,
    onToggle: PropTypes.fun,
    disabled: PropTypes.bool,
    isLatestVersion: PropTypes.bool,
  };

  static defaultProps = {
    showRunOptions: false,
  };

  state = {
    showRunOptions: this.props.showRunOptions,
  };

  constructor(props) {
    super(props);
    this.dropdownButtonRef = React.createRef();
  }

  toggleRunConfigOption = (open) => {
    this.setState(
      {
        showRunOptions: open,
      },
      () => {
        // FIXME: This is to when the user opens/closes the runtime args modeless.
        // This is to restore it to whatever is the state is in the backend.
        // This will ensure if the user clicks on the "Run" button directly
        // UI will still operate correctly discarding recently entered inputs in the session.
        if (!this.state.showRunOptions) {
          fetchAndUpdateRuntimeArgs();
        }
        if (this.props.onToggle) {
          this.props.onToggle(this.state.showRunOptions);
        }
      }
    );
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.showRunOptions !== this.state.showRunOptions) {
      this.setState({
        showRunOptions: nextProps.showRunOptions,
      });
    }
  };

  render() {
    return (
      <ThemeWrapper>
        <fieldset disabled={this.props.disabled}>
          <div className="arrow-btn-container">
            <div
              className={classnames('btn pipeline-action-btn pipeline-run-btn', {
                'btn-popover-open': this.state.showRunOptions,
              })}
              ref={this.dropdownButtonRef}
              onClick={() => {
                if (!this.props.disabled) {
                  this.toggleRunConfigOption(true);
                }
              }}
            >
              <IconSVG name="icon-caret-down" />
            </div>
          </div>
          <Provider store={PipelineConfigurationsStore}>
            <PipelineModeless
              title="Runtime Arguments"
              onClose={this.toggleRunConfigOption.bind(this, false)}
              open={this.state.showRunOptions}
              anchorEl={this.dropdownButtonRef.current}
            >
              <RuntimeArgsModeless
                onClose={this.toggleRunConfigOption}
                isLatestVersion={this.props.isLatestVersion}
              />
            </PipelineModeless>
          </Provider>
        </fieldset>
      </ThemeWrapper>
    );
  }
}
