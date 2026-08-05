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

import { execSync } from 'child_process';
import { getGcloudCommand, shellQuote } from 'components/NamespaceAdmin/ServiceAccounts/gcloudCommand';

describe('shellQuote', () => {
  // Round-trips a set of values through a real shell (printf) to confirm the
  // quoted form is both safe (no injected command runs) and lossless (the shell
  // sees exactly the original string as data, not as executed syntax).
  test('round-trips arbitrary values through a real shell unexecuted', () => {
    const values = [
      'x@x.iam.gserviceaccount.com; touch /tmp/should-not-exist; echo done',
      '$(touch /tmp/should-not-exist)',
      '`touch /tmp/should-not-exist`',
      "a'; touch /tmp/should-not-exist; echo '",
      'a && touch /tmp/should-not-exist',
      'plain-safe-value',
    ];

    for (const value of values) {
      const quoted = shellQuote(value);
      const out = execSync(`printf '%s' ${quoted}`).toString();
      expect(out).toBe(value);
    }
  });
});

describe('getGcloudCommand', () => {
  // Regression test: gsaEmail (sourced from the stored, server-side-unvalidated
  // "serviceAccount" value) used to be interpolated into the generated command with
  // no quoting at all, so a value containing shell metacharacters would execute as
  // additional commands if an admin copy-pasted the generated string into a
  // terminal, per the component's own "copy to clipboard" affordance.
  test('a malicious gsaEmail cannot inject additional shell commands', () => {
    const command = getGcloudCommand({
      identity: 'my-namespace-identity',
      gsaEmail: 'x@x.iam.gserviceaccount.com; touch /tmp/should-not-exist; echo pwned',
      k8snamespace: 'default',
      k8sWorkloadIdentityPool: 'example-project.svc.id.goog',
    });

    let threw = false;
    try {
      execSync(command, { stdio: 'pipe' });
    } catch (e) {
      // gcloud isn't installed in the test environment -- that's expected and fine,
      // what matters is that nothing after it ran as a separate command.
      threw = true;
    }
    expect(threw).toBe(true);

    const fs = require('fs');
    expect(fs.existsSync('/tmp/should-not-exist')).toBe(false);
  });

  test('unsupplied parameters keep their literal, shell-expandable placeholder form', () => {
    const command = getGcloudCommand({});
    expect(command).toContain('${TENANT_PROJECT_ID}');
    expect(command).toContain('${IDENTITY}');
    expect(command).toContain('${GSA_EMAIL}');
    expect(command).toContain('${GSA_PROJECT_ID}');
  });

  test('supplied parameters are individually quoted in the --member value', () => {
    const command = getGcloudCommand({
      identity: 'my-identity',
      k8snamespace: 'my-ns',
      k8sWorkloadIdentityPool: 'my-pool',
    });
    expect(command).toContain("--member serviceAccount:'my-pool'['my-ns'/'my-identity']");
  });
});
