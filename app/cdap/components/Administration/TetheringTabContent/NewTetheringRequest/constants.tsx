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

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';
export const I18N_OMNI_PREFIX = `${I18NPREFIX}.OmniNamespaces`;
export const OMNI_NS_COLUMN_TEMPLATE = '50px 4fr 2fr 3fr';
export const OMNI_NS_COLUMN_TEMPLATE_SCROLLABLE = '50px 4fr 2fr 3fr 16px';

export const OMNI_NS_TABLE_HEADERS = [
  {
    label: <StyledCheckbox checked={false} />,
  },
  {
    property: 'namespace',
    label: T.translate(`${I18N_OMNI_PREFIX}.Name.label`),
  },
  {
    property: 'cpuLimit',
    label: T.translate(`${I18N_OMNI_PREFIX}.CpuLimit.label`),
  },
  {
    property: 'memoryLimit',
    label: T.translate(`${I18N_OMNI_PREFIX}.MemoryLimit.label`),
  },
];
