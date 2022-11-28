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

export const getDirective = (functionName: string, selectedColumnName: string) => {
  if (DATATYPE_OPTIONS.some((eachOption) => eachOption.value === functionName)) {
    return `set-type :${selectedColumnName} ${functionName}`;
  } else if (functionName === 'mask-data-last-4-digit') {
    return maskLast4Digits(selectedColumnName);
  } else if (functionName === 'mask-data-last-2-digit') {
    return maskLast2Digits(selectedColumnName);
  } else if (functionName === 'mask-data-shuffle') {
    return maskByShuffling(selectedColumnName);
  } else {
    return null;
  }
};

const maskByShuffling = (column: string) => {
  return `mask-shuffle :${column}`;
};

const maskLast4Digits = (column: string) => {
  const pattern = maskLastNDigits(column, 4);
  return `mask-number :${column} ${pattern}`;
};
const maskLast2Digits = (column: string) => {
  const pattern = maskLastNDigits(column, 2);
  return `mask-number :${column} ${pattern}`;
};

const maskLastNDigits = (column: string, N: number) => {
  const length = column.length;
  const maskPattern = Array.apply(null, { length: length - N })
    .map(() => 'x')
    .join('');
  const allowPattern = Array.apply(null, { length: N })
    .map(() => '#')
    .join('');

  const pattern = maskPattern + allowPattern;
  return pattern;
};
