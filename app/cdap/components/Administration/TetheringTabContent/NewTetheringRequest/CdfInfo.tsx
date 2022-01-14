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
import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';
const I18N_CDF_PREFIX = `${I18NPREFIX}.CDFInformation`;

const WIDGET_TYPE = 'widget-type';
const WIDGET_ATTRIBUTES = 'widget-attributes';

const ITEMS = [
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.ProjectName.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.ProjectName.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      WIDGET_ATTRIBUTES: {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.ProjectName.placeholder`),
      },
    },
    pluginProperty: {
      type: 'string',
      required: true,
    },
  },
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.Region.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.Region.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      WIDGET_ATTRIBUTES: {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.Region.placeholder`),
      },
    },
    pluginProperty: {
      type: 'string',
      required: true,
    },
  },
  {
    widgetProperty: {
      label: `${T.translate(`${I18N_CDF_PREFIX}.InstanceName.label`)}`,
      name: `${T.translate(`${I18N_CDF_PREFIX}.InstanceName.name`)}`,
      [WIDGET_TYPE]: 'textbox',
      WIDGET_ATTRIBUTES: {
        placeholder: T.translate(`${I18N_CDF_PREFIX}.InstanceName.placeholder`),
      },
    },
    pluginProperty: {
      type: 'string',
      required: true,
    },
  },
];

interface ICdfInfoProps {
  projectName?: string;
  region?: string;
  instanceName?: string;
  broadcastChange: (target: string, value: string) => void;
  validationErrors?: {
    instanceName?: IErrorObj;
    projectName?: IErrorObj;
    region?: IErrorObj;
  };
}

const CdfInfo = ({
  projectName,
  region,
  instanceName,
  broadcastChange,
  validationErrors,
}: ICdfInfoProps) => {
  const values = [projectName, region, instanceName];

  return (
    <NewReqContainer>
      <HeaderTitle>{T.translate(`${I18N_CDF_PREFIX}.title`)}</HeaderTitle>
      <hr />
      {ITEMS.map((item, idx) => {
        const errArr = [];
        if (
          validationErrors.hasOwnProperty(item.widgetProperty.name) &&
          Boolean(Object.keys(validationErrors[item.widgetProperty.name]).length)
        ) {
          errArr.push(validationErrors[item.widgetProperty.name]);
        }

        return (
          <NewReqTextField
            key={idx}
            widgetProperty={item.widgetProperty}
            pluginProperty={item.pluginProperty}
            value={values[idx]}
            errors={errArr}
            broadcastChange={broadcastChange}
          />
        );
      })}
    </NewReqContainer>
  );
};

export default CdfInfo;
