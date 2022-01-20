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
import NewReqTextField from './NewReqTextField';
import { NewReqContainer, HeaderTitle } from '../shared.styles';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';
const I18N_OMNI_PREFIX = `${I18NPREFIX}.OmniNamespaces`;

const WIDGET_TYPE = 'widget-type';
const WIDGET_ATTRIBUTES = 'widget-attributes';

const ITEMS = [
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_OMNI_PREFIX}.Name.label`)}`,
      name: `${T.translate(`${I18N_OMNI_PREFIX}.Name.name`)}`,
      [WIDGET_TYPE]: 'textbox',
    },
  },
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_OMNI_PREFIX}.CpuLimit.label`)}`,
      name: `${T.translate(`${I18N_OMNI_PREFIX}.CpuLimit.name`)}`,
      [WIDGET_TYPE]: 'number',
      [WIDGET_ATTRIBUTES]: {
        min: 1,
        max: 100,
      },
    },
  },
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_OMNI_PREFIX}.MemoryLimit.label`)}`,
      name: `${T.translate(`${I18N_OMNI_PREFIX}.MemoryLimit.name`)}`,
      [WIDGET_TYPE]: 'number',
      [WIDGET_ATTRIBUTES]: {
        min: 1,
        max: 100,
      },
    },
  },
];

/*
 * Most of the code in this component will change once the backend server provides resources info
 * about available namespaces when creating new requests. The temp solution is to have users manually
 * enter that information
 */

interface IOmniNamespacesProps {
  name?: string;
  cpuLimit?: string;
  memoryLimit?: string;
  broadcastChange: (target: string, value: string) => void;
}

const OmniNamespaces = ({ name, cpuLimit, memoryLimit, broadcastChange }: IOmniNamespacesProps) => {
  const values = [name, cpuLimit, memoryLimit];

  return (
    <NewReqContainer>
      <HeaderTitle>{T.translate(`${I18N_OMNI_PREFIX}.title`)}</HeaderTitle>
      <hr />
      <span>{T.translate(`${I18N_OMNI_PREFIX}.description`)}</span>
      {ITEMS.map((item, idx) => (
        <NewReqTextField
          key={idx}
          widgetProperty={item.widgetProperty}
          value={values[idx]}
          broadcastChange={broadcastChange}
        />
      ))}
    </NewReqContainer>
  );
};

export default OmniNamespaces;
