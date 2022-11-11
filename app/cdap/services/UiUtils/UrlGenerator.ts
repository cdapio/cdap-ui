/*
 * Copyright © 2022 Cask Data, Inc.
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

/*
  Purpose: To generate absolute URLs to navigate between CDAP and Extensions (Hydrator & Tracker)
    as they are separate web apps with independent UI routing
  I/P: Context/Naviation object that has,
    - uiApp - cdap, hydrator or tracker
    - namespaceId, appId, entityType, entityId & runId to generate the complete URL if
      appropriate context is available.

  O/P: Absolute Url of the form:
    <protocol>//<host>/:uiApp/:namespaceId/apps/:appId/:entityType/:entityId/runs/:runId

  The absolute URL will be generated based on the available context.

  Note:
    This is attached to the window object as this needs to be used in both CDAP (react app) and
    in hydrator & tracker (angular apps). For now it is attached to window as its a pure function
    without any side effects. Moving forward once we have everything in react we should use this
    as a proper utility function in es6 module system.
*/

/**
 *
 * @param navigationObj {uiApp,
 *                       redirectUrl,
 *                       clientId,
 *                       namespaceId,
 *                       appId,
 *                       entityType,
 *                       entityId,
 *                       runId}
 *                       that specify an absolute url
 * @returns redirect url
 */
export const getAbsUIUrl = (navigationObj: any = {}) => {
  const {
    uiApp = 'cdap',
    redirectUrl,
    clientId,
    namespaceId,
    appId,
    entityType,
    entityId,
    runId,
  } = navigationObj;
  let baseUrl = `${location.protocol}//${location.host}/${uiApp}`;
  if (uiApp === 'login') {
    baseUrl += `?`;
  }
  if (redirectUrl) {
    baseUrl += `redirectUrl=${encodeURIComponent(redirectUrl)}`;
  }
  if (clientId) {
    baseUrl += `&clientId=${clientId}`;
  }
  if (namespaceId) {
    baseUrl += `/ns/${namespaceId}`;
  }
  if (appId) {
    baseUrl += `/apps/${appId}`;
  }
  if (entityType && entityId) {
    baseUrl += `/${entityType}/${entityId}`;
  }
  if (runId) {
    baseUrl += `/runs/${runId}`;
  }
  return baseUrl;
};

/**
 *
 * @param navigationObj {stateName, stateParams} that specifiy the base url
 *                      and queryparams
 * @returns redirect url
 */
export const getDataPrepUrl = (navigationObj: any = {}) => {
  const { stateName, stateParams } = navigationObj;

  const uiApp = 'cdap';
  const baseUrl = `${location.protocol}//${location.host}/${uiApp}/ns/:namespace`;

  const stateToUrlMap = {
    connections: '/connections',
    workspaces: '/wrangler',
  };

  let url = baseUrl + stateToUrlMap[stateName || 'workspaces'];
  url = buildCustomUrl(url, stateParams);
  return url;
};

/**
 *
 * @param navigationObj {stateName, stateParams} that specifiy the base url
 *                      and queryparams
 * @returns redirect url
 */
export const getTrackerUrl = (navigationObj: any = {}) => {
  const { stateName, stateParams } = navigationObj;
  const uiApp = 'metadata';
  const baseUrl = `${location.protocol}//${location.host}/${uiApp}/ns/:namespace`;
  const stateToUrlMap = {
    tracker: '',
    'tracker.detail': '',
    'tracker.detail.entity': '/entity/:entityType/:entityId',
    'tracker.detail.entity.metadata': '/entity/:entityType/:entityId/metadata',
    'tracker.detail.entity.lineage': '/entity/:entityType/:entityId/lineage',
    'tracker.detail.entity.summary': '/entity/:entityType/:entityId/summary',
  };
  let url = baseUrl + stateToUrlMap[stateName || 'tracker'];
  url = buildCustomUrl(url, stateParams);
  return url;
};

/**
 *
 * @param navigationObj {stateName, stateParams} that specifiy the base url
 *                      and queryparams
 * @returns redirect url
 */
export const getHydratorUrl = (navigationObj: any = {}) => {
  const { stateName, stateParams } = navigationObj;
  const uiApp = stateName === 'hydrator.list' ? 'cdap' : 'pipelines';
  const baseUrl = `${location.protocol}//${location.host}/${uiApp}/ns/:namespace`;
  const stateToUrlMap = {
    hydrator: '',
    'hydrator.create': '/studio',
    'hydrator.detail': '/view/:pipelineId',
    'hydrator.list': '/pipelines',
  };
  let url = baseUrl + stateToUrlMap[stateName || 'pipelines'];
  url = buildCustomUrl(url, stateParams);
  return url;
};

/**
 *
 * @param navigationObj {stateName, stateParams} that specifiy the base url
 *                      and queryparams
 * @returns redirect url
 */
export const getOldCDAPUrl = (navigationObj: any = {}) => {
  const { stateName, stateParams } = navigationObj;
  const uiApp = 'oldcdap';
  const baseUrl = `${location.protocol}//${location.host}/${uiApp}/ns/:namespace`;
  const stateToUrlMap = {
    'datasets.detail.overview.status': '/datasets/:datasetId/overview/status',
    'datasets.detail.overview.explore': '/datasets/:datasetId/overview/explore',
    'streams.detail.overview.status': '/streams/:streamId/overview/status',
    'streams.detail.overview.explore': '/streams/:streamId/overview/explore',
    'apps.detail.overview.status': '/apps/:appId/overview/status',
    'apps.detail.overview.programs': '/apps/:appId/overview/programs',
    'mapreduce.detail': '/apps/:appId/programs/mapreduce/:programId/runs',
    'workflows.detail': '/apps/:appId/programs/workflows/:programId/runs',
    'workflows.detail.run': '/apps/:appId/programs/workflows/:programId/runs/:runId',
    'workers.detail': '/apps/:appId/programs/workers/:programId/runs',
    'workers.detail.run': '/apps/:appId/programs/workers/:programId/runs/:runId',
    'spark.detail': '/apps/:appId/programs/spark/:programId/runs',
    'spark.detail.run': '/apps/:appId/programs/spark/:programId/runs/:runId',
    'flows.detail': '/apps/:appId/programs/flows/:programId/runs',
    'services.detail': '/apps/:appId/programs/services/:programId/runs',
  };
  let url = baseUrl + stateToUrlMap[stateName || 'pipelines'];
  url = buildCustomUrl(url, stateParams);
  return url;
};
