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
import { setStateFromCron } from 'components/PipelineScheduler/Store/ActionCreator';
import { ACTIONS as PipelineSchedulerActions } from 'components/PipelineScheduler/Store';
import ProfilesForSchedule from 'components/PipelineScheduler/ProfilesForSchedule';
import MaxConcurrentRuns from 'components/PipelineScheduler/BasicView/MaxConcurrentRuns';
import T from 'i18n-react';

const PREFIX = 'features.PipelineScheduler.advanced';

const mapStateToCronInputProps = (state, ownProps) => {
  return {
    value: state.cron.split(' ')[ownProps.index],
    label: ownProps.label,
    colWidth: ownProps.colWidth,
  };
};

const mapDispatchToCronInputProps = (dispatch, ownProps) => {
  return {
    onChange: (e) => {
      dispatch({
        type: PipelineSchedulerActions.UPDATE_CRON,
        payload: {
          index: ownProps.index,
          value: e.target.value,
        },
      });
      setStateFromCron();
    },
  };
};

const CronInput = ({ value, label, onChange, colWidth = 2, dataCy }) => {
  return (
    <div className={`form-group col-${colWidth} schedule-advanced-input`}>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="form-control"
        data-cy={dataCy}
      />
    </div>
  );
};

CronInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  colWidth: PropTypes.number,
  onChange: PropTypes.func,
  dataCy: PropTypes.string,
};

const ConnectedCronInput = connect(
  mapStateToCronInputProps,
  mapDispatchToCronInputProps
)(CronInput);

export default function AdvancedView({ isDetailView }) {
  return (
    <div className="schedule-type-content">
      <div className="schedule-advanced-header">
        {T.translate(`${PREFIX}.header`)}
      </div>
      <div className="schedule-advanced-values">
        <ConnectedCronInput
          label={T.translate(`${PREFIX}.min`)}
          index={0}
          dataCy="advanced-input-min"
        />
        <ConnectedCronInput
          label={T.translate(`${PREFIX}.hour`)}
          index={1}
          dataCy="advanced-input-hour"
        />
        <ConnectedCronInput
          label={T.translate(`${PREFIX}.day`)}
          index={2}
          dataCy="advanced-input-day"
        />
        <ConnectedCronInput
          label={T.translate(`${PREFIX}.month`)}
          index={3}
          dataCy="advanced-input-month"
        />
        <ConnectedCronInput
          label={T.translate(`${PREFIX}.daysOfWeek`)}
          index={4}
          colWidth={3}
          dataCy="advanced-input-days-of-week"
        />
      </div>
      <MaxConcurrentRuns />
      {isDetailView ? <ProfilesForSchedule /> : null}
    </div>
  );
}
AdvancedView.propTypes = {
  isDetailView: PropTypes.bool,
};
