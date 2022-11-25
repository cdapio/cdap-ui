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

const PREFIX = 'features.WranglerNewUI.ColumnInsights.options';

export const DATATYPE_OPTIONS = [
  {
    value: 'string',
    label: T.translate(`${PREFIX}.labelString`).toString(),
  },
  {
    value: 'boolean',
    label: T.translate(`${PREFIX}.labelBoolean`).toString(),
  },
  {
    value: 'int',
    label: T.translate(`${PREFIX}.labelInteger`).toString(),
  },
  {
    value: 'long',
    label: T.translate(`${PREFIX}.labelLong`).toString(),
  },
  {
    value: 'short',
    label: T.translate(`${PREFIX}.labelShort`).toString(),
  },
  {
    value: 'float',
    label: T.translate(`${PREFIX}.labelFloat`).toString(),
  },
  {
    value: 'double',
    label: T.translate(`${PREFIX}.labelDouble`).toString(),
  },
  {
    value: 'decimal',
    label: T.translate(`${PREFIX}.labelDecimal`).toString(),
  },
  {
    value: 'bytes',
    label: T.translate(`${PREFIX}.labelBytes`).toString(),
  },
];
