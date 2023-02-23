/*
 * Copyright © 2016-2018 Cask Data, Inc.
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

import { apiCreator } from 'services/resource-helper';
import DataSourceConfigurer from 'services/datasource/DataSourceConfigurer';
const dataSrc = DataSourceConfigurer.getInstance();
const basepath = '/namespaces/:namespace/apps';
const appPath = `${basepath}/:appId`;

export const MyAppApi = {
  list: apiCreator(dataSrc, 'GET', 'REQUEST', basepath),
  deployApp: apiCreator(dataSrc, 'PUT', 'REQUEST', appPath),
  get: apiCreator(dataSrc, 'GET', 'REQUEST', appPath),
  getVersions: apiCreator(dataSrc, 'GET', 'REQUEST', `${appPath}/versions`),
  getDeployedApp: apiCreator(dataSrc, 'GET', 'REQUEST', basepath),
  batchStatus: apiCreator(
    dataSrc,
    'POST',
    'POLL',
    '/namespaces/:namespace/status'
  ),
  batchAppDetail: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    '/namespaces/:namespace/appdetail'
  ),
  delete: apiCreator(dataSrc, 'DELETE', 'REQUEST', appPath),
};
