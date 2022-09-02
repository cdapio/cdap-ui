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
import NumericInfo from 'components/DataPrep/DataPrepStatistics/DataPrepInfo/NumericInfo';
import StringInfo from 'components/DataPrep/DataPrepStatistics/DataPrepInfo/StringInfo';
import DateTimeInfo from 'components/DataPrep/DataPrepStatistics/DataPrepInfo/DateTimeInfo';
import PropTypes from 'prop-types';
import { isDateTime, isNumeric } from '../DataPrepStatisticsUtils';

export default function DataPrepInfo({ fieldName, dataType, values }) {
  const fieldValues = values.map((row) => row[fieldName]);

  if (fieldValues.filter((val) => val != null).length === 0) {
    return null;
  }
  if (isNumeric(dataType)) {
    return <NumericInfo values={fieldValues} />;
  }
  if (isDateTime(dataType)) {
    return <DateTimeInfo dataType={dataType} values={fieldValues} />;
  }
  return <StringInfo values={fieldValues} />;
}

DataPrepInfo.propTypes = {
  fieldName: PropTypes.string,
  dataType: PropTypes.string,
  values: PropTypes.array,
};
