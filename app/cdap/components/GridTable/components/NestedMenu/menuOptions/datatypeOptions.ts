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
import { DATA_TYPE_LABEL_PREFIX } from 'components/GridTable/components/NestedMenu/menuOptions/constants';
import { TOOLBAR_ICONS_LABEL_ALL_PREFIX } from 'components/GridTable/components/TransformationToolbar/constants';

export const DATATYPE_OPTIONS = [
  {
    value: 'string',
    label: T.translate(`${DATA_TYPE_LABEL_PREFIX}.string`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
  },
  {
    value: 'boolean',
    label: T.translate(`${DATA_TYPE_LABEL_PREFIX}.boolean`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
  },
  {
    value: 'integer',
    label: T.translate(`${DATA_TYPE_LABEL_PREFIX}.integer`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
  },
  {
    value: 'long',
    label: T.translate(`${DATA_TYPE_LABEL_PREFIX}.long`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
  },
  {
    value: 'short',
    label: T.translate(`${DATA_TYPE_LABEL_PREFIX}.short`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
  },
  {
    value: 'float',
    label: T.translate(`${DATA_TYPE_LABEL_PREFIX}.float`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
  },
  {
    value: 'double',
    label: T.translate(`${DATA_TYPE_LABEL_PREFIX}.double`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
  },
  {
    value: 'decimal',
    label: T.translate(`${DATA_TYPE_LABEL_PREFIX}.decimal`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
  },
  {
    value: 'bytes',
    label: T.translate(`${DATA_TYPE_LABEL_PREFIX}.bytes`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
  },
];
