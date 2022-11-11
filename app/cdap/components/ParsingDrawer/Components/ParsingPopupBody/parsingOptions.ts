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

const PREFIX = 'features.DataPrep.Directives.SetCharEncoding';
const SUFFIX = 'features.DataPrep.Directives.Parse';

export const CHAR_ENCODING_OPTIONS = [
  {
    label: T.translate(`${PREFIX}.utf8`),
    value: 'UTF-8',
  },
  {
    label: T.translate(`${PREFIX}.utf16`),
    value: 'UTF-16',
  },
  {
    label: T.translate(`${PREFIX}.usascii`),
    value: 'US-ASCII',
  },
  {
    label: T.translate(`${PREFIX}.iso88591`),
    value: 'ISO-8859-1',
  },
  {
    label: T.translate(`${PREFIX}.utf16be`),
    value: 'UTF-16BE',
  },
  {
    label: T.translate(`${PREFIX}.utf16le`),
    value: 'UTF-16LE',
  },
];

export const FORMAT_OPTIONS = [
  {
    label: T.translate(`${SUFFIX}.Parsers.CSV.label`),
    value: 'CSV',
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.EXCEL.label`),
    value: 'Excel',
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.FIXEDLENGTH.label`),
    value: 'Fixed length',
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.HL7.label`),
    value: 'HL7',
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.JSON.label`),
    value: 'JSON',
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.LOG.label`),
    value: 'Log',
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.NATURALDATE.label`),
    value: 'Natural date',
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.SIMPLEDATE.label`),
    value: 'Simple date',
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.DATETIME.label`),
    value: 'Datetime',
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.XMLTOJSON.label`),
    value: 'XML to JSON',
  },
];
