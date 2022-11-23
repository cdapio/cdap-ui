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

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.filter';

export const FILTER_TRANSFORMATIONS_MAP = {
  KEEP: {
    EMPTY: 'filter-rows-on condition-false',
    TEXTEXACTLY: 'filter-rows-on regex-not-match',
    TEXTCONTAINS: 'filter-rows-on regex-not-match',
    TEXTSTARTSWITH: 'filter-rows-on condition-false',
    TEXTENDSWITH: 'filter-rows-on condition-false',
    TEXTREGEX: 'filter-rows-on regex-not-match',
    CUSTOMCONDITION: 'filter-rows-on condition-false',
  },
  REMOVE: {
    EMPTY: 'filter-rows-on condition-true',
    TEXTEXACTLY: 'filter-rows-on regex-match',
    TEXTCONTAINS: 'filter-rows-on regex-match',
    TEXTSTARTSWITH: 'filter-rows-on condition-true',
    TEXTENDSWITH: 'filter-rows-on condition-true',
    TEXTREGEX: 'filter-rows-on regex-match',
    CUSTOMCONDITION: 'filter-rows-on condition-true',
  },
};

export const FILTER_RADIO_OPTION = [
  {
    label: `${T.translate(`${PREFIX}.filterRadioOption.keepRow`)}`,
    value: 'KEEP',
  },
  {
    label: `${T.translate(`${PREFIX}.filterRadioOption.removeRow`)}`,
    value: 'REMOVE',
  },
];

export const FILTER_OPTIONS = [
  {
    label: `${T.translate(`${PREFIX}.filterSelectOption.emptyValue`)}`,
    value: 'EMPTY',
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (condition: string, column: string, ignoreCase: boolean, textValue: string) =>
      `${condition} ${column} == null || ${column} =~ "^\\W*$"`,
  },
  {
    label: `${T.translate(`${PREFIX}.filterSelectOption.textExactly`)}`,
    value: 'TEXTEXACTLY',
    isInputRequired: true,
    isCheckboxRequired: true,
    directive: (condition: string, column: string, ignoreCase: boolean, textValue: string) => {
      const customInput = ignoreCase ? `(?i)${textValue}` : textValue;
      return `${condition} ${column} ^${customInput}$`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.filterSelectOption.textContains`)}`,
    value: 'TEXTCONTAINS',
    isInputRequired: true,
    isCheckboxRequired: true,
    directive: (condition: string, column: string, ignoreCase: boolean, textValue: string) => {
      const customInput = ignoreCase ? `(?i)${textValue}` : textValue;
      return `${condition} ${column} .*${customInput}.*`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.filterSelectOption.textStartWith`)}`,
    value: 'TEXTSTARTSWITH',
    isInputRequired: true,
    isCheckboxRequired: true,
    directive: (condition: string, column: string, ignoreCase: boolean, textValue: string) => {
      let configuration = `"${textValue}"`;
      let columnSelected = column;
      if (ignoreCase) {
        columnSelected = `${column}.toLowerCase()`;
        configuration = `"${textValue}".toLowerCase()`;
      }
      return `${condition} ${columnSelected} =^ ${configuration}`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.filterSelectOption.textEndWith`)}`,
    value: 'TEXTENDSWITH',
    isInputRequired: true,
    isCheckboxRequired: true,
    directive: (condition: string, column: string, ignoreCase: boolean, textValue: string) => {
      let configuration = `"${textValue}"`;
      let columnSelected = column;
      if (ignoreCase) {
        columnSelected = `${column}.toLowerCase()`;
        configuration = `"${textValue}".toLowerCase()`;
      }
      return `${condition} ${columnSelected} =$ ${configuration}`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.filterSelectOption.textRegex`)}`,
    value: 'TEXTREGEX',
    isInputRequired: true,
    isCheckboxRequired: false,
    directive: (condition: string, column: string, ignoreCase: boolean, textValue: string) =>
      `${condition} ${column} ${textValue}`,
  },
  {
    label: `${T.translate(`${PREFIX}.filterSelectOption.customCondition`)}`,
    value: 'CUSTOMCONDITION',
    isInputRequired: true,
    isCheckboxRequired: false,
    directive: (condition: string, column: string, ignoreCase: boolean, textValue: string) =>
      `${condition} ${column} ${textValue}`,
  },
];

export const FILTER_PLACEHOLDER = {
  EMPTY: '',
  TEXTEXACTLY: `${T.translate(`${PREFIX}.filterPlaceHolder.textExactly`)}`,
  TEXTCONTAINS: `${T.translate(`${PREFIX}.filterPlaceHolder.textContains`)}`,
  TEXTSTARTSWITH: `${T.translate(`${PREFIX}.filterPlaceHolder.textStartWith`)}`,
  TEXTENDSWITH: `${T.translate(`${PREFIX}.filterPlaceHolder.textEndWith`)}`,
  TEXTREGEX: `${T.translate(`${PREFIX}.filterPlaceHolder.textRegex`)}`,
  CUSTOMCONDITION: `${T.translate(`${PREFIX}.filterPlaceHolder.customCondition`)}`,
};
