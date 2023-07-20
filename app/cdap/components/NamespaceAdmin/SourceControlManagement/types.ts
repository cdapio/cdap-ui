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

export interface ISourceControlManagement {
  loading: boolean;
  error: string;
  success: boolean;
  config: ISourceControlManagementConfig;
}

export interface ISourceControlManagementConfig {
  provider: string;
  link: string;
  defaultBranch: string;
  pathPrefix: string;
  auth: ISourceControlManagementAuth;
}

export interface ISourceControlManagementAuth {
  type: string;
  token: string;
  patConfig: ISourceControlManagementAuthPatConfig;
}

export interface ISourceControlManagementAuthPatConfig {
  passwordName: string;
  username?: string;
}
