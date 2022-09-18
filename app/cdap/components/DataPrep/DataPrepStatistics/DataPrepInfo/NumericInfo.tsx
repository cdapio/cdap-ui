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
import { mean, median } from 'mathjs';
import {
  truncatedMode,
  numDistinctValues,
  topDecile,
  bottomDecile,
  getPercentNullInfoItem,
} from 'components/DataPrep/DataPrepStatistics/DataPrepStatisticsUtils';
const PREFIX = 'features.DataPrep.DataPrepStatistics.DataPrepInfo';

export default function NumericInfo({ values }) {
  const numberValues = values.filter((val) => val != null).map((val) => Number(val));

  return (
    <table className="info-table">
      <tbody>
        <InfoItem
          itemName={T.translate(`${PREFIX}.mean`)}
          itemValue={+mean(numberValues).toFixed(2)}
        />
        <InfoItem
          itemName={T.translate(`${PREFIX}.median`)}
          itemValue={+median(numberValues).toFixed(2)}
        />
        {numDistinctValues(numberValues) < numberValues.length ? (
          <InfoItem
            itemName={T.translate(`${PREFIX}.mode`)}
            itemValue={truncatedMode(numberValues)}
          />
        ) : null}
        <InfoItem
          itemName={T.translate(`${PREFIX}.top`)}
          valuePrefix={T.translate(`${PREFIX}.topPrefix`)}
          itemValue={topDecile(numberValues)}
        />
        <InfoItem
          className="end-of-section"
          itemName={T.translate(`${PREFIX}.bottom`)}
          valuePrefix={T.translate(`${PREFIX}.bottomPrefix`)}
          itemValue={bottomDecile(numberValues)}
        />
        <InfoItem
          className="new-section"
          itemName={T.translate(`${PREFIX}.distinctVals`)}
          itemValue={numDistinctValues(numberValues)}
        />
        {getPercentNullInfoItem(values)}
      </tbody>
    </table>
  );
}

NumericInfo.propTypes = {
  values: PropTypes.array,
};
