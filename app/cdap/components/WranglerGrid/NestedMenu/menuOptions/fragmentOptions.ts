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

export const FRAGMENT_OPTIONS = [
  {
    value: 'extract',
    label: T.translate(
      'features.WranglerNewUI.GridPage.transformations.options.labels.fragment.extract'
    ).toString(),
    options: [
      {
        value: 'extract-using-patterns',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.fragment.usingPatterns'
        ).toString(),
        supportedDataType: ['string'],
        infoLink:
          'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382074940/Extract+Regex+Groups',
      },
      {
        value: 'extract-using-delimiters',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.fragment.usingDelimiters'
        ).toString(),
        supportedDataType: ['all'],
        infoLink:
          'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382074940/Extract+Regex+Groups',
      },
      {
        value: 'extract-using-positions',
        label: T.translate(
          'features.WranglerNewUI.GridPage.transformations.options.labels.fragment.usingPositions'
        ).toString(),
        supportedDataType: ['all'],
        infoLink:
          'https://cdap.atlassian.net/wiki/spaces/DOCS/pages/382074940/Extract+Regex+Groups',
      },
    ],
    supportedDataType: ['all'],
  },
];
