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

import log4js from 'log4js';
import path from 'path';
import get from 'lodash/get';
import merge from 'lodash/merge';
import fs from 'fs';

const CDAP_DIST_PATH = path.normalize(__dirname + '/../public/cdap_dist');
const log = log4js.getLogger('default');
const uiThemePropertyName = 'ui.theme.file';

// Directories from which UI theme files are allowed to be loaded.
// extractUITheme accepts a path from HTTP input (POST /updateTheme), so
// the resolved theme file must stay inside one of these roots and must
// be a .json file. This prevents the loader from pulling in files from
// arbitrary locations and blocks non-JSON modules (which would otherwise
// be executed by require()).
const UI_THEME_ALLOWED_ROOTS = [
  path.resolve(__dirname, 'config', 'themes'),
  path.resolve(__dirname, '..', 'server', 'config', 'themes'),
];

function isPathInsideRoot(candidate, root) {
  const relative = path.relative(root, candidate);
  return (
    relative === '' ||
    (!relative.startsWith('..') && !path.isAbsolute(relative))
  );
}

function resolveAllowedThemePath(uiThemePath) {
  if (typeof uiThemePath !== 'string' || uiThemePath.length === 0) {
    throw new Error('UI theme path is missing');
  }
  if (path.extname(uiThemePath).toLowerCase() !== '.json') {
    throw new Error(`UI theme path must be a .json file: ${uiThemePath}`);
  }

  const candidates = [];
  if (path.isAbsolute(uiThemePath)) {
    candidates.push(path.resolve(uiThemePath));
  } else {
    candidates.push(path.resolve(__dirname, uiThemePath));
    if (uiThemePath.startsWith('server') && __dirname.endsWith('server')) {
      candidates.push(path.resolve(__dirname, '..', uiThemePath));
    }
    if (uiThemePath.startsWith('config') && !__dirname.endsWith('server')) {
      candidates.push(path.resolve(__dirname, 'server', uiThemePath));
    }
  }

  for (const resolved of candidates) {
    for (const root of UI_THEME_ALLOWED_ROOTS) {
      if (isPathInsideRoot(resolved, root)) {
        return resolved;
      }
    }
  }
  throw new Error(
    `UI theme path is not inside an allowed theme directory: ${uiThemePath}`
  );
}

function loadThemeJsonFile(resolvedPath) {
  const raw = fs.readFileSync(resolvedPath, 'utf8');
  return JSON.parse(raw);
}

export function extractUIThemeWrapper(cdapConfig) {
  const uiThemePath = cdapConfig[uiThemePropertyName];
  return extractUITheme(cdapConfig, uiThemePath);
}

function extractUIFeaturesFromConfig(cdapConfig) {
  const FEATURE_PREFIX = 'ui.feature.';
  const acceptableString = ['true', 'false'];

  const uiFeatures = Object.keys(cdapConfig).filter((configKey) => {
    return (
      configKey.startsWith(FEATURE_PREFIX) &&
      acceptableString.indexOf(cdapConfig[configKey].toString()) !== -1
    );
  });

  const featuresMap = {};

  uiFeatures.forEach((configKey) => {
    const featureKey = configKey.slice(FEATURE_PREFIX.length);
    featuresMap[featureKey] = cdapConfig[configKey].toString() === 'true';
  });

  return featuresMap;
}

function mergeUIThemeWithConfig(cdapConfig, themeConfig) {
  const configFeatures = {
    features: extractUIFeaturesFromConfig(cdapConfig),
  };

  return merge(themeConfig, configFeatures);
}

export function extractUITheme(cdapConfig, uiThemePath) {
  const DEFAULT_CONFIG = {};

  if (!(uiThemePropertyName in cdapConfig)) {
    log.warn(`Unable to find ${uiThemePropertyName} property`);
    log.warn(`UI using default theme`);
    return mergeUIThemeWithConfig(cdapConfig, DEFAULT_CONFIG);
  }

  let resolvedThemePath;
  try {
    resolvedThemePath = resolveAllowedThemePath(uiThemePath);
  } catch (e) {
    log.info(`UI theme path rejected: ${e.message}`);
    throw e;
  }

  try {
    const uiThemeConfig = loadThemeJsonFile(resolvedThemePath);
    log.info(`UI using theme file: ${resolvedThemePath}`);
    return mergeUIThemeWithConfig(cdapConfig, uiThemeConfig);
  } catch (e) {
    log.info('UI Theme file not found or not valid JSON at: ', resolvedThemePath);
    throw e;
  }
}

export function getFaviconPath(uiThemeConfig) {
  let faviconPath = CDAP_DIST_PATH + '/cdap_assets/img/favicon.png';
  let themeFaviconPath = get(uiThemeConfig, ['content', 'favicon-path']);
  if (themeFaviconPath) {
    // If absolute path no need to modify as require'ing absolute path should
    // be fine.
    if (themeFaviconPath[0] !== '/') {
      themeFaviconPath = `${CDAP_DIST_PATH}/${themeFaviconPath}`;
    }
    try {
      if (fs.existsSync(themeFaviconPath)) {
        faviconPath = themeFaviconPath;
      } else {
        log.warn(`Unable to find favicon at path ${themeFaviconPath}`);
      }
    } catch (e) {
      log.warn(`Unable to find favicon at path ${themeFaviconPath}`);
    }
  }
  return faviconPath;
}
