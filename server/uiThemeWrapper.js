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
import isPlainObject from 'lodash/isPlainObject';
import merge from 'lodash/merge';
import fs from 'fs';

const CDAP_DIST_PATH = path.normalize(__dirname + '/../public/cdap_dist');
const log = log4js.getLogger('default');
const uiThemePropertyName = 'ui.theme.file';
const THEME_FILE_EXTENSION = '.json';

/**
 * Directory with the theme files that are shipped with the UI (server/config/themes).
 * __dirname is either <cdap-ui>/server, when running from the sources,
 * or the directory of the server bundle, next to which webpack copies server/config.
 */
const BUNDLED_THEMES_DIR = __dirname.endsWith('server')
  ? path.join(__dirname, 'config', 'themes')
  : path.join(__dirname, 'server', 'config', 'themes');

/**
 * A theme that can be selected at runtime: the name of a .json file in the bundled themes
 * directory, optionally with the same prefix as used in the ui.theme.file property
 * (e.g. "light.json", "config/themes/light.json" or "server/config/themes/light.json").
 */
const BUNDLED_THEME_PATTERN = /^(?:(?:server\/)?config\/themes\/)?([A-Za-z0-9_-]+\.json)$/;

export function extractUIThemeWrapper(cdapConfig) {
  const uiThemePath = cdapConfig[uiThemePropertyName];
  if (typeof uiThemePath !== 'string' || !uiThemePath) {
    log.warn(`Unable to find ${uiThemePropertyName} property`);
    log.warn(`UI using default theme`);
    return mergeUIThemeWithConfig(cdapConfig, {});
  }
  return loadUITheme(cdapConfig, resolveConfiguredThemePath(uiThemePath));
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

/**
 * Resolves the theme file set in the ui.theme.file property. The property is set by the
 * administrator in cdap-site.xml, so it can be an absolute path or a path relative to the UI.
 */
function resolveConfiguredThemePath(uiThemePath) {
  if (path.isAbsolute(uiThemePath)) {
    return uiThemePath;
  }
  /**
   * Two paths
   * theme file path : config/themes/light.json | server/config/themes/light.json
   * __dirname: <cdap-home>/ui | <cdap-home/ui/server
   *
   * The configs exists in <cdap-home>/ui/sever/config/themes/*.json
   *
   */
  let themePath = uiThemePath;
  if (uiThemePath.startsWith('server') && __dirname.endsWith('server')) {
    themePath = path.join('..', uiThemePath);
  }
  if (uiThemePath.startsWith('config') && !__dirname.endsWith('server')) {
    themePath = path.join('server', uiThemePath);
  }
  return path.join(__dirname, themePath);
}

/**
 * Resolves a theme selected at runtime (see the /updateTheme API) to one of the theme files
 * bundled with the UI. Anything else, like absolute paths, paths into other directories or
 * files other than .json files, is rejected.
 *
 * @param {string} theme the requested theme
 * @param {string} [themesDir] the bundled themes directory, defaults to server/config/themes
 * @returns {string} the real path of the bundled theme file
 * @throws {Error} if the requested theme is not a bundled theme file
 */
export function resolveBundledThemePath(theme, themesDir = BUNDLED_THEMES_DIR) {
  const match = typeof theme === 'string' ? BUNDLED_THEME_PATTERN.exec(theme) : null;
  if (!match) {
    throw new Error('Not a bundled UI theme');
  }
  const realThemesDir = fs.realpathSync(themesDir);
  // realpath also resolves symbolic links, so the file has to really be in the themes directory.
  const themePath = fs.realpathSync(path.join(realThemesDir, match[1]));
  if (path.dirname(themePath) !== realThemesDir) {
    throw new Error('Not a bundled UI theme');
  }
  return themePath;
}

/**
 * Loads a theme file and adds the UI features configured in cdap-site.xml.
 *
 * Theme files are JSON documents. They are read and parsed as data, and never passed to
 * require(), so the content of a theme file is never executed.
 */
export function loadUITheme(cdapConfig, themeFilePath) {
  let uiThemeConfig;
  try {
    if (path.extname(themeFilePath).toLowerCase() !== THEME_FILE_EXTENSION) {
      throw new Error(`Theme files must be ${THEME_FILE_EXTENSION} files`);
    }
    // Strip the byte order mark, if any, like require() does for JSON files.
    uiThemeConfig = JSON.parse(fs.readFileSync(themeFilePath, 'utf8').replace(/^\uFEFF/, ''));
    if (!isPlainObject(uiThemeConfig)) {
      throw new Error('Theme files must contain a JSON object');
    }
  } catch (e) {
    log.error(`Unable to load UI theme file ${themeFilePath}: ${e.message}`);
    throw e;
  }
  log.info(`UI using theme file: ${themeFilePath}`);
  return mergeUIThemeWithConfig(cdapConfig, uiThemeConfig);
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
