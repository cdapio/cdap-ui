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
    value: T.translate(`${PREFIX}.utf8`),
  },
  {
    label: T.translate(`${PREFIX}.utf16`),
    value: T.translate(`${PREFIX}.utf16`),
  },
  {
    label: T.translate(`${PREFIX}.usascii`),
    value: T.translate(`${PREFIX}.usascii`),
  },
  {
    label: T.translate(`${PREFIX}.iso88591`),
    value: T.translate(`${PREFIX}.iso88591`),
  },
  {
    label: T.translate(`${PREFIX}.utf16be`),
    value: T.translate(`${PREFIX}.utf16be`),
  },
  {
    label: T.translate(`${PREFIX}.utf16le`),
    value: T.translate(`${PREFIX}.utf16le`),
  },
];

export const FORMAT_OPTIONS = [
  {
    label: T.translate(`${SUFFIX}.Parsers.CSV.label`),
    value: T.translate(`${SUFFIX}.Parsers.CSV.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.EXCEL.label`),
    value: T.translate(`${SUFFIX}.Parsers.EXCEL.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.FIXEDLENGTH.label`),
    value: T.translate(`${SUFFIX}.Parsers.FIXEDLENGTH.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.HL7.label`),
    value: T.translate(`${SUFFIX}.Parsers.HL7.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.JSON.label`),
    value: T.translate(`${SUFFIX}.Parsers.JSON.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.LOG.label`),
    value: T.translate(`${SUFFIX}.Parsers.LOG.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.NATURALDATE.label`),
    value: T.translate(`${SUFFIX}.Parsers.NATURALDATE.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.SIMPLEDATE.label`),
    value: T.translate(`${SUFFIX}.Parsers.SIMPLEDATE.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.DATETIME.label`),
    value: T.translate(`${SUFFIX}.Parsers.DATETIME.label`),
  },
  {
    label: T.translate(`${SUFFIX}.Parsers.XMLTOJSON.label`),
    value: T.translate(`${SUFFIX}.Parsers.XMLTOJSON.label`),
  },
];
