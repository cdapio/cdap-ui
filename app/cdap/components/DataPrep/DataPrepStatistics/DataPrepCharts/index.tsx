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

import React from 'react';
import DateTimeChart from './DateTimeChart';
import NumericChart from './NumericChart';
import StringChart from './StringChart';
import {
  isNumeric,
  isDateTime,
} from 'components/DataPrep/DataPrepStatistics/DataPrepStatisticsUtils';

export default function DataPrepChart({ fieldName, dataType, values }) {
  // If all values are null, don't render any chart
  if (values.filter((row) => row[fieldName] != null) === 0) {
    return null;
  }
  if (isNumeric(dataType)) {
    return <NumericChart fieldName={fieldName} values={values} dataType={dataType} />;
  }
  if (isDateTime(dataType)) {
    return <DateTimeChart fieldName={fieldName} values={values} dataType={dataType} />;
  }
  return <StringChart fieldName={fieldName} values={values} />;
}
