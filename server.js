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

import sockjs from 'sockjs';
import http from 'http';
import fs from 'fs';
import log4js from 'log4js';
import https from 'https';
import ip from 'ip';
import cookie from 'cookie';
import { getApp } from 'server/express';
import Aggregator from 'server/aggregator';
import { extractConfig } from 'server/config/parser';
import { getCDAPConfig } from 'server/cdap-config';
import { applyGraphQLMiddleware } from 'gql/graphql';
import { getHostName } from 'server/config/hostname';
import middleware404 from 'server/middleware-404';
import { createSocketIdentityStore } from 'server/socket-identity';

var cdapConfig,
  securityConfig,
  allowedOrigin = [],
  wsConnections = {},
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
    var sockServer = sockjs.createServer({
      log: function(lvl, msg) {
        log.trace(msg);
      },
    });
    /**
     * Node server now supports Proxy mode. This means, between the client and the node proxy
     * there can be another proxy that handle authentication and pass on the user id and auth token.
     * This means the client will not know anything about the user but the node proxy and the backend
     * will be configured to pass on the auth token and user id from the proxy for authentication.
     *
     * This is the journey of an auth token and user id in proxy mode.
     *
     * 1. CDAP starts in k8s which spins up UI in a pod with
     *    security.authentication.mode: PROXY
     *    security.authentication.proxy.user.identity.header: x-inverting-proxy-user-id
     * 2. Once node proxy goes to PROXY mode, it will get the auth token only for the http
     *    requests.
     * 3. The client will not know about the auth token either.
     * 4. Once the client reaches CDAP UI, the proxy would have already authenticated the user.
     * 5. The request to establish the sockjs session should already have the auth token and the user id
     * 6. We take those values and add to the connection object (sockjs connection object)
     * 7. This then gets picked up at the aggregator module that actually makes the call to the
     *    backend along with these in the request header.
     * 8. Upon receiving the response, we remove these from the request object and send it back
     *    to the client as if no authentication exists.
     *
     * Step 5/6 need one correction versus how this used to work: sockjs sessions aren't only
     * established over a websocket upgrade. Whenever a websocket upgrade isn't available
     * (some corporate proxies, older browsers), sockjs transparently falls back to plain HTTP
     * transports (xhr-streaming, xhr-polling, eventsource, ...), which never fire Node's
     * 'upgrade' event at all. The auth token / user id must therefore be captured per sockjs
     * session id (parsed out of the request URL) rather than in one shared variable -- a shared
     * variable is clobbered by whichever request happens to arrive last, silently binding one
     * user's session to a different, unrelated user's identity (in the fallback-transport case,
     * every single session gets bound this way, since 'upgrade' never fires for them at all).
     */
    const SOCKJS_PREFIX = '/_sock';
    const socketIdentities = createSocketIdentityStore({
      prefix: SOCKJS_PREFIX,
      cdapConfig,
      getAuthHeaderFromRawCookies,
    });

    function isAllowedOrigin(req, allowMissing = false) {
      const origin = req.headers.origin;
      if (!origin) {
        return allowMissing;
      }
      return allowedOrigin.indexOf(origin) !== -1;
    }

    sockServer.on('connection', function(c) {
      if (!c) {
        log.error('Connection requested, but no connection available');
        return;
      }
      log.debug('[SOCKET OPEN] Connection to client "' + c.id + '" opened');
      // @ts-ignore
      var a = new Aggregator(c, { ...cdapConfig, ...securityConfig });
      const identity = socketIdentities.consume(c.url);
      c.authToken = identity.authToken;
      c.userid = identity.userid;
      wsConnections[c.id] = c;
      c.on('close', function() {
        log.debug('Cleaning out aggregator: ' + JSON.stringify(a.connection.id));
        a = null;
        c.end();
        c.destroy();
        delete wsConnections[c.id];
      });
    });

    sockServer.installHandlers(server, { prefix: SOCKJS_PREFIX });
    server.addListener('upgrade', function(req, socket) {
      if (!isAllowedOrigin(req)) {
        log.info('Unknown Origin: ' + req.headers.origin);
        log.info('Denying socket connection and closing the channel');
        socket.end();
        socket.destroy();
        return;
      }
      socketIdentities.capture(req);
    });
    // Non-websocket sockjs transports (xhr-streaming, xhr-polling, eventsource, ...) never
    // fire 'upgrade' -- they're plain HTTP requests, so this is the only place their
    // PROXY-mode identity can be captured. Browsers don't reliably send Origin on
    // same-origin requests, so a missing Origin here is treated as same-origin (matches
    // how these fallback transports actually behave) rather than rejected outright; skip
    // capture (rather than tearing down the socket, which sockjs's own request handling
    // already owns) only for a mismatched, known-cross-origin request.
    server.addListener('request', function(req) {
      if (!isAllowedOrigin(req, true)) {
        return;
      }
      socketIdentities.capture(req);
    });
    function gracefulShutdown() {
      log.info('Caught SIGTERM. Closing http & ws server');
      server.close();
      if (typeof wsConnections === 'object' && Object.keys(wsConnections).length) {
        log.debug(`Closing ${Object.keys(wsConnections).length} open websocket connections`)
        Object.values(wsConnections).forEach((connection) => {
          log.debug('Ending and destroying all graceful shutdown: ' + connection.readyState);
          connection.end();
          connection.destroy();
        });
        log.debug('Closed all open websocket connections');
        wsConnections = {};
      }
      process.exit(0);
    }
    process.on('SIGTERM', gracefulShutdown);
  });
