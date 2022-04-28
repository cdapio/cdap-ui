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
import { IValidationErrors } from './types';
import { K8S_NS_MEMORY_LIMIT_UNIT } from './NewTetheringRequest/constants';

const I18NPREFIX = 'features.Administration.Tethering.CreateRequest';
const SCROLLER_WIDTH = '16px';
/**
 * Function to ensure all user provided inputs are valid before submitting new thethering request
 *
 * @param selectedNamespaces - list of selected namespaces by user (at least one is required)
 * @param inputFields - user provided values for cdf information
 * @returns { [{object}], boolean } - list of error objects to update UI with errors and whether all checks passed
 */
export const areInputsValid = ({ selectedNamespaces, inputFields }) => {
  const requiredFields = [
    { name: 'namespaces', val: selectedNamespaces.length },
    { name: 'projectName', val: inputFields.projectName },
    { name: 'region', val: inputFields.region },
    { name: 'instanceName', val: inputFields.instanceName },
    { name: 'instanceUrl', val: inputFields.instanceUrl },
  ];
  let allValid = true;
  const errors = {} as IValidationErrors;

  requiredFields.forEach((field) => {
    let errObj = {};
    if (!field.val) {
      const msg =
        field.name === 'namespaces'
          ? T.translate(`${I18NPREFIX}.nsValidationError`)
          : T.translate(`${I18NPREFIX}.inputValidationError`, { fieldName: field.name });
      errObj = {
        msg,
      };
      allValid = false;
    }
    errors[field.name] = errObj;
  });

  return { errors, allValid };
};

export const getScrollableColTemplate = (template: string) => `${template} ${SCROLLER_WIDTH}`;

export const trimMemoryLimit = (limit) => {
  return limit ? limit.toString().slice(0, -K8S_NS_MEMORY_LIMIT_UNIT.length) : '';
};
