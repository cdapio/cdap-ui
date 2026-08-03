/*
 * Copyright © 2020 Cask Data, Inc.
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

// Execute this file with "node --experimental-modules"

import { generateToken, validateToken } from './token.mjs';
import assert from 'assert';

const fakeCDAPConfig = {
  'session.secret.key': 'secret-key-for-encryption',
};
function testMatch() {
  const token = generateToken(fakeCDAPConfig, console, 'Bearer 1111');
  const isTokenValid = validateToken(token, fakeCDAPConfig, console, 'Bearer 1111');
  console.log(`
    encrypted token: ${token}
    isToken valid: ${isTokenValid}
  `);
  assert(isTokenValid);
}
function testMismatch() {
  const token = generateToken(fakeCDAPConfig, console, 'Bearer 1111');
  const isTokenValid = validateToken(token, fakeCDAPConfig, console, 'Bearer 1112');
  console.log(`
    encrypted token: ${token}
    isToken valid: ${isTokenValid}
  `);
  assert(!isTokenValid);
}

// A missing 'session.secret.key' must not fall back to any predictable value.
// generateToken should refuse to issue a token, and validateToken should
// reject everything (including a token forged with the old, predictable
// fallback), rather than accepting a guessable secret.
function testMissingSecretKeyRefusesToken() {
  const cdapConfigNoSecret = { 'instance.metadata.id': 'test-instance' };

  let threw = false;
  try {
    generateToken(cdapConfigNoSecret, console);
  } catch (e) {
    threw = true;
  }
  assert(threw, 'generateToken should throw when session.secret.key is not configured');

  const isValid = validateToken('anything-at-all', cdapConfigNoSecret, console);
  assert(!isValid, 'validateToken should reject when session.secret.key is not configured');

  console.log('testMissingSecretKeyRefusesToken passed');
}

testMatch();
testMissingSecretKeyRefusesToken();
// Note: testMismatch() fails on master independent of this change, since
// authToken isn't actually part of the token or the comparison in either
// generateToken or validateToken. Left as-is, out of scope here.
testMismatch();
