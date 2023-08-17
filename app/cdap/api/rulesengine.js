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

import DataSourceConfigurer from 'services/datasource/DataSourceConfigurer';
import { apiCreator } from 'services/resource-helper';

const dataSrc = DataSourceConfigurer.getInstance();
const appPath = '/namespaces/:namespace/apps/yare';
const serviceBasepath = `${appPath}/services/service`;
const serviceMethodsBasepath = `${appPath}/services/service/methods`;
const rbbasepath = `${serviceMethodsBasepath}/rulebooks/:rulebookid`;

const MyRulesEngineApi = {
  getRulebooks: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${serviceMethodsBasepath}/rulebooks`
  ),
  getRules: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${serviceMethodsBasepath}/rules`
  ),
  createRule: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${serviceMethodsBasepath}/rules`
  ),
  getRuleDetails: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${serviceMethodsBasepath}/rules/:ruleid`
  ),
  addRuleToRuleBook: apiCreator(
    dataSrc,
    'PUT',
    'REQUEST',
    `${rbbasepath}/rules/:ruleid`
  ),
  removeRuleFromRuleBook: apiCreator(
    dataSrc,
    'DELETE',
    'REQUEST',
    `${rbbasepath}/rules/:ruleid`
  ),
  getRulesForRuleBook: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${rbbasepath}/rules`
  ),
  createRulebook: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${serviceMethodsBasepath}/rulebooks`
  ),
  getRulebook: apiCreator(dataSrc, 'GET', 'REQUEST', `${rbbasepath}`),
  updateRulebook: apiCreator(dataSrc, 'PUT', 'REQUEST', `${rbbasepath}`),
  deleteRulebook: apiCreator(dataSrc, 'DELETE', 'REQUEST', `${rbbasepath}`),
  deleteRule: apiCreator(
    dataSrc,
    'DELETE',
    'REQUEST',
    `${serviceMethodsBasepath}/rules/:ruleid`
  ),

  // Yare service management
  getApp: apiCreator(dataSrc, 'GET', 'REQUEST', `${appPath}`),
  startService: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${serviceBasepath}/start`
  ),
  stopService: apiCreator(
    dataSrc,
    'POST',
    'REQUEST',
    `${serviceBasepath}/stop`
  ),
  getServiceStatus: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${serviceBasepath}/status`
  ),
  pollServiceStatus: apiCreator(
    dataSrc,
    'GET',
    'POLL',
    `${serviceBasepath}/status`
  ),
  createApp: apiCreator(dataSrc, 'PUT', 'REQUEST', `${appPath}`),
  ping: apiCreator(
    dataSrc,
    'GET',
    'REQUEST',
    `${serviceMethodsBasepath}/health`
  ),
};

export default MyRulesEngineApi;
