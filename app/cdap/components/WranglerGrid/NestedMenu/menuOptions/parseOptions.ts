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

import { ITransformationComponentValues } from 'components/WranglerGrid/AddTransformationPanel/types';
import { PARSE_CSV_OPTIONS } from 'components/WranglerGrid/TransformationComponents/ParseComponents/options';
import T from 'i18n-react';

const PREFIX = 'features.WranglerNewUI.GridPage.transformations.options.labels.parse';

export const PARSE_OPTIONS = [
  {
    value: 'parseCSV',
    label: T.translate(`${PREFIX}.parseCSV`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) => {
      return `parse-as-csv :${selectedColumn} '${
        transformationValues.radioOption === 'customDelimiter'
          ? transformationValues.customInput
          : PARSE_CSV_OPTIONS.find(
              (eachOption) => eachOption.value === transformationValues.radioOption
            )?.directiveExpression
      }' ${transformationValues.firstRowAsHeader}`;
    },
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382075022/Parse+as+CSV'
  },
  {
    value: 'parseAvro',
    label: T.translate(`${PREFIX}.parseAvro`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string) => `parse-as-avro-file :${selectedColumn}`,
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/391577976/Parse+AVRO+Encoded+Messages'
  },
  {
    value: 'parseExcel',
    label: T.translate(`${PREFIX}.parseExcel`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) =>
      `parse-as-excel :${selectedColumn} '${transformationValues.sheetValue}' ${transformationValues.firstRowAsHeader}`,
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382107832/Parse+as+Excel'
  },
  {
    value: 'parseJSON',
    label: T.translate(`${PREFIX}.parseJSON`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) =>
      `parse-as-json :${selectedColumn} ${transformationValues.depth}`,
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382107862/Parse+as+JSON'
  },
  {
    value: 'parseXML',
    label: T.translate(`${PREFIX}.parseXML`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) =>
      `parse-xml-to-json :${selectedColumn} ${transformationValues.depth}`,
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382140609/Parse+XML+to+JSON'
  },
  {
    value: 'parseLog',
    label: T.translate(`${PREFIX}.parseLog`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) => {
      return `parse-as-log :${selectedColumn} '${
        transformationValues.radioOption === 'custom'
          ? transformationValues.customInput
          : transformationValues.radioOption
      }'`;
    },
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/381976753/Parse+as+Log+directive'
  },
  {
    value: 'parseSimpleDate',
    label: T.translate(`${PREFIX}.parseSimpleDate`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) => {
      return `parse-as-simple-date  :${selectedColumn} ${
        transformationValues.radioOption === 'customFormat'
          ? transformationValues.customInput
          : transformationValues.radioOption
      }`;
    },
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382107884/Parse+as+Simple+Date+directive'
  },
  {
    value: 'parseDateTime',
    label: T.translate(`${PREFIX}.parseDateTime`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) => {
      return `parse-as-datetime  :${selectedColumn} \"${
        transformationValues.radioOption === 'customFormat'
          ? transformationValues.customInput
          : transformationValues.radioOption
      }\"`;
    },
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/1128988735/Parse+as+Datetime+directive'
  },
  {
    value: 'parseFixedLength',
    label: T.translate(`${PREFIX}.parseFixedLength`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) =>
      `parse-as-fixed-length :${selectedColumn} ${transformationValues.columnWidths} ${transformationValues.optionPaddingParam}`,
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382042272/Parse+as+Fixed+Length'
  },
  {
    value: 'parseHL7',
    label: T.translate(`${PREFIX}.parseHL7`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string) => `parse-as-hl7 :${selectedColumn}`,
    infoLink: 'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382042279/Parse+as+HL7'
  },
];
