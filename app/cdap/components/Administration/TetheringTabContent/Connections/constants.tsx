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

import React from 'react';
import T from 'i18n-react';
import { StyledIcon } from '../shared.styles';

export const PREFIX = 'features.Administration.Tethering';
export const DESC_COLUMN_TEMPLATE = '50px 7fr 3fr 1fr';

export const ICONS = {
  active: {
    name: 'icon-check-circle',
    color: 'var(--green)',
  },
  inactive: {
    name: 'icon-times-circle',
    color: 'var(--red)',
  },
  header: {
    name: 'icon-circle',
    color: 'var(--grey05)',
  },
  default: {
    name: 'icon-circle',
    color: 'black',
  },
};

export const CONNECTIONS_TABLE_HEADERS = [
  {
    label: <StyledIcon name={ICONS.header.name} color={ICONS.header.color} />,
  },
  {
    property: 'gcp',
    label: T.translate(`${PREFIX}.ColumnHeaders.gcp`),
  },
  {
    property: 'instanceName',
    label: T.translate(`${PREFIX}.ColumnHeaders.instanceName`),
  },
  {
    property: 'region',
    label: T.translate(`${PREFIX}.ColumnHeaders.region`),
  },
  {
    property: 'omniNamespace',
    label: T.translate(`${PREFIX}.ColumnHeaders.omniNamespace`),
  },
  {
    property: 'pods',
    label: T.translate(`${PREFIX}.ColumnHeaders.pods`),
  },
  {
    property: 'cpu',
    label: T.translate(`${PREFIX}.ColumnHeaders.cpu`),
  },
  {
    property: 'memory',
    label: T.translate(`${PREFIX}.ColumnHeaders.memory`),
  },
  {
    label: '',
  },
];
