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

import { DATATYPE_OPTIONS } from 'components/WranglerGrid/NestedMenu/menuOptions/datatypeOptions';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';

export const getDirective = (
  functionName: string,
  selectedColumnName: string,
  transformationComponentValues: ITransformationComponentValues
) => {
  if (DATATYPE_OPTIONS.some((eachOption) => eachOption.value === functionName)) {
    return `set-type :${selectedColumnName} ${functionName}`;
  } else if (functionName === 'find-and-replace') {
    const previousValue = transformationComponentValues.exactMatch
      ? `^${transformationComponentValues.findPreviousValue}$`
      : transformationComponentValues.findPreviousValue;
    const updatedNewValue = transformationComponentValues.ignoreCase
      ? `s/${previousValue}/${transformationComponentValues.findReplaceValue}/Ig`
      : `s/${previousValue}/${transformationComponentValues.findReplaceValue}/g`;

    return `find-and-replace :${selectedColumnName} ${updatedNewValue}`;
  } else {
    return null;
  }
};

export const applyButtonEnabled = (
  functionName: string,
  transformationComponentValues: ITransformationComponentValues,
  selectedColumns: IHeaderNamesList[]
) => {
  if (functionName === 'find-and-replace') {
    if (transformationComponentValues.findPreviousValue === '') {
      return true;
    } else if (selectedColumns.length === 0) {
      return true;
    } else {
      return false;
    }
  } else if (selectedColumns.length === 0) {
    return true;
  } else {
    return false;
  }
};
