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

const directive = 'send-to-error';

const conditionToFnMap = {
  ISNUMBER: 'isNumber',
  ISINTEGER: 'isInteger',
  ISDOUBLE: 'isDouble',
  ISBOOLEAN: 'isBoolean',
  ISDATE: 'isDate',
  ISTIME: 'isTime',
  ISDATEFORMAT: 'isDate',
  ISIP: 'isIP',
  ISIPV4: 'isIPv4',
  ISIPV6: 'isIPv6',
  ISEMAIL: 'isEmail',
  ISURL: 'isUrl',
  ISDOMAINNAME: 'isDomainName',
  ISDOMAINTLD: 'isDomainTld',
  ISGENERICTLD: 'isGenericTld',
  ISCOUNTRYTLD: 'isCountryTld',
  ISISBN: 'isISBN',
  ISISBN10: 'isISBN10',
  ISISBN13: 'isISBN13',
  ISCREDITCARD: 'isCreditCard',
  ISAMEXCARD: 'isAmex',
  ISVISACARD: 'isVisa',
  ISMASTERCARD: 'isMaster',
  ISDINERCARD: 'isDiner',
  ISVPAYCARD: 'isVPay',
};

const getDQFunction = (condition) => {
  const c = condition.replace('NOT', '');
  return conditionToFnMap[c];
};

const dqFunctions = Object.keys(conditionToFnMap).reduce((prev, curr) => {
  const condition = curr.replace(/IS|ISNOT/, '');
  return [...prev, `IS${condition}`, `ISNOT${condition}`];
}, []);

const otherOptionsDirective = (column: string, filterAction: string) => {
  if (dqFunctions.indexOf(filterAction) !== -1) {
    let condition = `dq:${getDQFunction(filterAction)}(${column})`;
    if (filterAction.indexOf('NOT') !== -1) {
      condition = `!${condition}`;
    }
    return `${directive} ${condition}`;
  }
};

const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.sendToError';

export const SEND_TO_ERROR_PLACEHOLDER = {
  EMPTY: '',
  TEXTEXACTLY: `${T.translate(`${PREFIX}.optionPlaceHolder.textExactly`)}`,
  TEXTCONTAINS: `${T.translate(`${PREFIX}.optionPlaceHolder.textContains`)}`,
  TEXTSTARTSWITH: `${T.translate(`${PREFIX}.optionPlaceHolder.textStartWith`)}`,
  TEXTENDSWITH: `${T.translate(`${PREFIX}.optionPlaceHolder.textEndWith`)}`,
  TEXTREGEX: `${T.translate(`${PREFIX}.optionPlaceHolder.textRegex`)}`,
  CUSTOMCONDITION: `${T.translate(`${PREFIX}.optionPlaceHolder.customCondition`)}`,
  ISDATEFORMAT: `${T.translate(`${PREFIX}.optionPlaceHolder.textDate`)}`,
  ISNOTDATEFORMAT: `${T.translate(`${PREFIX}.optionPlaceHolder.textDate`)}`,
};

export const SEND_TO_ERROR_OPTIONS = [
  {
    label: `${T.translate(`${PREFIX}.optionLabels.emptyValue`)}`,
    value: `EMPTY`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => `${directive} empty(${column})`,
  },

  {
    label: `${T.translate(`${PREFIX}.optionLabels.textExactly`)}`,
    value: `TEXTEXACTLY`,
    isInputRequired: true,
    isCheckboxRequired: true,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => {
      let equalityOperator = `==`;
      let textValue = inputValue;
      if (ignoreCase) {
        textValue = `(?i)${inputValue}`;
        equalityOperator = `=~`;
      }
      return `${directive} ${column} ${equalityOperator} "${textValue}"`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.textContains`)}`,
    value: `TEXTCONTAINS`,
    isInputRequired: true,
    isCheckboxRequired: true,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => {
      let textValue = inputValue;
      if (ignoreCase) {
        textValue = `(?i).*${textValue}`;
      } else {
        textValue = `.*${textValue}`;
      }
      return `${directive} ${column} =~ "${textValue}.*"`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.textStartWith`)}`,
    value: `TEXTSTARTSWITH`,
    isInputRequired: true,
    isCheckboxRequired: true,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => {
      let equalityOperator = `=^`;
      let textValue = inputValue;
      if (ignoreCase) {
        textValue = `(?i)^${textValue}.*`;
        equalityOperator = `=~`;
      }
      return `${directive} ${column} ${equalityOperator} "${textValue}"`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.textEndWith`)}`,
    value: `TEXTENDSWITH`,
    isInputRequired: true,
    isCheckboxRequired: true,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => {
      let equalityOperator = `=$`;
      let textValue = inputValue;
      if (ignoreCase) {
        textValue = `(?i).*${textValue}$`;
        equalityOperator = `=~`;
      }
      return `${directive} ${column} ${equalityOperator} "${textValue}"`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.textRegex`)}`,
    value: `TEXTREGEX`,
    isInputRequired: true,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => `${directive} ${column} =~ "${inputValue}"`,
  },

  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNumber`)}`,
    value: `ISNUMBER`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotNumber`)}`,
    value: `ISNOTNUMBER`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isDouble`)}`,
    value: `ISDOUBLE`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotDouble`)}`,
    value: `ISNOTDOUBLE`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isInteger`)}`,
    value: `ISINTEGER`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotInteger`)}`,
    value: `ISNOTINTEGER`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isBoolean`)}`,
    value: `ISBOOLEAN`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotBoolean`)}`,
    value: `ISNOTBOOLEAN`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isDate`)}`,
    value: `ISDATE`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotDate`)}`,
    value: `ISNOTDATE`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isDateFormat`)}`,
    value: `ISDATEFORMAT`,
    isInputRequired: true,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => {
      let condition = `dq:${getDQFunction(filterAction)}(${column}, "${inputValue}")`;
      if (filterAction.indexOf(`NOT`) !== -1) {
        condition = `!${condition}`;
      }
      return `${directive} ${condition}`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotDateFormat`)}`,
    value: `ISNOTDATEFORMAT`,
    isInputRequired: true,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => {
      let condition = `dq:${getDQFunction(filterAction)}(${column}, "${inputValue}")`;
      if (filterAction.indexOf(`NOT`) !== -1) {
        condition = `!${condition}`;
      }
      return `${directive} ${condition}`;
    },
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isTime`)}`,
    value: `ISTIME`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotTime`)}`,
    value: `ISNOTTIME`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isIP`)}`,
    value: `ISIP`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotIP`)}`,
    value: `ISNOTIP`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isIPV4`)}`,
    value: `ISIPV4`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotIPV4`)}`,
    value: `ISNOTIPV4`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isIPV6`)}`,
    value: `ISIPV6`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotIPV6`)}`,
    value: `ISNOTIPV6`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isEmail`)}`,
    value: `ISEMAIL`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotEmail`)}`,
    value: `ISNOTEMAIL`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isURL`)}`,
    value: `ISURL`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotURL`)}`,
    value: `ISNOTURL`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isDomain`)}`,
    value: `ISDOMAINNAME`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotDomain`)}`,
    value: `ISNOTDOMAINNAME`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isDomainTLD`)}`,
    value: `ISDOMAINTLD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotDomainTLD`)}`,
    value: `ISNOTDOMAINTLD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isGenericTLD`)}`,
    value: `ISGENERICTLD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotGenericTLD`)}`,
    value: `ISNOTGENERICTLD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isCountryTLD`)}`,
    value: `ISCOUNTRYTLD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotCountryTLD`)}`,
    value: `ISNOTCOUNTRYTLD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isValueISBN`)}`,
    value: `ISISBN`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isValueNotISBN`)}`,
    value: `ISNOTISBN`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isValueISBN10`)}`,
    value: `ISISBN10`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isValueNotISBN10`)}`,
    value: `ISNOTISBN10`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isValueISBN13`)}`,
    value: `ISISBN13`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isValueNotISBN13`)}`,
    value: `ISNOTISBN13`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isCreditCard`)}`,
    value: `ISCREDITCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotCreditCard`)}`,
    value: `ISNOTCREDITCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isAmericanExpressCard`)}`,
    value: `ISAMEXCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotAmericanExpressCard`)}`,
    value: `ISNOTAMEXCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isVisaCard`)}`,
    value: `ISVISACARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotVisaCard`)}`,
    value: `ISNOTVISACARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isMasterCard`)}`,
    value: `ISMASTERCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotMasterCard`)}`,
    value: `ISNOTMASTERCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isDinerCard`)}`,
    value: `ISDINERCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotDinerCard`)}`,
    value: `ISNOTDINERCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isVPayCard`)}`,
    value: `ISVPAYCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.isNotVPayCard`)}`,
    value: `ISNOTVPAYCARD`,
    isInputRequired: false,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => otherOptionsDirective(column, filterAction),
  },
  {
    label: `${T.translate(`${PREFIX}.optionLabels.customCondition`)}`,
    value: `CUSTOMCONDITION`,
    isInputRequired: true,
    isCheckboxRequired: false,
    directive: (
      directive: string,
      column: string,
      ignoreCase: boolean,
      inputValue: string,
      filterAction?: string
    ) => `${directive} ${inputValue}`,
  },
];
