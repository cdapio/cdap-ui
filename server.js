/*
 * Copyright © 2015-2020 Cask Data, Inc.
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

import http from 'http';
import fs from 'fs';
import log4js from 'log4js';
import https from 'https';
import ip from 'ip';
import cookie from 'cookie';
import { getApp } from 'server/express';
import { extractConfig } from 'server/config/parser';
import { getCDAPConfig } from 'server/cdap-config';
import { applyGraphQLMiddleware } from 'gql/graphql';
import { getHostName } from 'server/config/hostname';
import middleware404 from 'server/middleware-404';

var cdapConfig,
  securityConfig,
  allowedOrigin = [],
  hostname,
  hostIP = ip.address();

/**
 * Configuring the logger. In order to use the logger anywhere
 * in the BE, include the following:
 *    var log4js = require('log4js');
 *    var logger = log4js.getLogger();
 *
 * We configure using LOG4JS_CONFIG specified file or we use
 * the default provided in the conf/log4js.json file.
 */
if (!process.env.LOG4JS_CONFIG) {
  log4js.configure(__dirname + '/server/config/log4js.json');
}

// Get a log handle.
var log = log4js.getLogger('default');

function getAuthHeaderFromRawCookies(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const authCookie = cookies['CDAP_Auth_Token'];

  return authCookie ? `Bearer ${authCookie}` : '';
}

function getFullURL(host) {
  let nodejsport = cdapConfig['dashboard.bind.port'];
  const isSSLEnabled = cdapConfig['ssl.external.enabled'] === 'true';
  const nodejsprotocol = isSSLEnabled ? 'https' : 'http';
  if (isSSLEnabled) {
    nodejsport = cdapConfig['dashboard.ssl.bind.port'];
  }
  let baseUrl = `${nodejsprotocol}://${host}`;
  return nodejsport ? `${baseUrl}:${nodejsport}` : baseUrl;
}
async function setAllowedOrigin() {
  const nodejsserver = cdapConfig['dashboard.bind.address'];

  // protocol and port will be added to this domain
  const whitelistedDomain = cdapConfig['dashboard.domain.name'];

  // take exact domain as-is from config
  const whitelistedOrigin = cdapConfig['dashboard.origin'];

  allowedOrigin = [getFullURL(nodejsserver)];
  try {
    hostname = await getHostName();
  } catch (e) {
    log.error('Unable to determine hostname: ' + e);
    hostname = null;
  }
  if (hostname) {
    allowedOrigin.push(getFullURL(hostname));
  }
  if (hostIP) {
    allowedOrigin.push(getFullURL(hostIP));
  }
  if (whitelistedDomain) {
    allowedOrigin.push(getFullURL(whitelistedDomain));
  }
  if (['localhost', '127.0.0.1', '0.0.0.0'].indexOf(nodejsserver) !== -1) {
    allowedOrigin.push(getFullURL('127.0.0.1'), getFullURL('0.0.0.0'), getFullURL('localhost'));
  }
  if (whitelistedOrigin) {
    allowedOrigin.push(whitelistedOrigin);
  }
}

log.info('Starting CDAP UI ...');
getCDAPConfig()
  .then(function(c) {
    /**
     * In order for the sandbox to refresh the conf/cdap-config.json you need
     * to run 'cdap config-tool --cdap' in the sandbox folder.
     *
     * In order to simulate what is created there, you need to edit
     * server/config/development and add whatever config piece you want there.
     *
     * You also need to edit the get /config route inside of express.js if you
     * want your new config to be returned to the ui.
     */

    // extract feature flags from the config with shorter keys to make it
    // easier to consume
    const featureFlags = {};
    // extract external links to be placed in cog menu of the app toolbar
    const externalLinks = {};
    for (const [key, value] of Object.entries(c)) {
      if (key.match(/^feature/)) {
        // feature. is 8 characters and we only want to include feature flags
        featureFlags[key.substring(8)] = value;
        delete c[key];
      }

      if (key.match(/ui.externalLinks/)) {
        /**
         * ui.externalLinks is 15 characters so remove ui.ui.ExternalLinks.
         * the format for external links inside of the config is ui.externalLinks.link
         * and the value is the url it should link to
         */
        externalLinks[key.substring(17)] = value;
        delete c[key];
      }
    }

    cdapConfig = c;
    cdapConfig.featureFlags = featureFlags;
    cdapConfig.externalLinks = externalLinks;
    if (cdapConfig['security.enabled'] === 'true') {
      log.debug('CDAP Security has been enabled');
      return extractConfig('security');
    }
  })

  .then(function(s) {
    securityConfig = s;
    setAllowedOrigin();
    return getApp(Object.assign({}, cdapConfig, securityConfig));
  })

  .then(function(app) {
    // handles /graphql route
    applyGraphQLMiddleware(app, Object.assign({}, cdapConfig, securityConfig), log);
    // handles all unmatched routes
    app.use(middleware404.render404);

    var port, server;
    if (cdapConfig['ssl.external.enabled'] === 'true') {
      if (cdapConfig['dashboard.ssl.disable.cert.check'] === 'true') {
        // For self signed certs: see https://github.com/mikeal/request/issues/418
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      }

      try {
        server = https.createServer(
          {
            key: fs.readFileSync(securityConfig['dashboard.ssl.key']),
            cert: fs.readFileSync(securityConfig['dashboard.ssl.cert']),
          },
          app
        );
      } catch (e) {
        log.error(
          'SSL key/cert files read failed. Please fix the key/ssl certificate files and restart node server -  ',
          e
        );
        process.exit(1);
      }
      port = cdapConfig['dashboard.ssl.bind.port'];
    } else {
      server = http.createServer(app);
      port = cdapConfig['dashboard.bind.port'];
    }
    server.listen(port, cdapConfig['dashboard.bind.address'], function() {
      log.info('CDAP UI listening on port %s', port);
    });

    return server;
  })

  .then(async function(server) {
    function gracefulShutdown() {
      log.info('Caught SIGTERM. Closing http server');
      server.close();
      process.exit(0);
    }
    process.on('SIGTERM', gracefulShutdown);
  });
