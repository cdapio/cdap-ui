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
import T from 'i18n-react';
import PropTypes from 'prop-types';
import InfoItem from 'components/DataPrep/DataPrepStatistics/DataPrepInfo/InfoItem';
import {
  getPercentNullInfoItem,
  numDistinctValues,
} from 'components/DataPrep/DataPrepStatistics/DataPrepStatisticsUtils';
const PREFIX = 'features.DataPrep.DataPrepStatistics.DataPrepInfo';

export default function DateTimeInfo({ dataType, values }) {
  let nonNullValues = values.filter((val) => val != null);

  // Remove suffix (looks like "Z[UTC]") from Timestamp_micros, so JS can parse them correctly
  if (dataType === 'Timestamp_micros') {
    nonNullValues = nonNullValues.map((el) => el.slice(0, -6));
  }
  // Sort values by corresponding time
  nonNullValues = nonNullValues.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <table className="info-table">
      <tbody>
        <InfoItem
          itemName={T.translate(`${PREFIX}.earliest`)}
          valuePrefix={T.translate(`${PREFIX}.earliestPrefix`)}
          itemValue={values[Math.floor(nonNullValues.length * 0.1) - 1]}
        />
        <InfoItem
          className="end-of-section"
          itemName={T.translate(`${PREFIX}.latest`)}
          valuePrefix={T.translate(`${PREFIX}.latestPrefix`)}
          itemValue={values[Math.floor(nonNullValues.length * 0.9) - 1]}
        />
        <InfoItem
          className="new-section"
          itemName={T.translate(`${PREFIX}.distinctVals`)}
          itemValue={numDistinctValues(nonNullValues)}
        />
        {getPercentNullInfoItem(values)}
      </tbody>
    </table>
  );
}

DateTimeInfo.propTypes = {
  dataType: PropTypes.string,
  values: PropTypes.array,
};
