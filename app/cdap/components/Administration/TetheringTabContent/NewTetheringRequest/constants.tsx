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
import { StyledCheckbox } from '../shared.styles';

export const DEFAULT_NS = 'default';
export const K8S_NS_NAME = 'k8s.namespace';
export const K8S_NS_CPU_LIMITS = 'k8s.namespace.cpu.limits';
export const K8S_NS_MEMORY_LIMITS = 'k8s.namespace.memory.limits';
export const K8S_NS_MEMORY_LIMIT_UNIT = 'Gi';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';
export const I18N_TETHERED_PREFIX = `${I18NPREFIX}.TetheredNamespaces`;
export const I18N_CDF_PREFIX = `${I18NPREFIX}.CDFInformation`;

export const TETHERED_NS_COLUMN_TEMPLATE = '50px 4fr 2fr 3fr';

const WIDGET_TYPE = 'widget-type';
const WIDGET_ATTRIBUTES = 'widget-attributes';

export const TETHERED_NS_TABLE_HEADERS = [
  {
    label: <StyledCheckbox checked={false} />,
  },
  {
    property: 'namespace',
    label: T.translate(`${I18N_TETHERED_PREFIX}.Name.label`),
  },
  {
    property: 'cpuLimit',
    label: T.translate(`${I18N_TETHERED_PREFIX}.CpuLimit.label`),
  },
  {
    property: 'memoryLimit',
    label: T.translate(`${I18N_TETHERED_PREFIX}.MemoryLimit.label`),
  },
];

export const CDF_ITEMS = [
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.ProjectName.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.ProjectName.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      [WIDGET_ATTRIBUTES]: {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.ProjectName.placeholder`),
      },
    },
    pluginProperty: {
      name: `${T.translate(`${I18N_CDF_PREFIX}.ProjectName.name`)}`,
      type: 'string',
      required: true,
    },
  },
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.Region.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.Region.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      [WIDGET_ATTRIBUTES]: {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.Region.placeholder`),
      },
    },
    pluginProperty: {
      name: `${T.translate(`${I18N_CDF_PREFIX}.Region.name`)}`,
      type: 'string',
      required: true,
    },
  },
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.InstanceName.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.InstanceName.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      [WIDGET_ATTRIBUTES]: {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.InstanceName.placeholder`),
      },
    },
    pluginProperty: {
      name: `${T.translate(`${I18N_CDF_PREFIX}.InstanceName.name`)}`,
      type: 'string',
      required: true,
    },
  },
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.InstanceUrl.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.InstanceUrl.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      [WIDGET_ATTRIBUTES]: {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.InstanceUrl.placeholder`),
      },
    },
    pluginProperty: {
      name: `${T.translate(`${I18N_CDF_PREFIX}.InstanceUrl.name`)}`,
      type: 'string',
      required: true,
    },
  },
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.Description.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.Description.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      [WIDGET_ATTRIBUTES]: {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.Description.placeholder`),
        multiline: true,
      },
    },
    pluginProperty: {
      name: `${T.translate(`${I18N_CDF_PREFIX}.Description.name`)}`,
      type: 'string',
    },
  },
];
