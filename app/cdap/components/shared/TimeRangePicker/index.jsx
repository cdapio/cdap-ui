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
import Calendar from 'react-calendar';
import moment from 'moment';
import classnames from 'classnames';
import If from 'components/shared/If';
import DateRangeIcon from '@material-ui/icons/DateRange';

require('./TimeRangePicker.scss');

const format = 'MM-DD-YYYY hh:mm A';

export default class TimeRangePicker extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    start: PropTypes.number,
    end: PropTypes.number,
    displayOnly: PropTypes.bool,
    onTimeClick: PropTypes.func,
    showRange: PropTypes.bool,
  };

  static defaultProps = {
    displayOnly: false,
    showRange: true, // for backward compatibility
  };

  state = {
    date: null,
    displayCalendar: null,
    hour: 0,
    minute: 0,
    start: this.props.start,
    end: this.props.end,
  };

  componentWillMount() {
    if (this.props.displayOnly) {
      return;
    }

    // to set default
    this.changeDisplay('start');
  }

  changeDate = (date) => {
    this.setState(
      {
        date,
        [this.state.displayCalendar]: this.calculateDisplayTime({ date }),
      },
      () => {
        this.applyChange();
      }
    );
  };

  changeDisplay = (type) => {
    if (typeof this.props.onTimeClick === 'function') {
      this.props.onTimeClick();
    }

    if (type === this.state.displayCalendar) {
      return;
    }

    let date = this.state.date,
      hour = this.state.hour,
      minute = this.state.minute;

    const initTime = this.state[type]
      ? this.state[type]
      : this.state[this.state.displayCalendar];

    if (initTime) {
      const time = new Date(initTime);
      date = new Date(time.getFullYear(), time.getMonth(), time.getDate());
      hour = time.getHours();
      minute = time.getMinutes();
    }

    this.setState({
      displayCalendar: type,
      date,
      hour,
      minute,
    });
  };

  changeHour = (e) => {
    const hour = e.target.value;

    this.setState(
      {
        hour,
        [this.state.displayCalendar]: this.calculateDisplayTime({ hour }),
      },
      () => {
        this.applyChange();
      }
    );
  };

  changeMinute = (e) => {
    const minute = e.target.value;

    this.setState(
      {
        minute,
        [this.state.displayCalendar]: this.calculateDisplayTime({ minute }),
      },
      () => {
        this.applyChange();
      }
    );
  };

  displayStartTime = () => {
    const startHint = this.props.showRange ? 'Start Time' : 'Select Time';

    if (!this.state.start) {
      return (
        <div className="time-select">
          <span className="calendar-icon">
            <DateRangeIcon />
          </span>
          <div>{startHint}</div>
        </div>
      );
    }
    return moment(this.state.start).format(format);
  };

  displayEndTime = () => {
    if (!this.state.end) {
      return (
        <div className="time-select">
          <span className="calendar-icon">
            <DateRangeIcon />
          </span>
          <div>{'End Time'}</div>
        </div>
      );
    }

    return moment(this.state.end).format(format);
  };

  calculateDisplayTime = (timeObj) => {
    const timeInfo = {
      date: this.state.date,
      hour: this.state.hour,
      minute: this.state.minute,
      ...timeObj,
    };

    let datetime = moment(timeInfo.date);

    datetime.add(timeInfo.hour, 'h').add(timeInfo.minute, 'm');

    datetime = parseInt(datetime.format('x'), 10);

    return datetime;
  };

  applyChange = () => {
    if (
      typeof this.props.onChange !== 'function' ||
      this.state.start === null ||
      this.state.end === null
    ) {
      return;
    }

    this.props.onChange({
      start: this.state.start,
      end: this.state.end,
    });
  };

  renderCalendar = () => {
    if (this.props.displayOnly) {
      return null;
    }

    let max = new Date();
    let min = null;

    if (this.state.displayCalendar === 'end' && this.state.start) {
      min = new Date(this.state.start);
    }

    if (this.state.displayCalendar === 'start' && this.state.end) {
      max = new Date(this.state.end);
    }

    return (
      <div className="calendar-container">
        <Calendar
          onChange={this.changeDate}
          value={this.state.date}
          calendarType="US"
          className="calendar"
          maxDate={max}
          minDate={min}
        />
      </div>
    );
  };

  padTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  renderHourMinuteSelector = () => {
    if (this.props.displayOnly) {
      return null;
    }

    return (
      <div className="time-container">
        <div className="time-display">
          <span className="time">{this.padTime(this.state.hour)}</span>
          <span className="colon">:</span>
          <span className="time">{this.padTime(this.state.minute)}</span>
        </div>

        <div className="time-slider">
          <div>
            <label>Hour</label>
            <input
              type="range"
              min="0"
              max="23"
              value={this.state.hour}
              onChange={this.changeHour}
            />
          </div>
          <div className="minutes-slider">
            <label>Minutes</label>
            <input
              type="range"
              min="0"
              max="59"
              value={this.state.minute}
              onChange={this.changeMinute}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="time-range-picker-container">
        <div className="time-range-selector">
          <div className="time">
            <div
              className={classnames('time-wrapper', {
                active:
                  !this.props.displayOnly &&
                  this.state.displayCalendar === 'start',
              })}
              onClick={this.changeDisplay.bind(this, 'start')}
            >
              {this.displayStartTime()}
            </div>
          </div>
          <If condition={this.props.showRange}>
            <div className="separator text-center">to</div>

            <div className="time">
              <div
                className={classnames('time-wrapper', {
                  active:
                    !this.props.displayOnly &&
                    this.state.displayCalendar === 'end',
                })}
                onClick={this.changeDisplay.bind(this, 'end')}
              >
                {this.displayEndTime()}
              </div>
            </div>
          </If>
        </div>

        {this.renderCalendar()}

        {this.renderHourMinuteSelector()}
      </div>
    );
  }
}
