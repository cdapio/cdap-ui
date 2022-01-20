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

const I18N_PREFIX = 'features.MetadataLineage';

export const TimeRangeOptions = [
  {
    label: T.translate(`${I18N_PREFIX}.dateRange.options.custom`),
    start: 'custom',
    end: 'custom',
    id: 'custom',
  },
  {
    label: T.translate(`${I18N_PREFIX}.dateRange.options.last7Days`),
    start: 'now-7d',
    end: 'now',
    id: 'last7d',
  },
  {
    label: T.translate(`${I18N_PREFIX}.dateRange.options.last14Days`),
    start: 'now-14d',
    end: 'now',
    id: 'last14d',
  },
  {
    label: T.translate(`${I18N_PREFIX}.dateRange.options.lastMonth`),
    start: 'now-30d',
    end: 'now',
    id: 'lastMonth',
  },
  {
    label: T.translate(`${I18N_PREFIX}.dateRange.options.last6Months`),
    start: 'now-180d',
    end: 'now',
    id: 'last6M',
  },
  {
    label: T.translate(`${I18N_PREFIX}.dateRange.options.last12Months`),
    start: 'now-365d',
    end: 'now',
    id: 'lastYear',
  },
];
