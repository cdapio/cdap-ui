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
import { IValidationErrors, INewReqInputFields } from '../types';
import { I18N_CDF_PREFIX, CDF_ITEMS } from './constants';

interface ICdfInfoProps {
  inputFields: INewReqInputFields;
  broadcastChange: (target: string, value: string) => void;
  validationErrors?: IValidationErrors;
}

const CdfInfo = ({ inputFields, broadcastChange, validationErrors }: ICdfInfoProps) => {
  const { projectName, region, instanceName, instanceUrl, description } = inputFields;
  const values = [projectName, region, instanceName, instanceUrl, description];

  return (
    <NewReqContainer>
      <HeaderTitle>{T.translate(`${I18N_CDF_PREFIX}.title`)}</HeaderTitle>
      <hr />
      {CDF_ITEMS.map((item, idx) => {
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
