/*
 * Copyright © 2017 Cask Data, Inc.
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
import { MyProgramApi } from 'api/program';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { convertProgramToApi } from 'services/program-api-converter';
import { Tooltip } from 'reactstrap';
import T from 'i18n-react';
import { getLogViewerPageUrl } from 'components/LogViewer/LogViewerPage';

export default class LogAction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisabled: false,
      runId: props.entity.runId,
      tooltipOpen: false,
    };
    this.toggleTooltip = this.toggleTooltip.bind(this);
  }

  componentWillMount() {
    if (this.state.runId) {
      return;
    }
    const namespace = getCurrentNamespace();

    this.pollRuns$ = MyProgramApi.pollRuns({
      namespace,
      appId: this.props.entity.applicationId,
      programType: convertProgramToApi(this.props.entity.programType),
      programId: this.props.entity.id,
    }).subscribe((res) => {
      if (res.length > 0) {
        this.setState({
          runId: res[0].runid,
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.pollRuns$) {
      this.pollRuns$.unsubscribe();
    }
  }

  generateLink() {
    if (!this.state.runId) {
      return null;
    }
    const namespace = getCurrentNamespace(),
      appId = this.props.entity.applicationId,
      programType = convertProgramToApi(this.props.entity.programType),
      programId = this.props.entity.id,
      runId = this.state.runId;

    const path = getLogViewerPageUrl(
      namespace,
      appId,
      programType,
      programId,
      runId
    );

    return path;
  }

  toggleTooltip() {
    this.setState({ tooltipOpen: !this.state.tooltipOpen });
  }

  render() {
    // have to do this because ID cannot start with a number
    const tooltipID = `logs-${this.props.entity.uniqueId}`;
    const renderDisabled = (
      <button className="btn btn-link" disabled>
        <IconSVG name="icon-file-text-o" />
      </button>
    );

    const link = this.generateLink();

    const renderLog = (
      <a
        href={link}
        target="_blank"
        className="btn btn-link"
        rel="noopener noreferrer"
      >
        <IconSVG name="icon-file-text" />
      </a>
    );

    return (
      <span className="btn btn-secondary btn-sm">
        <span id={tooltipID}>
          {this.state.runId ? renderLog : renderDisabled}
        </span>

        <Tooltip
          placement="top"
          className="fast-action-tooltip"
          isOpen={this.state.tooltipOpen}
          target={tooltipID}
          toggle={this.toggleTooltip}
          delay={0}
        >
          {this.state.runId
            ? T.translate('features.FastAction.logLabel')
            : T.translate('features.FastAction.logNotAvailable')}
        </Tooltip>
      </span>
    );
  }
}

LogAction.propTypes = {
  entity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    uniqueId: PropTypes.string,
    applicationId: PropTypes.string.isRequired,
    programType: PropTypes.string.isRequired,
    runId: PropTypes.string,
  }),
};
