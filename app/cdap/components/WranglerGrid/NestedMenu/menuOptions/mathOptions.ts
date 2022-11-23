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

import { NATIVE_NUMBER_TYPES, NUMBER_TYPES } from 'services/global-constants';
import T from 'i18n-react';

export const MATH_OPTIONS = [
  {
    value: 'algebra',
    label: T.translate(
      'features.WranglerNewUI.GridPage.transformations.options.labels.math.algebra'
    ).toString(),
    options: [
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.add'
        ).toString(),
        value: 'ADD',
        sign: '+',
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.subtract'
        ).toString(),
        value: 'SUBTRACT',
        sign: '-',
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.multiply'
        ).toString(),
        value: 'MULTIPLY',
        sign: 'x',
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.divide'
        ).toString(),
        value: 'DIVIDE',
        sign: '/',
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.modulo'
        ).toString(),
        value: 'MOD',
        sign: '%',
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.powerOf'
        ).toString(),
        value: 'POWEROF',
        sign: null,
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.square'
        ).toString(),
        value: 'SQUARE',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.squareRoot'
        ).toString(),
        value: 'SQUARE_ROOT',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.cube'
        ).toString(),
        value: 'CUBE',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.cubeRoot'
        ).toString(),
        value: 'CUBE_ROOT',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.log'
        ).toString(),
        value: 'LOG',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.naturalLog'
        ).toString(),
        value: 'NATURALLOG',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.absoluteValue'
        ).toString(),
        value: 'ABSVALUE',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.ceil'
        ).toString(),
        value: 'CEIL',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.floor'
        ).toString(),
        value: 'FLOOR',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
    ],
    supportedDataType: NUMBER_TYPES,
  },
  {
    value: 'trigonometry',
    label: T.translate(
      'features.WranglerNewUI.GridPage.transformations.options.labels.math.trigonometry'
    ).toString(),
    options: [
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.sin'
        ).toString(),
        value: 'SIN',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.cos'
        ).toString(),
        value: 'COS',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.tan'
        ).toString(),
        value: 'TAN',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.arcsin'
        ).toString(),
        value: 'ARCSIN',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.arccos'
        ).toString(),
        value: 'ARCCOS',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.arctan'
        ).toString(),
        value: 'ARCTAN',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
    ],
    supportedDataType: NUMBER_TYPES,
  },
  {
    value: 'random',
    label: T.translate(
      'features.WranglerNewUI.GridPage.transformations.options.labels.math.random'
    ).toString(),
    options: [
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.random'
        ).toString(),
        value: 'RANDOM',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: NATIVE_NUMBER_TYPES,
      },
    ],
    supportedDataType: NUMBER_TYPES,
  },
  {
    value: 'decimal',
    label: T.translate(
      'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimal'
    ).toString(),
    options: [
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalAdd'
        ).toString(),
        value: 'DECIMALADD',
        sign: '+',
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalSubtract'
        ).toString(),
        value: 'DECIMALSUBTRACT',
        sign: '-',
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalMultiply'
        ).toString(),
        value: 'DECIMALMULTIPLY',
        sign: null,
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalDivide'
        ).toString(),
        value: 'DECIMALDIVIDEQ',
        sign: null,
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalDivider'
        ).toString(),
        value: 'DECIMALDIVIDER',
        sign: null,
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.precision'
        ).toString(),
        value: 'PRECISION',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.scale'
        ).toString(),
        value: 'SCALE',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.unscaled'
        ).toString(),
        value: 'UNSCALED',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalLeft'
        ).toString(),
        value: 'DECIMALLEFT',
        sign: null,
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalRight'
        ).toString(),
        value: 'DECIMALRIGHT',
        sign: null,
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalPowerOf'
        ).toString(),
        value: 'DECIMALPOWEROF',
        sign: null,
        inputRequired: true,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalAbsoluteValue'
        ).toString(),
        value: 'DECIMALABSVALUE',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalSquare'
        ).toString(),
        value: 'DECIMALSQUARE',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.decimalCube'
        ).toString(),
        value: 'DECIMALCUBE',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.negate'
        ).toString(),
        value: 'NEGATE',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.stripZero'
        ).toString(),
        value: 'STRIPZERO',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
      {
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.math.sign'
        ).toString(),
        value: 'SIGN',
        sign: null,
        inputRequired: false,
        component: 'Calculate',
        supportedDataType: ['bigdecimal'],
      },
    ],
    supportedDataType: NUMBER_TYPES,
  },
];
