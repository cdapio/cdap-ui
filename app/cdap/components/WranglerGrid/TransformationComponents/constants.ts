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

import Concatenate from 'components/WranglerGrid/TransformationComponents/Concatenate';
import ParseCSVComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseCSVComponent';
import ParseDateTimeComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseDateTimeComponent';
import ParseExcelComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseExcelComponent';
import ParseFixedLengthComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseFixedLengthComponent';
import ParseLogComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseLogComponent';
import ParseSimpleDateComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseSimpleDateComponent';
import ParseXMLToJSONComponent from 'components/WranglerGrid/TransformationComponents/ParseComponents/ParseXMLToJSONComponent';

export const TRANSFORMATION_COMPONENTS = [
  {
    type: 'parseCSV',
    component: ParseCSVComponent,
  },
  {
    type: 'parseLog',
    component: ParseLogComponent,
  },
  {
    type: 'parseSimpleDate',
    component: ParseSimpleDateComponent,
  },
  {
    type: 'parseDateTime',
    component: ParseDateTimeComponent,
  },
  {
    type: 'parseFixedLength',
    component: ParseFixedLengthComponent,
  },
  {
    type: 'parseXML',
    component: ParseXMLToJSONComponent,
  },
  {
    type: 'parseJSON',
    component: ParseXMLToJSONComponent,
  },
  {
    type: 'parseExcel',
    component: ParseExcelComponent,
  },
  {
    type: 'concatenate',
    component: Concatenate,
  },
  {
    type: 'dateTime',
    component: ParseSimpleDateComponent,
  },
  {
    type: 'dateTimeAsString',
    component: ParseDateTimeComponent,
  },
];
