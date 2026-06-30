/*
 * Copyright © 2019-2020 Cask Data, Inc.
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

import memoize from 'lodash/memoize';

export const REQUEST_ORIGIN_ROUTER = 'ROUTER';
export const REQUEST_ORIGIN_MARKET = 'MARKET';

function getRouterHost(cdapConfig) {
  const routerhost = cdapConfig['router.server.address'],
    routerport =
      cdapConfig['ssl.external.enabled'] === 'true'
        ? cdapConfig['router.ssl.server.port']
        : cdapConfig['router.server.port'],
    routerprotocol = cdapConfig['ssl.external.enabled'] === 'true' ? 'https' : 'http';
  return `${routerprotocol}://${routerhost}:${routerport}`;
}

function extractMarketUrls(cdapConfig) {
  if (!cdapConfig) {
    return [];
  }
  const defaultMarketUrl = cdapConfig['market.base.url'];
  let marketUrls = cdapConfig['market.base.urls'];
  if (!defaultMarketUrl && !marketUrls) {
    return [];
  }
  if (defaultMarketUrl && !marketUrls) {
    return [defaultMarketUrl];
  }
  marketUrls = marketUrls.split('+').filter((url) => url !== '');
  let filteredMarketUrls;
  if (!defaultMarketUrl) {
    filteredMarketUrls = marketUrls;
  } else {
    filteredMarketUrls = marketUrls.filter((element) => element !== defaultMarketUrl);
    filteredMarketUrls.splice(0, 0, defaultMarketUrl);
  }
  // Make sure the default CDAP market is the first market.
  return filteredMarketUrls;
}

export const getMarketUrls = memoize(extractMarketUrls);

export function isVerifiedMarketHost(cdapConfig, url) {
  return !!getMarketUrls(cdapConfig).find((element) => url.startsWith(element));
}

export function constructUrl(cdapConfig, path, origin = REQUEST_ORIGIN_ROUTER) {
  if (!cdapConfig) {
    return null;
  }
  path = path && path[0] === '/' ? path.slice(1) : path;
  if (origin === REQUEST_ORIGIN_MARKET) {
    return path;
  }
  return `${getRouterHost(cdapConfig)}/${path}`;
}

export function deconstructUrl(cdapConfig, url, origin = REQUEST_ORIGIN_ROUTER) {
  if (origin === REQUEST_ORIGIN_MARKET) {
    return url;
  }
  const baseUrl = getRouterHost(cdapConfig);
  return `/${url.replace(baseUrl, '')}`;
}

// The following are valid backendPath patterns for logs

// Pipeline run Logs: /v3/namespaces/:namespace/apps/:appid/:programType/:programName/runs/:runid/logs/[prev | next]
// Preview logs: /v3/namespaces/:namespace/previews/:previewId/logs/[prev | next]
// System service logs: /v3/system/services/:serviceName/logs/[prev | next]
// Program logs: /v3/namespaces/:namespace/apps/:appid/:programType/:programId/logs/[prev | next]

// Allowed query params on these endpoints:
// start: number
// stop: number
// escape: boolean
// filter: string
// format: string
// suppress: string[]
// max: number
// fromOffset: string

// any other backend paths will be blocked from being served when called with the /downloadLogs endpoint

const SAFE_PATH_PARAM = '[\\p{L}\\p{N}_.-]+';

const LOGS_PATH_REGEXES = [
  new RegExp(`^/v3/namespaces/${SAFE_PATH_PARAM}/apps/${SAFE_PATH_PARAM}/${SAFE_PATH_PARAM}/${SAFE_PATH_PARAM}/(?:runs/${SAFE_PATH_PARAM}/)?logs(?:/(?:prev|next))?$`, 'u'),
  new RegExp(`^/v3/namespaces/${SAFE_PATH_PARAM}/previews/${SAFE_PATH_PARAM}/logs(?:/(?:prev|next))?$`, 'u'),
  new RegExp(`^/v3/system/services/${SAFE_PATH_PARAM}/logs(?:/(?:prev|next))?$`, 'u')
];


const ALLOWED_QUERY_PARAMS = [
  'start',
  'stop',
  'escape',
  'filter',
  'format',
  'suppress',
  'max',
  'fromOffset'
];

export function validateLogsPath(backendPath) {
  if (!backendPath || typeof backendPath !== 'string' || !backendPath.startsWith('/v3/')) {
    return false;
  }

  const queryIndex = backendPath.indexOf('?');
  let pathPart = backendPath;
  let queryPart = '';
  if (queryIndex !== -1) {
    pathPart = backendPath.substring(0, queryIndex);
    queryPart = backendPath.substring(queryIndex + 1);
  }

  const segments = pathPart.split('/').map((seg) => seg.trim()).filter(Boolean);
  if (segments.indexOf('.') !== -1 || segments.indexOf('..') !== -1) {
    return false;
  }

  const isValidPath = LOGS_PATH_REGEXES.some((regex) => regex.test(pathPart));
  if (!isValidPath) {
    return false;
  }

  if (queryPart) {
    const searchParams = new URLSearchParams(queryPart);
    for (const key of searchParams.keys()) {
      if (ALLOWED_QUERY_PARAMS.indexOf(key) === -1) {
        return false;
      }
    }
  }

  return true;
}
