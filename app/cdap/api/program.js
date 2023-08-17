/*
 * Copyright © 2016 Cask Data, Inc.
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

import DataSourceConfigurer from 'services/datasource/DataSourceConfigurer';
import { apiCreator } from 'services/resource-helper';

const dataSrc = DataSourceConfigurer.getInstance();
const basepath = '/namespaces/:namespace/apps/:appId/:programType/:programId';

export const MyProgramApi = {
  get: apiCreator(dataSrc, 'GET', 'REQUEST', basepath),
  status: apiCreator(dataSrc, 'GET', 'REQUEST', `${basepath}/status`),
  runs: apiCreator(dataSrc, 'GET', 'REQUEST', `${basepath}/runs`),
  pollRuns: apiCreator(dataSrc, 'GET', 'POLL', `${basepath}/runs`),
  pollStatus: apiCreator(dataSrc, 'GET', 'POLL', `${basepath}/status`),
  action: apiCreator(dataSrc, 'POST', 'REQUEST', `${basepath}/:action`),
  stopRun: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${basepath}/runs/:runId/stop`
  ),
  pollRunStatus: apiCreator(dataSrc, 'GET', 'POLL', `${basepath}/runs/:runId`),

  // logs
  nextLogs: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${basepath}/runs/:runId/logs/next`
  ),
  prevLogs: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${basepath}/runs/:runId/logs/prev`
  ),
};
