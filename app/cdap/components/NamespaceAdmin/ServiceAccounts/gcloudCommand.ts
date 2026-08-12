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
 * Quotes a value for safe use as a single POSIX shell word, so it can't be
 * interpreted as additional shell syntax (metacharacters, command substitution, a
 * new command after a `;`/`&&`/`|`, etc.) no matter what it contains. The
 * `serviceAccount` value this command is built from is stored server-side with no
 * format validation on the create path, so it must be treated as untrusted here.
 */
export const shellQuote = (value: string): string => `'${String(value).replace(/'/g, `'\\''`)}'`;

/**
 * A GCP service account email is the only value the operator is expected to type into
 * the input box. Anything that isn't a well-formed service account email (e.g. a value
 * carrying shell metacharacters) is rejected so it never reaches the generated command.
 * The character classes are deliberately narrow (no spaces, quotes, `;`, `$`, backticks,
 * parentheses, etc.), which also makes shell injection structurally impossible.
 */
export const isValidServiceAccountEmail = (value: string): boolean =>
  /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/i.test(value);

interface IGcloudCommandParams {
  k8sWorkloadIdentityPool?: string;
  identity?: string;
  gsaEmail?: string;
  gsaProjectId?: string;
  k8snamespace?: string;
}

/**
 * Generates the gcloud cli command to add an IAM policy binding. If any of the
 * parameters for the command is not provided when the command is generated, then
 * the user should be able to provide them as environment variables in their shell.
 *
 * @param  tenantProjectId string, defaults to "${TENANT_PROJECT_ID}" so it can be
 *         provided as the environment variable TENANT_PROJECT_ID when
 *         the command is run
 * @param  identity string, defaults to "${IDENTITY}" so that it can be provided as the
 *         environment variable IDENTITY when the command is run
 * @param  gsaEmail string, defaults to "${GSA_EMAIL}" so that it can be provided as the
 *         environment variable GSA_EMAIL when the command is run
 * @return string, the gcloud cli command to run
 */
export const getGcloudCommand = ({
  k8sWorkloadIdentityPool,
  identity,
  gsaEmail,
  gsaProjectId,
  k8snamespace,
}: IGcloudCommandParams): string => {
  // Real values are quoted so they can never break out of their argument position.
  // The "${...}" fallbacks are meant to stay as literal, unquoted shell syntax so the
  // user's own shell substitutes them from an environment variable when they run the
  // command, per this function's own doc comment above.
  const pool = k8sWorkloadIdentityPool
    ? shellQuote(k8sWorkloadIdentityPool)
    : '${TENANT_PROJECT_ID}.svc.id.goog';
  const ns = shellQuote(k8snamespace || 'default');
  const id = identity ? shellQuote(identity) : '${IDENTITY}';
  // Only a well-formed service account email is interpolated; anything else is
  // discarded back to the literal "${GSA_EMAIL}" placeholder.
  const email = gsaEmail && isValidServiceAccountEmail(gsaEmail) ? shellQuote(gsaEmail) : '${GSA_EMAIL}';
  const projectId = gsaProjectId ? shellQuote(gsaProjectId) : '${GSA_PROJECT_ID}';

  // The square brackets around the k8s namespace/identity are escaped so zsh (the
  // default macOS shell) doesn't treat them as a filename-globbing pattern and fail
  // with "no matches found" when the operator copy-pastes the command.
  return `gcloud iam service-accounts add-iam-policy-binding --role roles/iam.workloadIdentityUser --member serviceAccount:${pool}\\[${ns}/${id}\\] ${email} --project ${projectId}`;
};
