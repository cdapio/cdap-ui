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
import { USING_PATTERN_OPTIONS } from 'components/WranglerGrid/TransformationComponents/PatternExtract/options';
import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';
import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';

export const getDirective = (
  functionName: string,
  selectedColumnName: string,
  transformationComponentValues: ITransformationComponentValues
) => {
  if (DATATYPE_OPTIONS.some((eachOption) => eachOption.value === functionName)) {
    return `set-type :${selectedColumnName} ${functionName}`;
  } else if (functionName === 'extract-using-delimiters') {
    return `split-to-columns :${selectedColumnName} ${
      transformationComponentValues.customInput
        ? transformationComponentValues.customInput
        : transformationComponentValues.radioOption
    }`;
  } else if (functionName === 'extract-using-patterns') {
    const option = USING_PATTERN_OPTIONS?.filter(
      (el) => el.value === transformationComponentValues.extractOptionSelected
    );
    if (option?.length) {
      return option[0].extractDirective(
        selectedColumnName,
        transformationComponentValues.customInput,
        transformationComponentValues.startValue,
        transformationComponentValues.endValue,
        transformationComponentValues.nDigit
      );
    }
  } else {
    return null;
  }
};

export const applyButtonEnabled = (
  functionName: string,
  transformationComponentValues: ITransformationComponentValues,
  selectedColumns: IHeaderNamesList[]
) => {
  if (functionName === 'extract-using-delimiters') {
    if (
      transformationComponentValues.radioOption !== 'customDelimiter' &&
      transformationComponentValues.radioOption == ''
    ) {
      return true;
    } else if (
      transformationComponentValues.radioOption === 'customDelimiter' &&
      transformationComponentValues.customInput === ''
    ) {
      return true;
    } else if (selectedColumns.length === 0) {
      return true;
    } else {
      return false;
    }
  } else if (functionName === 'extract-using-patterns') {
    if (transformationComponentValues.extractOptionSelected == '') {
      return true;
    } else if (
      transformationComponentValues.extractOptionSelected === 'ndigitnumber' &&
      transformationComponentValues.nDigit === ''
    ) {
      return true;
    } else if (
      transformationComponentValues.extractOptionSelected === 'startend' &&
      (transformationComponentValues.startValue === '' ||
        transformationComponentValues.endValue === '')
    ) {
      return true;
    } else if (
      transformationComponentValues.extractOptionSelected === 'custom' &&
      transformationComponentValues.customInput === ''
    ) {
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
