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

export const SECURITY_OPTIONS = [
  {
    value: 'encode',
    label: T.translate(
      'features.WranglerNewUI.GridPage.transformations.options.labels.security.encode'
    ).toString(),
    options: [
      {
        value: 'encode-base64',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.security.encodeBase64'
        ).toString(),
        supportedDataType: [
          T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
        ],
        directive: (selectedColumn: string) => `encode base64 :${selectedColumn}`,
      },
      {
        value: 'encode-base32',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.security.encodeBase32'
        ).toString(),
        supportedDataType: [
          T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
        ],
        directive: (selectedColumn: string) => `encode base32 :${selectedColumn}`,
      },
      {
        value: 'encode-hex',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.security.encodeHex'
        ).toString(),
        supportedDataType: [
          T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
        ],
        directive: (selectedColumn: string) => `encode hex :${selectedColumn}`,
      },
      {
        value: 'encode-url',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.security.encodeUrl'
        ).toString(),
        supportedDataType: [
          T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
        ],
        directive: (selectedColumn: string) => `url-encode :${selectedColumn}`,
      },
    ],
    supportedDataType: [
      T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
    ],
  },
  {
    value: 'decode',
    label: T.translate(
      'features.WranglerNewUI.GridPage.transformations.options.labels.security.decode'
    ).toString(),
    options: [
      {
        value: 'decode-base64',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.security.decodeBase64'
        ).toString(),
        supportedDataType: [
          T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
        ],
        directive: (selectedColumn: string) => `decode base64 :${selectedColumn}`,
      },
      {
        value: 'decode-base32',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.security.decodeBase32'
        ).toString(),
        supportedDataType: [
          T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
        ],
        directive: (selectedColumn: string) => `decode base32 :${selectedColumn}`,
      },
      {
        value: 'decode-hex',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.security.decodeHex'
        ).toString(),
        supportedDataType: [
          T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
        ],
        directive: (selectedColumn: string) => `decode hex :${selectedColumn}`,
      },
      {
        value: 'decode-url',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.security.decodeUrl'
        ).toString(),
        supportedDataType: [
          T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
        ],
        directive: (selectedColumn: string) => `url-decode :${selectedColumn}`,
      },
    ],
    supportedDataType: [
      T.translate('features.WranglerNewUI.GridPage.toolbarIcons.labels.all').toString(),
    ],
  },
];
