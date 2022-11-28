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

const PREFIX = 'features.WranglerNewUI.GridPage.transformations.options.labels.security';

export const SECURITY_OPTIONS = [
  {
    value: 'mask-data',
    label: T.translate(`${PREFIX}.maskData`).toString(),
    options: [
      {
        value: 'mask-data-last-4-digit',
        label: T.translate(`${PREFIX}.last4`).toString(),
        supportedDataType: ['string'],
      },
      {
        value: 'mask-data-last-2-digit',
        label: T.translate(`${PREFIX}.last2`).toString(),
        supportedDataType: ['string'],
      },
      {
        value: 'mask-data-custom-selection',
        label: T.translate(`${PREFIX}.customSelection`).toString(),
        supportedDataType: ['string'],
      },
      {
        value: 'mask-data-shuffle',
        label: T.translate(`${PREFIX}.shuffle`).toString(),
        supportedDataType: ['string'],
      },
    ],
    supportedDataType: ['string'],
  },
];
