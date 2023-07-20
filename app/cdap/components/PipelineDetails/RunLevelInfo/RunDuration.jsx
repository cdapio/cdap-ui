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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Duration from 'components/shared/Duration';
import { humanReadableDuration } from 'services/helpers';
import T from 'i18n-react';

const PREFIX = 'features.PipelineDetails';

const mapStateToProps = (state) => {
  return {
    currentRun: state.currentRun,
  };
};

const RunDuration = ({ currentRun }) => {
  let DurationComp;
  if (currentRun && currentRun.starting) {
    if (currentRun.end) {
      DurationComp = (
        <span>{`${humanReadableDuration(
          currentRun.end - currentRun.starting
        )}`}</span>
      );
    } else {
      DurationComp = (
        <Duration
          targetTime={currentRun.starting}
          isMillisecond={false}
          showFullDuration={true}
        />
      );
    }
  }
  return (
    <div className="run-info-container">
      <div>
        <strong>{T.translate(`${PREFIX}.duration`)}</strong>
      </div>
      <span>{currentRun && currentRun.starting ? DurationComp : '--'}</span>
    </div>
  );
};

RunDuration.propTypes = {
  currentRun: PropTypes.object,
};

const ConnectedRunDuration = connect(mapStateToProps)(RunDuration);
export default ConnectedRunDuration;
