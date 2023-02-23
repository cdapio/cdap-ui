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

import { MyOperationsApi } from 'api/operations';
import { getCurrentNamespace } from 'services/NamespaceStore';
import moment from 'moment';
import { parseDashboardData } from 'components/OpsDashboard/RunsGraph/DataParser';
import DashboardStore, {
  DashboardActions,
} from 'components/OpsDashboard/store/DashboardStore';

// We are subtracting 1 second, as we don't want to get the runs scheduled
// for the bucket after the rightmost bucket we are showing
// For example, let's say we're querying from 11am of previous day to 11am today.
// If there's a pipeline scheduled for 11:00am today, it will show up in the
// last (current time) bucket. However, this is wrong, since the current bucket
// will only show runs between 10:00:00 am and 10:59:59 am today. That's why we
// need to subtract 1 second from the range we are requesting to the backend.

export const DAY_IN_SEC = 24 * 60 * 60 - 1;

export function enableLoading() {
  DashboardStore.dispatch({
    type: DashboardActions.enableLoading,
  });
}

export function getData(
  start,
  duration = DAY_IN_SEC,
  namespaces = DashboardStore.getState().namespaces.namespacesPick
) {
  enableLoading();

  const state = DashboardStore.getState().dashboard;

  if (!start) {
    start = moment()
      .startOf('hour')
      .subtract(23, 'h')
      .format('x');
    start = Math.floor(parseInt(start, 10) / 1000);
  }

  const namespacesList = [...namespaces, getCurrentNamespace()];

  const params = {
    start,
    duration, // 24 hours in minutes
    namespace: namespacesList,
  };

  MyOperationsApi.getDashboard(params).subscribe((res) => {
    const { pipelineCount, customAppCount, data } = parseDashboardData(
      res,
      start,
      duration,
      state.pipeline,
      state.customApp
    );

    DashboardStore.dispatch({
      type: DashboardActions.setData,
      payload: {
        rawData: res,
        data,
        pipelineCount,
        customAppCount,
        startTime: start,
        duration,
        namespacesPick: namespaces,
      },
    });
  });
}

export function next() {
  const state = DashboardStore.getState().dashboard;

  let start = moment(state.startTime * 1000);

  if (state.duration === DAY_IN_SEC) {
    start = start.add(12, 'h').format('x');
  } else {
    start = start.add(30, 'm').format('x');
  }

  start = Math.round(parseInt(start, 10) / 1000);

  setLast24Hours(false);
  setIs7DaysAgo(false);
  getData(start, state.duration);
}

export function prev() {
  const state = DashboardStore.getState().dashboard;

  let start = moment(state.startTime * 1000);

  if (state.duration === DAY_IN_SEC) {
    start = start.subtract(12, 'h').format('x');
  } else {
    start = start.subtract(30, 'm').format('x');
  }

  start = Math.round(parseInt(start, 10) / 1000);

  const sevenDaysAgo = get7DaysFromCurrentTime();

  if (start < sevenDaysAgo) {
    start = sevenDaysAgo;
    setIs7DaysAgo(true);
  }

  setLast24Hours(false);
  getData(start, state.duration);
}

export function setNamespacesPick(namespacesPick) {
  const state = DashboardStore.getState().dashboard;

  getData(state.startTime, state.duration, namespacesPick);
}

export function setLast24Hours(value) {
  DashboardStore.dispatch({
    type: DashboardActions.setLast24Hours,
    payload: {
      isLast24Hours: value,
    },
  });
}

export function setIs7DaysAgo(value) {
  DashboardStore.dispatch({
    type: DashboardActions.setIs7DaysAgo,
    payload: {
      is7DaysAgo: value,
    },
  });
}

function get7DaysFromCurrentTime() {
  const sevenDaysAgo = moment()
    .subtract(7, 'day')
    .format('x');
  return Math.floor(parseInt(sevenDaysAgo, 10) / 1000);
}
