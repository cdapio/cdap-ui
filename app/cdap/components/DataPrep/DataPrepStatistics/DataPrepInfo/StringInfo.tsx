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
import { mean, mode } from 'mathjs';
import {
  getPercentNullInfoItem,
  mostFrequentStrings,
  numDistinctValues,
} from 'components/DataPrep/DataPrepStatistics/DataPrepStatisticsUtils';
const PREFIX = 'features.DataPrep.DataPrepStatistics.DataPrepInfo';

export default function StringInfo({ values }) {
  const nonNullValues = values.filter((val) => val != null);

  return (
    <table className="info-table">
      <tbody>
        <InfoItem
          itemName={T.translate(`${PREFIX}.meanStrLength`)}
          itemValue={+mean(nonNullValues.map((str) => str.length)).toFixed(2)}
          valueSuffix={' character' + (mean(nonNullValues.map((str) => str.length)) > 1 ? 's' : '')}
          className="end-of-section"
        />
        <InfoItem
          className="new-section"
          itemName={T.translate(`${PREFIX}.distinctStrings`)}
          itemValue={numDistinctValues(nonNullValues)}
        />
        {numDistinctValues(nonNullValues) < nonNullValues.length ? (
          <InfoItem
            itemName={
              T.translate(`${PREFIX}.mostFrequentStr`) + (mode(nonNullValues).length > 1 ? 's' : '')
            }
            itemValue={mostFrequentStrings(nonNullValues)}
          />
        ) : null}
        {getPercentNullInfoItem(values)}
      </tbody>
    </table>
  );
}

StringInfo.propTypes = {
  values: PropTypes.array,
};
