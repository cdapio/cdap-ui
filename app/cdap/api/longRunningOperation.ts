/*
 * Copyright © 2023 Cask Data, Inc.
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
const basePath = '/namespaces/:namespace/operations';
const PUSH_FILTER = encodeURIComponent('TYPE=PUSH_APPS');
const PULL_FILTER = encodeURIComponent('TYPE=PULL_APPS');

export const LongRunningOperationApi = {
  getLatestPush: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${basePath}/?pageSize=10&filter=${PUSH_FILTER}`
  ),
  getLatestPull: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${basePath}/?pageSize=10&filter=${PULL_FILTER}`
  ),
  pollOperation: apiCreator(dataSrc, 'GET', 'POLL', `${basePath}/:operationId`),
  stopOperation: apiCreator(dataSrc, 'POST', 'REQUEST', `${basePath}/:operationId/stop`),
};
