/*
 * Copyright © 2022 Cask Data, Inc.
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

export const defaultConnectionPayload = {
  path: '',
  connection: '',
  sampleRequest: {
    properties: {
      format: '',
      fileEncoding: '',
      skipHeader: false,
      enableQuotedValues: false,
      schema: null,
      _pluginName: null,
    },
    limit: 1000,
  },
};

export const defaultErrorOnTransformations = {
  open: false,
  message: '',
};

export const defaultProperties = {
  format: 'csv',
  fileEncoding: 'UTF-8',
  enableQuotedValues: false,
  skipHeader: false,
};
