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

export const getDirective = (
  functionName: string,
  selectedColumnName: string,
  transformationComponentValues: ITransformationComponentValues
) => {
  if (DATATYPE_OPTIONS.some((eachOption) => eachOption.value === functionName)) {
    return `set-type :${selectedColumnName} ${functionName}`;
  } else if (functionName == 'replace-null-missing') {
    return `fill-null-or-empty :${selectedColumnName} '${transformationComponentValues.customInput}'`;
  } else if (functionName === 'remove-null-missing') {
    return `filter-rows-on condition-true ${selectedColumnName} == null || ${selectedColumnName} =~ "^\\W*$"`;
  } else if (functionName === 'remove-null') {
    return `filter-rows-on condition-true ${selectedColumnName} == null`;
  } else if (functionName === 'remove-missing') {
    return `filter-rows-on condition-true ${selectedColumnName} =~ "^\\W*$"`;
  } else {
    return null;
  }
};
