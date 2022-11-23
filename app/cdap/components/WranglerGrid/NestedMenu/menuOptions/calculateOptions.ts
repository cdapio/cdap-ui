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

import { NATIVE_NUMBER_TYPES } from 'services/global-constants';
import Calculate from 'components/WranglerGrid/TransformationComponents/Calculate';

export const CALCULATE_OPTIONS = [
  {
    label: 'Character count',
    value: 'CHARCOUNT',
    sign: null,
    inputRequired: true,
    component: Calculate,
    supportedDataType: ['string'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) => `set-column :${newColumnName} string:length(${column})`,
  },
  {
    label: 'Add',
    value: 'ADD',
    sign: '+',
    inputRequired: true,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} ${column} + ${input}`
        : `set-column :${column} ${column} + ${input}`,
  },
  {
    label: 'Subtract',
    value: 'SUBTRACT',
    sign: '-',
    inputRequired: true,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} ${column} - ${input}`
        : `set-column :${column} ${column} - ${input}`,
  },
  {
    label: 'Multiply',
    value: 'MULTIPLY',
    sign: 'x',
    inputRequired: true,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} ${column} * ${input}`
        : `set-column :${column} ${column} * ${input}`,
  },
  {
    label: 'Divide',
    value: 'DIVIDE',
    sign: '/',
    inputRequired: true,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} ${column} / ${input}`
        : `set-column :${column} ${column} / ${input}`,
  },
  {
    label: 'Modulo',
    value: 'MOD',
    sign: '%',
    inputRequired: true,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} ${column} % ${input}`
        : `set-column :${column} ${column} % ${input}`,
  },
  {
    label: 'Power of',
    value: 'POWEROF',
    sign: null,
    inputRequired: true,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:pow(${column}, ${input})`
        : `set-column :${column} math:pow(${column}, ${input})`,
  },
  {
    label: 'Square',
    value: 'SQUARE',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:pow(${column}, 2)`
        : `set-column :${column} math:pow(${column}, 2)`,
  },
  {
    label: 'Square root',
    value: 'SQUARE_ROOT',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:sqrt(${column})`
        : `set-column :${column} math:sqrt(${column})`,
  },
  {
    label: 'Cube',
    value: 'CUBE',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:pow(${column}, 3)`
        : `set-column :${column} math:pow(${column}, 3)`,
  },
  {
    label: 'Cube root',
    value: 'CUBE_ROOT',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:cbrt(${column})`
        : `set-column :${column} math:cbrt(${column})`,
  },
  {
    label: 'log',
    value: 'LOG',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:log10(${column})`
        : `set-column :${column} math:log10(${column})`,
  },
  {
    label: 'Natural log',
    value: 'NATURALLOG',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:log(${column})`
        : `set-column :${column} math:log(${column})`,
  },
  {
    label: 'Absolute value',
    value: 'ABSVALUE',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:abs(${column})`
        : `set-column :${column} math:abs(${column})`,
  },
  {
    label: 'Ceil',
    value: 'CEIL',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:ceil(${column})`
        : `set-column :${column} math:ceil(${column})`,
  },
  {
    label: 'Floor',
    value: 'FLOOR',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:floor(${column})`
        : `set-column :${column} math:floor(${column})`,
  },
  {
    label: 'Sin',
    value: 'SIN',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:sin(${column})`
        : `set-column :${column} math:sin(${column})`,
  },
  {
    label: 'Cos',
    value: 'COS',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:cos(${column})`
        : `set-column :${column} math:cos(${column})`,
  },
  {
    label: 'Tan',
    value: 'TAN',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:tan(${column})`
        : `set-column :${column} math:tan(${column})`,
  },
  {
    label: 'ARCSIN',
    value: 'ARCSIN',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:asin(${column})`
        : `set-column :${column} math:asin(${column})`,
  },
  {
    label: 'ARCCOS',
    value: 'ARCCOS',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:acos(${column})`
        : `set-column :${column} math:acos(${column})`,
  },
  {
    label: 'ARCTAN',
    value: 'ARCTAN',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:atan(${column})`
        : `set-column :${column} math:atan(${column})`,
  },
  {
    label: 'Round',
    value: 'ROUND',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:round(${column})`
        : `set-column :${column} math:round(${column})`,
  },
  {
    label: 'Random',
    value: 'RANDOM',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: NATIVE_NUMBER_TYPES,
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} math:random()`
        : `set-column :${column} math:random()`,
  },
  {
    label: 'Decimal Add',
    value: 'DECIMALADD',
    sign: '+',
    inputRequired: true,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:add(${column}, ${input})`
        : `set-column :${column} decimal:add(${column}, ${input})`,
  },
  {
    label: 'Decimal Subtract',
    value: 'DECIMALSUBTRACT',
    sign: '-',
    inputRequired: true,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:subtract(${column}, ${input})`
        : `set-column :${column} decimal:subtract(${column}, ${input})`,
  },
  {
    label: 'Decimal Multiply',
    value: 'DECIMALMULTIPLY',
    sign: null,
    inputRequired: true,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:multiply(${column}, ${input})`
        : `set-column :${column} decimal:multiply(${column}, ${input})`,
  },
  {
    label: 'Decimal Divide',
    value: 'DECIMALDIVIDEQ',
    sign: null,
    inputRequired: true,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:divideq(${column}, ${input})`
        : `set-column :${column} decimal:divideq(${column}, ${input})`,
  },
  {
    label: 'Decimal Divider',
    value: 'DECIMALDIVIDER',
    sign: null,
    inputRequired: true,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:divider(${column}, ${input})`
        : `set-column :${column} decimal:divider(${column}, ${input})`,
  },
  {
    label: 'Precision',
    value: 'PRECISION',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:precision(${column})`
        : `set-column :${column} decimal:precision(${column})`,
  },
  {
    label: 'Scale',
    value: 'SCALE',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:scale(${column})`
        : `set-column :${column} decimal:scale(${column})`,
  },
  {
    label: 'Unscaled',
    value: 'UNSCALED',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:unscaled(${column})`
        : `set-column :${column} decimal:unscaled(${column})`,
  },
  {
    label: 'Decimal left',
    value: 'DECIMALLEFT',
    sign: null,
    inputRequired: true,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:decimal_left(${column}, ${input})`
        : `set-column :${column} decimal:decimal_left(${column}, ${input})`,
  },
  {
    label: 'Decimal right',
    value: 'DECIMALRIGHT',
    sign: null,
    inputRequired: true,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:decimal_right(${column}, ${input})`
        : `set-column :${column} decimal:decimal_right(${column}, ${input})`,
  },
  {
    label: 'Decimal power of',
    value: 'DECIMALPOWEROF',
    sign: null,
    inputRequired: true,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:pow(${column}, ${input})`
        : `set-column :${column} decimal:pow(${column}, ${input})`,
  },
  {
    label: 'Decimal absolute value',
    value: 'DECIMALABSVALUE',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:abs(${column})`
        : `set-column :${column} decimal:abs(${column})`,
  },
  {
    label: 'Decimal square',
    value: 'DECIMALSQUARE',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:pow(${column}, 2)`
        : `set-column :${column} decimal:pow(${column}, 2)`,
  },
  {
    label: 'Decimal cube',
    value: 'DECIMALCUBE',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:pow(${column}, 3)`
        : `set-column :${column} decimal:pow(${column}, 3)`,
  },
  {
    label: 'Negate',
    value: 'NEGATE',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:negate(${column})`
        : `set-column :${column} decimal:negate(${column})`,
  },
  {
    label: 'Strip zero',
    value: 'STRIPZERO',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:strip_zero(${column})`
        : `set-column :${column} decimal:strip_zero(${column})`,
  },
  {
    label: 'Sign',
    value: 'SIGN',
    sign: null,
    inputRequired: false,
    component: Calculate,
    supportedDataType: ['bigdecimal'],
    directive: (
      column: string,
      input: string | number,
      newColumnName: string,
      copyToNew: boolean
    ) =>
      copyToNew
        ? `set-column :${newColumnName} decimal:sign(${column})`
        : `set-column :${column} decimal:sign(${column})`,
  },
];
