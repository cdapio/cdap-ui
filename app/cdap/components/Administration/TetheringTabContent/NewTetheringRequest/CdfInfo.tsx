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
import Textbox from './Textbox';
import { NewReqContainer, HeaderTitle } from '../shared.styles';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';
const I18N_CDF_PREFIX = `${I18NPREFIX}.CDFInformation`;

const WIDGET_TYPE = 'widget-type';

const ITEMS = [
  {
    properties: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.ProjectName.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.ProjectName.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      'widget-attributes': {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.ProjectName.placeholder`),
      },
    },
  },
  {
    properties: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.Region.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.Region.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      'widget-attributes': {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.Region.placeholder`),
      },
    },
  },
  {
    properties: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.InstanceName.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.InstanceName.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      'widget-attributes': {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.InstanceName.placeholder`),
      },
    },
  },
];

interface ICdfInfoProps {
  projectName?: string;
  region?: string;
  instanceName?: string;
  broadcastChange: (target: string, value: string) => void;
}

const CdfInfo = ({ projectName, region, instanceName, broadcastChange }: ICdfInfoProps) => {
  const values = [projectName, region, instanceName];

  return (
    <NewReqContainer>
      <HeaderTitle>{T.translate(`${I18N_CDF_PREFIX}.title`)}</HeaderTitle>
      <hr />
      {ITEMS.map((item, idx) => (
        <Textbox
          key={idx}
          properties={item.properties}
          value={values[idx]}
          broadcastChange={broadcastChange}
        />
      ))}
    </NewReqContainer>
  );
};

export default CdfInfo;
