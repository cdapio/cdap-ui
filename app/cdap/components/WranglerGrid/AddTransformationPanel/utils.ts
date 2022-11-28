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

import { DECODE, ENCODE } from 'components/WranglerGrid/AddTransformationPanel/constants';
import { IMenuItem } from 'components/WranglerGrid/NestedMenu/MenuItemComponent';
import { DATATYPE_OPTIONS } from 'components/WranglerGrid/NestedMenu/menuOptions/datatypeOptions';
import { SECURITY_OPTIONS } from 'components/WranglerGrid/NestedMenu/menuOptions/securityOptions';

export const getDirective = (functionName: string, selectedColumnName: string) => {
  const encodeDecodeOptions: IMenuItem[] = [];
  SECURITY_OPTIONS.forEach((eachSecurityOption: IMenuItem) => {
    if (eachSecurityOption.value === ENCODE || eachSecurityOption.value === DECODE) {
      encodeDecodeOptions.push(...eachSecurityOption.options);
    }
  });
  if (DATATYPE_OPTIONS.some((eachOption) => eachOption.value === functionName)) {
    return `set-type :${selectedColumnName} ${functionName}`;
  } else if (
    encodeDecodeOptions.some(
      (eachEncodeDecodeOption: IMenuItem) => eachEncodeDecodeOption.value === functionName
    )
  ) {
    const option: IMenuItem = encodeDecodeOptions.find(
      (eachEncodeDecodeOption: IMenuItem) => eachEncodeDecodeOption.value === functionName
    );
    if (option) {
      return option.directive(selectedColumnName);
    }
  } else {
    return null;
  }
};
