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
import { TOOLBAR_ICONS_LABEL_ALL_PREFIX } from 'components/WranglerGrid/TransformationToolbar/constants';
const PREFIX = 'features.WranglerNewUI.GridPage.transformations.options.labels.datatype';
export const DATATYPE_OPTIONS = [
  'string',
  'boolean',
  'integer',
  'long',
  'short',
  'float',
  'double',
  'decimal',
  'bytes',
].map((dataType) => {
  return {
    value: dataType,
    label: T.translate(`${PREFIX}.${dataType}`).toString(),
    supportedDataType: [T.translate(`${TOOLBAR_ICONS_LABEL_ALL_PREFIX}`).toString()],
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382042346/Set+Type+directive',
    description: `Changes the column values to ${dataType} type`,
  };
});

export const FORMAT_OPTIONS = [
  {
    value: 'uppercase',
    description: 'Changes the column values to uppercase.',
    label: 'Uppercase',
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382074887/Change+Case+directive',
    supportedDataType: ['all'],
  },
  {
    value: 'lowercase',
    description: 'Changes the column values to lowercase.',
    label: 'Lowercase',
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382074887/Change+Case+directive',
    supportedDataType: ['all'],
  },
];

export const FUNCTIONS_LIST = [...DATATYPE_OPTIONS, ...FORMAT_OPTIONS];
