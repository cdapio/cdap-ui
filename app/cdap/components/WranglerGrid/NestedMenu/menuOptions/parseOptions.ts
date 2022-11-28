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
  },
  {
    value: 'parseAvro',
    label: T.translate(`${PREFIX}.parseAvro`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string) => `parse-as-avro-file :${selectedColumn}`,
  },
  {
    value: 'parseExcel',
    label: T.translate(`${PREFIX}.parseExcel`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) =>
      `parse-as-excel :${selectedColumn} '${transformationValues.sheetValue}' ${transformationValues.firstRowAsHeader}`,
  },
  {
    value: 'parseJSON',
    label: T.translate(`${PREFIX}.parseJSON`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) =>
      `parse-as-json :${selectedColumn} ${transformationValues.depth}`,
  },
  {
    value: 'parseXML',
    label: T.translate(`${PREFIX}.parseXML`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) =>
      `parse-xml-to-json :${selectedColumn} ${transformationValues.depth}`,
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
  },
  {
    value: 'parseFixedLength',
    label: T.translate(`${PREFIX}.parseFixedLength`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string, transformationValues: ITransformationComponentValues) =>
      `parse-as-fixed-length :${selectedColumn} ${transformationValues.columnWidths} ${transformationValues.optionPaddingParam}`,
  },
  {
    value: 'parseHL7',
    label: T.translate(`${PREFIX}.parseHL7`).toString(),
    supportedDataType: ['all'],
    directive: (selectedColumn: string) => `parse-as-hl7 :${selectedColumn}`,
  },
];
