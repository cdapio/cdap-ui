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

export const USING_PATTERN_OPTIONS = [
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.creditCard'
    )}`,
    patternName: `((?:\\d{4}[-\\s]?){4})`,
    value: 'creditcard',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) => `extract-regex-groups :${column} ((?:\\d{4}[-\\s]?){4})`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.date'
    )}`,
    patternName: `((?:(?:\\d{4}|\\d{2})(?:(?:[.,]\\s)|[-\/.\\s])(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{1,2}))|(?:(?:(?:\\d{1,2})(?:(?:[.,]\\s)|[-\/.\\s])(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))|(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{1,2}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{4}|\\d{2})))`,
    value: 'date',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) =>
      `extract-regex-groups :${column} ((?:(?:\\d{4}|\\d{2})(?:(?:[.,]\\s)|[-\/.\\s])(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{1,2}))|(?:(?:(?:\\d{1,2})(?:(?:[.,]\\s)|[-\/.\\s])(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))|(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{1,2}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{4}|\\d{2})))`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.dateTime'
    )}`,
    patternName: `((?:(?:(?:\\d{4}|\\d{2})(?:(?:[.,]\\s)|[-\/.\\s])(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{1,2}))|(?:(?:(?:\\d{1,2})(?:(?:[.,]\\s)|[-\/.\\s])(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))|(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{1,2}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{4}|\\d{2})))[T\\s](?:(?:(?:2[0-3])|(?:[01]?\\d))[h:\\s][0-5]\\d(?::(?:(?:[0-5]\\d)|(?:60)))?(?:\\s[aApP][mM])?(?:Z|(?:[+-](?:1[0-2])|(?:0?\\d):[0-5]\\d)|(?:\\s[[a-zA-Z]\\s]+))?))`,
    value: 'datetime',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) =>
      `extract-regex-groups :${column} ((?:(?:(?:\\d{4}|\\d{2})(?:(?:[.,]\\s)|[-\/.\\s])(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{1,2}))|(?:(?:(?:\\d{1,2})(?:(?:[.,]\\s)|[-\/.\\s])(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))|(?:(?:1[0-2])|(?:0?\\d)|(?:[a-zA-Z]{3}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{1,2}))(?:(?:[.,]\\s)|[-\/.\\s])(?:\\d{4}|\\d{2})))[T\\s](?:(?:(?:2[0-3])|(?:[01]?\\d))[h:\\s][0-5]\\d(?::(?:(?:[0-5]\\d)|(?:60)))?(?:\\s[aApP][mM])?(?:Z|(?:[+-](?:1[0-2])|(?:0?\\d):[0-5]\\d)|(?:\\s[[a-zA-Z]\\s]+))?))`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.email'
    )}`,
    patternName: `([a-zA-Z0-9!#$%&*+/=?^_\`'{|}~-]+@(?!.*\\.{2})[a-zA-Z0-9\\.-]+(?:\\.[a-zA-Z]{2,6})?)`,
    value: 'email',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) =>
      `extract-regex-groups :${column} ([a-zA-Z0-9!#$%&*+/=?^_\`'{|}~-]+@(?!.*\\.{2})[a-zA-Z0-9\\.-]+(?:\\.[a-zA-Z]{2,6})?)`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.urlAnchor'
    )}`,
    patternName: `<[aA](?:\\s+[a-zA-Z]+=".*?")*\\s+[hH][rR][eE][fF]="(.*?)"(?:\\s+[a-zA-Z]+=".*?")*>(?:.*)<\/[aA]>`,
    value: 'htmlhyperlink',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) =>
      `extract-regex-groups :${column} <[aA](?:\\s+[a-zA-Z]+=".*?")*\\s+[hH][rR][eE][fF]="(.*?)"(?:\\s+[a-zA-Z]+=".*?")*>(?:.*)<\/[aA]>`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.ip4Address'
    )}`,
    patternName: `((?:(?:0|(?:25[0-5])|(?:2[0-4][1-9])|(?:1\\d\\d)|(?:[1-9]\\d?))\\.){3}(?:(?:0|(?:25[0-5])|(?:2[0-4][1-9])|(?:1\\d\\d)|(?:[1-9]\\d?))))`,
    value: 'ipv4',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) =>
      `extract-regex-groups :${column} ((?:(?:0|(?:25[0-5])|(?:2[0-4][1-9])|(?:1\\d\\d)|(?:[1-9]\\d?))\\.){3}(?:(?:0|(?:25[0-5])|(?:2[0-4][1-9])|(?:1\\d\\d)|(?:[1-9]\\d?))))`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.isbnCode'
    )}`,
    patternName: `((?:97[89]-?)?(?:\\d-?){9}[\\dxX])`,
    value: 'isbncodes',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) => `extract-regex-groups :${column} ((?:97[89]-?)?(?:\\d-?){9}[\\dxX])`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.macAddress'
    )}`,
    patternName: `((?:\\p{XDigit}{2}[:-]){5}(?:\\p{XDigit}{2}))`,
    value: 'macaddress',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) => `extract-regex-groups :${column} ((?:\\p{XDigit}{2}[:-]){5}(?:\\p{XDigit}{2}))`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.ndigitnumber'
    )}`,
    patternName: null,
    value: 'ndigitnumber',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) => `extract-regex-groups :${column} (\\d{${nDigit}})`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.usPhone'
    )}`,
    patternName: `((?:\\+\\d{1,3}[\\s-]?)?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4})`,
    value: 'phonenumber',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) =>
      `extract-regex-groups :${column} ((?:\\+\\d{1,3}[\\s-]?)?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4})`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.ssn'
    )}`,
    patternName: `(\\d{3}[-\\s]?\\d{2}[-\\s]?\\d{4})`,
    value: 'ssn',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) => `extract-regex-groups :${column} (\\d{3}[-\\s]?\\d{2}[-\\s]?\\d{4})`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.startEndPattern'
    )}`,
    patternName: null,
    value: 'startend',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) => `extract-regex-groups :${column} .*${startValue}(.*)${endValue}.*`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.time'
    )}`,
    patternName: `((?:(?:2[0-3])|(?:[01]?\\d))[h:\\s][0-5]\\d(?::(?:(?:[0-5]\\d)|(?:60)))?(?:\\s[aApP][mM])?(?:Z|(?:[+-](?:1[0-2])|(?:0?\\d):[0-5]\\d)|(?:\\s[[a-zA-Z]\\s]+))?)`,
    value: 'time',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) =>
      `extract-regex-groups :${column} ((?:(?:2[0-3])|(?:[01]?\\d))[h:\\s][0-5]\\d(?::(?:(?:[0-5]\\d)|(?:60)))?(?:\\s[aApP][mM])?(?:Z|(?:[+-](?:1[0-2])|(?:0?\\d):[0-5]\\d)|(?:\\s[[a-zA-Z]\\s]+))?)`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.upsCode'
    )}`,
    patternName: `(1Z\\s?[0-9a-zA-Z]{3}\\s?[0-9a-zA-Z]{3}\\s?[0-9a-zA-Z]{2}\\s?\\d{4}\\s?\\d{4})`,
    value: 'upscodes',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) =>
      `extract-regex-groups :${column} (1Z\\s?[0-9a-zA-Z]{3}\\s?[0-9a-zA-Z]{3}\\s?[0-9a-zA-Z]{2}\\s?\\d{4}\\s?\\d{4})`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.url'
    )}`,
    patternName: `((?:(?:http[s]?|ftp):\/)?\/?(?:[^\/\\s]+)(?:(?:\/\\w+)*\/)(?:[\\w\-\.]+[^#?\\s]+)(?:.*)?)`,
    value: 'url',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) =>
      `extract-regex-groups :${column} ((?:(?:http[s]?|ftp):\/)?\/?(?:[^\/\\s]+)(?:(?:\/\\w+)*\/)(?:[\\w\-\.]+[^#?\\s]+)(?:.*)?)`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.usZipCode'
    )}`,
    patternName: `[^\\d]?([0-9]{5}(?:-[0-9]{4})?)[^\\d]?`,
    value: 'zipcode',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) => `extract-regex-groups :${column} [^\\d]?([0-9]{5}(?:-[0-9]{4})?)[^\\d]?`,
  },
  {
    label: `${T.translate(
      'features.WranglerNewUI.GridPage.transformationUI.extract.extractPatternOptions.custom'
    )}`,
    patternName: null,
    value: 'custom',
    extractDirective: (
      column: string,
      customInput: string,
      startValue: string,
      endValue: string,
      nDigit: string
    ) => `extract-regex-groups :${column} ${customInput}`,
  },
];
