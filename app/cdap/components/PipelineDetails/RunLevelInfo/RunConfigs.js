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
import IconSVG from 'components/shared/IconSVG';
import { convertMapToKeyValuePairsObj } from 'components/shared/KeyValuePairs/KeyValueStoreActions';
import PipelineConfigurationsStore, {
  ACTIONS as PipelineConfigurationsActions,
} from 'components/PipelineConfigurations/Store';
import {
  objectQuery,
  reverseArrayWithoutMutating,
  isNilOrEmpty,
  preventPropagation,
} from 'services/helpers';
import classnames from 'classnames';
import Popover from 'components/shared/Popover';
import PipelineModeless from 'components/PipelineDetails/PipelineModeless';
import T from 'i18n-react';
import { Provider } from 'react-redux';
import findIndex from 'lodash/findIndex';
import CopyableID from 'components/CopyableID';
import PipelineRunTimeArgsCounter from 'components/PipelineDetails/PipelineRuntimeArgsCounter';
import { getFilteredRuntimeArgs } from 'components/PipelineConfigurations/Store/ActionCreator';
import RuntimeArgsPairs from 'components/PipelineDetails/PipelineRuntimeArgsDropdownBtn/RuntimeArgsKeyValuePairWrapper/RuntimeArgsPairsMaterial';

const PREFIX = 'features.PipelineDetails.RunLevel';

export default class RunConfigs extends Component {
  static propTypes = {
    currentRun: PropTypes.object,
    runs: PropTypes.array,
    pipelineType: PropTypes.string,
    pipelineName: PropTypes.string,
  };

  state = {
    showModeless: false,
    runtimeArgs: {
      pairs: [],
    },
  };

  runtimeArgsMap = {};

  constructor(props) {
    super(props);

    this.buttonRef = React.createRef();
  }

  componentWillReceiveProps() {
    this.getRuntimeArgsAndToggleModeless();
  }

  componentDidMount() {
    this.getRuntimeArgsAndToggleModeless();
  }

  getRuntimeArgsAndToggleModeless = () => {
    if (this.state.showModeless) {
      PipelineConfigurationsStore.dispatch({
        type: PipelineConfigurationsActions.SET_MODELESS_OPEN_STATUS,
        payload: { open: false },
      });
      PipelineConfigurationsStore.dispatch({
        type: PipelineConfigurationsActions.SET_PIPELINE_VISUAL_CONFIGURATION,
        payload: {
          pipelineVisualConfiguration: {
            isHistoricalRun: true,
          },
        },
      });
    }

    let runtimeArgs = objectQuery(this.props.currentRun, 'properties', 'runtimeArgs') || '';
    try {
      if (runtimeArgs === '') {
        runtimeArgs = {};
      } else {
        runtimeArgs = JSON.parse(runtimeArgs);
        delete runtimeArgs[''];
      }
    } catch (e) {
      console.log('ERROR: Cannot parse runtime arguments');
      runtimeArgs = {};
    }

    this.runtimeArgsMap = JSON.stringify(runtimeArgs, null, 2);
    runtimeArgs = getFilteredRuntimeArgs(convertMapToKeyValuePairsObj(runtimeArgs));

    this.setState({
      runtimeArgs,
    });
  };

  toggleModeless = (showModeless) => {
    if (showModeless === this.state.showModeless) {
      return;
    }
    this.setState(
      {
        showModeless: showModeless || !this.state.showModeless,
      },
      () => {
        if (this.state.showModeless) {
          this.getRuntimeArgsAndToggleModeless();
        }
      }
    );
  };

  isRuntimeArgsEmpty = () => {
    if (!this.state.runtimeArgs.pairs.length) {
      return true;
    }
    if (this.state.runtimeArgs.pairs.length === 1) {
      if (
        isNilOrEmpty(this.state.runtimeArgs.pairs[0].key) &&
        isNilOrEmpty(this.state.runtimeArgs.pairs[0].value)
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  renderRuntimeArgs = () => {
    return (
      <div className="historical-runtimeargs-keyvalues">
        <RuntimeArgsPairs
          widgetProps={{
            'key-placeholder': 'Key',
            'value-placeholder': 'Value',
          }}
          value={this.state.runtimeArgs.pairs}
          dataCy="runlevel-runtimeargs-deployed"
          disabled={true}
          showGeneratedArgs={true}
        />
      </div>
    );
  };

  renderRunConfigsButton = () => {
    let { runs, currentRun } = this.props;
    let reversedRuns = reverseArrayWithoutMutating(runs);
    let currentRunIndex = findIndex(reversedRuns, { runid: objectQuery(currentRun, 'runid') });
    const title = (
      <div className="runconfig-modeless-title">
        <div>
          {T.translate(`${PREFIX}.configsModelessTitle`, {
            currentRunIndex: currentRunIndex + 1,
          })}
        </div>
        <CopyableID
          label={T.translate(`${PREFIX}.copyRuntimeArgsBtnLabel`)}
          id={this.runtimeArgsMap}
          tooltipText={false}
        />
      </div>
    );
    return (
      <React.Fragment>
        <div
          className="run-configs-btn"
          ref={this.buttonRef}
          onClick={this.toggleModeless.bind(this, true)}
        >
          <IconSVG name="icon-macro" />
          <div className="button-label">{T.translate(`${PREFIX}.configs`)}</div>
        </div>

        <Provider store={PipelineConfigurationsStore}>
          <PipelineModeless
            title={title}
            onClose={this.toggleModeless.bind(this, false)}
            open={this.state.showModeless}
            anchorEl={this.buttonRef.current}
            arrow={true}
          >
            <div className="historical-runtime-args-wrapper">
              {this.renderRuntimeArgs()}
              <div className="runconfig-tab-footer">
                {this.isRuntimeArgsEmpty() ? null : (
                  <PipelineRunTimeArgsCounter runtimeArgs={this.state.runtimeArgs} />
                )}
              </div>
            </div>
          </PipelineModeless>
        </Provider>
      </React.Fragment>
    );
  };

  render() {
    const ConfigsBtnComp = () => (
      <div className="run-configs-btn" onClick={preventPropagation}>
        <IconSVG name="icon-macro" />
        <div className="button-label">{T.translate(`${PREFIX}.configs`)}</div>
      </div>
    );

    if (!this.props.runs.length || this.isRuntimeArgsEmpty()) {
      return (
        <Popover
          target={ConfigsBtnComp}
          showOn="Hover"
          placement="bottom-end"
          className="run-info-container run-configs-container disabled"
        >
          {!this.props.runs.length
            ? T.translate(`${PREFIX}.pipelineNeverRun`)
            : T.translate(`${PREFIX}.noRuntimeArgsForRun`)}
        </Popover>
      );
    }

    return (
      <div
        className={classnames('run-info-container run-configs-container', {
          active: this.state.showModeless,
        })}
      >
        {this.renderRunConfigsButton()}
      </div>
    );
  }
}
