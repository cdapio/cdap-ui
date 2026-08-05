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

import { getSockjsSessionId, createSocketIdentityStore } from 'server/socket-identity';

describe('getSockjsSessionId', () => {
  test('extracts the session id from a sockjs transport URL', () => {
    expect(getSockjsSessionId('/_sock', '/_sock/000/abc123/websocket')).toBe('abc123');
    expect(getSockjsSessionId('/_sock', '/_sock/000/abc123/xhr_streaming')).toBe('abc123');
  });

  test('returns null for URLs outside the sockjs prefix', () => {
    expect(getSockjsSessionId('/_sock', '/api/v3/namespaces')).toBeNull();
    expect(getSockjsSessionId('/_sock', null)).toBeNull();
  });
});

describe('createSocketIdentityStore', () => {
  const cdapConfig = { 'security.authentication.proxy.user.identity.header': 'x-identity-id' };
  const getAuthHeaderFromRawCookies = (req) => req.headers.authorization || '';

  function makeStore() {
    return createSocketIdentityStore({ prefix: '/_sock', cdapConfig, getAuthHeaderFromRawCookies });
  }

  test('binds a session to the identity captured from its own request', () => {
    const store = makeStore();
    store.capture({
      url: '/_sock/000/mysession/websocket',
      headers: { authorization: 'Bearer real-token', 'x-identity-id': 'real-user' },
    });

    const identity = store.consume('/_sock/000/mysession/websocket');
    expect(identity.authToken).toBe('Bearer real-token');
    expect(identity.userid).toBe('real-user');
  });

  // Regression test for the underlying bug: server.js used to keep a single
  // shared `authToken`/`userid` variable, set inside the raw http 'upgrade'
  // listener and read back inside sockjs's 'connection' handler. Because
  // that state was shared across every in-flight session rather than scoped
  // per session, a second, unrelated user's request could silently
  // overwrite it before the first user's connection ever read it back --
  // and any session established over a non-websocket transport (which never
  // fires 'upgrade' at all) always read back whatever was last left behind
  // by someone else's websocket connection.
  test('does not leak one session identity into a concurrently-captured session', () => {
    const store = makeStore();

    // victim (e.g. an admin) starts a session
    store.capture({
      url: '/_sock/000/victim-session/websocket',
      headers: { authorization: 'Bearer VICTIM-ADMIN-TOKEN', 'x-identity-id': 'victim-admin' },
    });
    // before the victim's 'connection' event is processed, an unrelated,
    // concurrently-connecting user's request arrives (this is exactly what
    // used to clobber the old shared variable)
    store.capture({
      url: '/_sock/000/attacker-session/xhr_streaming',
      headers: { authorization: 'Bearer ATTACKER-TOKEN', 'x-identity-id': 'attacker-lowpriv' },
    });

    const victimIdentity = store.consume('/_sock/000/victim-session/websocket');
    const attackerIdentity = store.consume('/_sock/000/attacker-session/xhr_streaming');

    expect(victimIdentity.userid).toBe('victim-admin');
    expect(victimIdentity.authToken).toBe('Bearer VICTIM-ADMIN-TOKEN');
    expect(attackerIdentity.userid).toBe('attacker-lowpriv');
    expect(attackerIdentity.authToken).toBe('Bearer ATTACKER-TOKEN');
  });

  test('a session with no matching capture (e.g. non-sockjs URL) consumes to an empty identity', () => {
    const store = makeStore();
    expect(store.consume('/_sock/000/never-captured/websocket')).toEqual({});
  });

  test('consuming a session removes it, so it cannot be read twice', () => {
    const store = makeStore();
    store.capture({
      url: '/_sock/000/onceonly/websocket',
      headers: { authorization: 'Bearer t', 'x-identity-id': 'u' },
    });
    store.consume('/_sock/000/onceonly/websocket');
    expect(store.consume('/_sock/000/onceonly/websocket')).toEqual({});
  });
});
