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

import isNil from 'lodash/isNil';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import numeral from 'numeral';
import T from 'i18n-react';

export const ONE_MIN_SECONDS = 60;
export const ONE_HOUR_SECONDS = ONE_MIN_SECONDS * 60;
export const ONE_DAY_SECONDS = ONE_HOUR_SECONDS * 24;
const DEFAULT_TICKS_TOTAL = 10;
const WEEKS_TICKS_TOTAL = 7;
const SECONDS_RESOLUTION = 'sec';
const MINS_RESOLUTION = 'minutes';
const HOURS_RESOLUTION = 'hours';
const DAYS_RESOLUTION = 'days';

export function getTicksTotal({ start, end }) {
  if (isNil(start) || isNil(end)) {
    return DEFAULT_TICKS_TOTAL;
  }
  const timeWindow = end - start;
  if (timeWindow < ONE_DAY_SECONDS || timeWindow === ONE_DAY_SECONDS * 7) {
    return WEEKS_TICKS_TOTAL;
  }
  return DEFAULT_TICKS_TOTAL;
}

export function getXDomain({
  xDomainType,
  runsLimit,
  totalRunsCount,
  start,
  end,
}) {
  let startDomain, endDomain;
  if (xDomainType === 'limit') {
    startDomain =
      totalRunsCount > runsLimit ? totalRunsCount - runsLimit + 1 : 1;
    endDomain = totalRunsCount > runsLimit ? totalRunsCount : runsLimit;
  }
  if (xDomainType === 'time') {
    startDomain = start;
    endDomain = end;
  }
  return [startDomain, endDomain];
}

export function getYDomain(data = {}) {
  let maxYDomain = { y: 1 };
  if (data.length > 1) {
    maxYDomain = cloneDeep(
      data.reduce((prev, curr) => {
        return prev.y > curr.y ? prev : curr;
      })
    );
  }
  if (data.length === 1) {
    maxYDomain = data[0];
  }

  const MULTIPLIER = 1.1; // adding 10% top padding on the graph
  const maxDomain = maxYDomain.y * MULTIPLIER;

  // The lower bound of the domain can always be 0 as we
  // won't have negative values in the metrics graphs
  return [0, maxDomain];
}

export function getYAxisProps(data) {
  let formattedData = cloneDeep(data);
  if (!Array.isArray(data) && typeof data === 'object') {
    formattedData = [];
    Object.keys(data).forEach((d) => {
      formattedData = formattedData.concat(data[d].data);
    });
    data = formattedData;
  }
  const props = {
    tickTotals: 10,
    yDomain: getYDomain(data),
    tickFormat: function(d) {
      if (d <= 999) {
        // removing decimal ticks
        if (parseInt(d) !== d) {
          return;
        }

        return d;
      }

      return numeral(d).format('0.0a');
    },
  };
  if (props.yDomain[1] === 0) {
    props.yDomain[1] = 10;
  }
  return props;
}

export function xTickFormat({ xDomainType, start, end }) {
  let lastDisplayedDate;
  return (v) => {
    if (xDomainType === 'time') {
      const timeWindow = end - start;
      let date = moment(v * 1000).format('M/D/YY');
      if (timeWindow < ONE_DAY_SECONDS) {
        date = v % 2 === 0 ? moment(v * 1000).format('HH:mm a') : null;
      }
      if (timeWindow === ONE_DAY_SECONDS) {
        date = v % 2 === 0 ? moment(v * 1000).format('HH:mm a') : null;
      }
      if (timeWindow === ONE_DAY_SECONDS * 7) {
        date = v % 2 === 0 ? moment(v * 1000).format('Do MMM') : null;
      }
      if (timeWindow >= ONE_DAY_SECONDS * 30) {
        date = v % 2 === 0 ? moment(v * 1000).format('M/D/YY') : null;
      }
      if (!isNil(date) && lastDisplayedDate !== date) {
        lastDisplayedDate = date;
        return date;
      }
      return;
    }
    return v;
  };
}

export function getTimeResolution(maxYDomain) {
  let yAxisResolution = SECONDS_RESOLUTION;
  if (maxYDomain > ONE_MIN_SECONDS) {
    yAxisResolution = MINS_RESOLUTION;
  }
  if (maxYDomain > ONE_HOUR_SECONDS) {
    yAxisResolution = HOURS_RESOLUTION;
  }
  if (maxYDomain > ONE_DAY_SECONDS) {
    yAxisResolution = DAYS_RESOLUTION;
  }
  return yAxisResolution;
}

export function tickFormatBasedOnTimeResolution(timeResolution) {
  return (v) => {
    if (timeResolution === MINS_RESOLUTION) {
      return (v / ONE_MIN_SECONDS).toFixed(2);
    }
    if (timeResolution === HOURS_RESOLUTION) {
      return (v / ONE_HOUR_SECONDS).toFixed(2);
    }
    if (timeResolution === DAYS_RESOLUTION) {
      return (v / ONE_DAY_SECONDS).toFixed(2);
    }
    return v;
  };
}

export function getDuration(time) {
  if (typeof time !== 'number') {
    return '-';
  }
  if (time < ONE_MIN_SECONDS) {
    return `${time} seconds`;
  }
  return moment.duration(time, 'seconds').humanize();
}

export function getGapFilledAccumulatedData(data, numOfDataPoints) {
  const { x: minx, y: miny } = data[0];
  const maxx = data[data.length - 1].x;
  const numberOfEntries = maxx - minx;
  let lasty = miny;
  // Create an array with numberOfEntries + 1 undefined values
  const arrayOfSize = [...Array(numberOfEntries + 1)];
  // Map arrayOfSize to fill in gaps in data
  const finalData = arrayOfSize.map((i, index) => {
    const matchInActualData = data.find((d) => d.x === minx + index);
    if (!isNil(matchInActualData)) {
      lasty = matchInActualData.y;
    }
    return {
      ...matchInActualData,
      x: minx + index,
      y: lasty,
    };
  });
  if (finalData.length < numOfDataPoints) {
    const diff = numOfDataPoints - finalData.length;
    const lastDataPoint = finalData[finalData.length - 1];
    for (let i = 1; i <= diff; i++) {
      const currDataPoint = {
        ...lastDataPoint,
        x: lastDataPoint.x + i,
        y: lastDataPoint.y,
      };
      finalData.push(currDataPoint);
    }
  }
  return finalData;
}

/**
 * Function to get resolution to be displayed in the x-axis in plugin metrics graph
 * @param {string} resolution
 * The backend can be configured to return varying resolutions for time ranges of 1 min.
 * For time ranges of 10 mins and 10+mins it is fixed to 60s and 3600s respectively.
 *
 * So we now parse the resolution and get the actual number to determine if we need
 * to show 'seconds' or 'minutes' or 'hours' based on the range.
 *
 * if resolution is 1s - 59s: show 'seconds'
 * if resolution is 60s - 3599s: show 'minutes'
 * if resolution is > 3600s: show 'hours'
 */
export function getResolution(resolution) {
  const PREFIX = 'features.PipelineSummary.pipelineNodesMetricsGraph';
  if (!resolution || typeof resolution !== 'string') {
    return T.translate(`${PREFIX}.seconds`);
  }
  const resolutionNum = resolution.split(/s$/);
  if (resolutionNum.length !== 2) {
    return T.translate(`${PREFIX}.seconds`);
  }
  const num = parseInt(resolutionNum[0], 10);
  if (isNaN(num) || num < 60) {
    return T.translate(`${PREFIX}.seconds`);
  }
  if (num >= 60 && num < 3600) {
    return T.translate(`${PREFIX}.minutes`);
  }
  if (num >= 3600) {
    return T.translate(`${PREFIX}.hours`);
  }
}
