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

import T from 'i18n-react';

const PREFIX = 'features.WranglerNewUI.GridPage.transformations.options.labels.column';
export const COLUMN_OPTIONS = [
  {
    value: 'rename',
    label: T.translate(`${PREFIX}.rename`).toString(),
    supportedDataType: ['all'],
  },
  {
    value: 'join-columns',
    label: T.translate(`${PREFIX}.joinTwoColumn`).toString(),
    supportedDataType: ['all'],
  },
  {
    value: 'swap-columns',
    label: T.translate(`${PREFIX}.swapTwoColumn`).toString(),
    supportedDataType: ['all'],
  },
];
