/*
 * Copyright © 2023 Cask Data, Inc.
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

import T from 'i18n-react';

const PREFIX = 'features.SourceControlManagement';

export const SCM_AUTH_TYPE_PAT = {
  id: 'PAT',
  label: T.translate(`${PREFIX}.configModal.auth.pat.label`),
};
export const SCM_AUTH_TYPE_HTTP_ACCESS_TOKEN = {
  id: 'HTTP_ACCESS_TOKEN',
  label: T.translate(`${PREFIX}.configModal.auth.httpAccessToken.label`),
};

export const scmAuthType = [SCM_AUTH_TYPE_PAT, SCM_AUTH_TYPE_HTTP_ACCESS_TOKEN];

export const githubOnlyProviders = {
  github: 'GITHUB',
};

export const providers = {
  ...githubOnlyProviders,
  gitlab: 'GITLAB',
  bitbucket: 'BITBUCKET_SERVER',
  bitbucketCloud: 'BITBUCKET_CLOUD',
};

export const authKeys = ['type', 'token'];

export const patConfigKeys = ['passwordName', 'username'];
