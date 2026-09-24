/*
 * Copyright © 2026 Cask Data, Inc.
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

/**
 * In PROXY authentication mode, the auth token / user id for a sockjs
 * session need to be captured from the raw HTTP request that establishes
 * that session (see server.js for the full journey). A sockjs session isn't
 * always established over a websocket upgrade though: whenever a websocket
 * upgrade isn't available (some corporate proxies, older browsers), sockjs
 * transparently falls back to plain HTTP transports (xhr-streaming,
 * xhr-polling, eventsource, ...), which never fire Node's 'upgrade' event.
 *
 * This store keys captured identities by sockjs session id (parsed out of
 * the request URL) instead of a single shared variable, since a shared
 * variable gets clobbered by whichever request happens to arrive last --
 * silently binding one user's session to a different, unrelated user's
 * identity.
 */

/**
 * @param {string} prefix sockjs mount prefix, e.g. '/_sock'
 * @param {string} url request URL, shaped /<prefix>/<server>/<session>/<transport>[/...]
 * @returns {string|null} the sockjs session id, or null if the URL isn't a sockjs request
 */
export function getSockjsSessionId(prefix, url) {
  if (!url || url.indexOf(prefix + '/') !== 0) {
    return null;
  }
  const parts = url.slice(prefix.length + 1).split('/');
  return parts.length >= 2 && parts[1] ? parts[1] : null;
}

/**
 * @param {object} opts
 * @param {string} opts.prefix sockjs mount prefix, e.g. '/_sock'
 * @param {object} opts.cdapConfig
 * @param {(req: object) => string} opts.getAuthHeaderFromRawCookies
 * @param {number} [opts.ttlMs] how long a captured identity survives if the session never connects
 */
export function createSocketIdentityStore({ prefix, cdapConfig, getAuthHeaderFromRawCookies, ttlMs = 60000 }) {
  const pending = new Map();

  /**
   * Call for every request that might be starting/continuing a sockjs session.
   * Long-lived polling transports call this repeatedly (once per poll) for the same
   * session id, so each call clears the previous entry's timer before scheduling a new
   * one -- otherwise an earlier, still-pending timer can delete a later, unconsumed entry.
   */
  function capture(req) {
    const sessionId = getSockjsSessionId(prefix, req.url);
    if (!sessionId) {
      return;
    }
    const existing = pending.get(sessionId);
    if (existing) {
      clearTimeout(existing.timer);
    }
    req.headers.authorization = getAuthHeaderFromRawCookies(req);
    const userIdProperty = cdapConfig['security.authentication.proxy.user.identity.header'];
    const timer = setTimeout(() => pending.delete(sessionId), ttlMs);
    if (typeof timer.unref === 'function') {
      timer.unref();
    }
    pending.set(sessionId, {
      authToken: req.headers.authorization,
      userid: req.headers[userIdProperty],
      timer,
    });
  }

  /** Call once a sockjs 'connection' fires, with that connection's own url. */
  function consume(url) {
    const sessionId = getSockjsSessionId(prefix, url);
    if (!sessionId) {
      return {};
    }
    const identity = pending.get(sessionId);
    if (!identity) {
      return {};
    }
    clearTimeout(identity.timer);
    pending.delete(sessionId);
    return { authToken: identity.authToken, userid: identity.userid };
  }

  return { capture, consume };
}
