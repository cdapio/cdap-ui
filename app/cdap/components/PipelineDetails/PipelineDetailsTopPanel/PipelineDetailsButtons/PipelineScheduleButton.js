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
import {
  setScheduleError,
  setScheduleButtonLoading,
} from 'components/PipelineDetails/store/ActionCreator';
import PipelineScheduler from 'components/PipelineScheduler';
import classnames from 'classnames';
import IconSVG from 'components/shared/IconSVG';
import Alert from 'components/shared/Alert';
import StatusMapper from 'services/StatusMapper';
import {
  schedulePipeline,
  suspendSchedule,
} from 'components/PipelineConfigurations/Store/ActionCreator';
import T from 'i18n-react';
import { Theme } from 'services/ThemeHelper';
import { GLOBALS } from 'services/global-constants';
import { PrimaryTextLowercaseButton } from 'components/shared/Buttons/PrimaryTextLowercaseButton';

const PREFIX = 'features.PipelineDetails.TopPanel';

export default class PipelineScheduleButton extends Component {
  static propTypes = {
    pipelineType: PropTypes.string,
    schedule: PropTypes.string,
    maxConcurrentRuns: PropTypes.number,
    pipelineName: PropTypes.string,
    scheduleStatus: PropTypes.string,
    scheduleButtonLoading: PropTypes.bool,
    scheduleError: PropTypes.string,
    runtimeArgs: PropTypes.array,
    isLatestVersion: PropTypes.bool,
  };

  state = {
    showScheduler: false,
    scheduleStatus: this.props.scheduleStatus,
  };

  constructor(props) {
    super(props);

    this.buttonRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    let scheduleStatus = StatusMapper.lookupDisplayStatus(nextProps.scheduleStatus);
    if (scheduleStatus !== this.state.scheduleStatus) {
      this.setState({ scheduleStatus });
      setScheduleButtonLoading(false);
    }
  }

  toggleScheduler = (open) => {
    this.setState({
      showScheduler: open,
    });
  };

  renderScheduleError() {
    if (!this.props.scheduleError) {
      return null;
    }

    return (
      <Alert
        message={this.props.scheduleError}
        type="error"
        showAlert={true}
        onClose={setScheduleError.bind(null, '')}
      />
    );
  }

  renderScheduleButton() {
    if (
      [StatusMapper.statusMap['SCHEDULED'], StatusMapper.statusMap['SUSPENDING']].indexOf(
        this.state.scheduleStatus
      ) !== -1
    ) {
      return (
        <div className="btn pipeline-action-btn pipeline-scheduler-btn" ref={this.buttonRef}>
          <PrimaryTextLowercaseButton
            onClick={this.toggleScheduler.bind(this, true)}
            disabled={this.state.scheduleStatus === StatusMapper.statusMap['SUSPENDING']}
          >
            <div className="btn-container">
              {this.props.scheduleButtonLoading ? (
                <IconSVG name="icon-spinner" className="fa-spin" />
              ) : (
                <IconSVG name="icon-runtimestarttime" className="unschedule-icon" />
              )}
              <div className="button-label">{T.translate(`${PREFIX}.unschedule`)}</div>
            </div>
          </PrimaryTextLowercaseButton>
        </div>
      );
    }

    return (
      <div
        className={classnames('btn pipeline-action-btn pipeline-scheduler-btn', {
          'btn-select': this.state.showScheduler,
        })}
        ref={this.buttonRef}
      >
        <PrimaryTextLowercaseButton
          onClick={this.toggleScheduler.bind(this, true)}
          disabled={this.state.scheduleStatus === StatusMapper.statusMap['SCHEDULING']}
        >
          <div className="btn-container">
            {this.props.scheduleButtonLoading ? (
              <IconSVG name="icon-spinner" className="fa-spin" />
            ) : (
              <IconSVG name="icon-runtimestarttime" className="schedule-icon" />
            )}
            <div className="button-label">{T.translate(`${PREFIX}.schedule`)}</div>
          </div>
        </PrimaryTextLowercaseButton>
      </div>
    );
  }

  render() {
    if (
      GLOBALS.programType[this.props.pipelineType] !== 'workflows' ||
      Theme.showSchedules === false
    ) {
      return null;
    }

    return (
      <div
        className={classnames('pipeline-action-container pipeline-scheduler-container', {
          active: this.state.showScheduler,
        })}
        data-cy="pipeline-scheduler-btn"
      >
        {this.renderScheduleError()}
        {this.renderScheduleButton()}
        <PipelineScheduler
          schedule={this.props.schedule}
          maxConcurrentRuns={this.props.maxConcurrentRuns}
          onClose={this.toggleScheduler.bind(this, false)}
          open={this.state.showScheduler}
          anchorEl={this.buttonRef.current}
          isDetailView={true}
          pipelineName={this.props.pipelineName}
          scheduleStatus={this.state.scheduleStatus}
          schedulePipeline={schedulePipeline}
          suspendSchedule={suspendSchedule}
          isLatestVersion={this.props.isLatestVersion}
        />
      </div>
    );
  }
}
