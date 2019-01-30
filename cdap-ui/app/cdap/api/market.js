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
import { apiCreatorAbsPath } from 'services/resource-helper';

let dataSrc = DataSourceConfigurer.getInstance();
const basepath = window.CDAP_CONFIG.marketUrl;
// FIXME (CDAP-14836): Right now this is scattered across node and client. Need to consolidate this.
const REQUEST_TYPE_MARKET = 'MARKET';
const requestOptions = {
  requestOrigin: REQUEST_TYPE_MARKET,
};

export const MyMarketApi = {
  list: apiCreatorAbsPath(dataSrc, 'GET', 'REQUEST', `/packages.json`, requestOptions),
  getCategories: apiCreatorAbsPath(dataSrc, 'GET', 'REQUEST', `/categories.json`, requestOptions),
  get: apiCreatorAbsPath(
    dataSrc,
    'GET',
    'REQUEST',
    `/packages/:packageName/:version/spec.json`,
    requestOptions
  ),
  getCategoryIcon: (category) => {
    return `${basepath}/categories/${category}/icon.png`;
  },
  getIcon: (entity) => {
    return `${basepath}/packages/${entity.name}/${entity.version}/icon.png`;
  },
  getSampleData: apiCreatorAbsPath(
    dataSrc,
    'GET',
    'REQUEST',
    `/packages/:entityName/:entityVersion/:filename`,
    requestOptions
  ),
};
