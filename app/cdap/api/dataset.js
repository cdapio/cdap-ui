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
const basepath = '/namespaces/:namespace/data/datasets';

export const MyDatasetApi = {
  list: apiCreator(dataSrc, 'GET', 'REQUEST', basepath),
  get: apiCreator(dataSrc, 'GET', 'REQUEST', `${basepath}/:datasetId`),
  getPrograms: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${basepath}/:datasetId/programs`
  ),
  delete: apiCreator(dataSrc, 'DELETE', 'REQUEST', `${basepath}/:datasetId`),
  truncate: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${basepath}/:datasetId/admin/truncate`
  ),
};
