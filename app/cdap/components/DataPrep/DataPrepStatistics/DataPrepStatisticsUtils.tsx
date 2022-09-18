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
import { mode, setSize } from 'mathjs';
import InfoItem from 'components/DataPrep/DataPrepStatistics/DataPrepInfo/InfoItem';

export function isNumeric(type) {
  return ['Integer', 'Int', 'Long', 'Short', 'Double', 'Float', 'Decimal'].includes(type);
}

export function isIntegral(type) {
  return ['Integer', 'Int', 'Long', 'Short'].includes(type);
}

export function isDateTime(type) {
  // We currently don't support custom visualizations for BigQuery date/time types, though
  // that feature could be added in the future
  return ['Datetime', 'Timestamp_micros'].includes(type);
}

export function truncatedMode(values) {
  return getMode(values, false);
}

export function mostFrequentStrings(values) {
  return getMode(values, true);
}

// Return a String displaying the most common elements in the given list, up to a maximum of 3
function getMode(values, putQuotes) {
  if (values === null || values.length === 0) {
    return null;
  }
  const fullMode = mode(values);
  const quoteIfNeeded = putQuotes ? '"' : '';
  const len = fullMode.length;
  let toReturn = quoteIfNeeded + fullMode[0] + quoteIfNeeded;
  if (len >= 2) {
    toReturn += ', ' + quoteIfNeeded + fullMode[1] + quoteIfNeeded;
  }
  if (len >= 3) {
    toReturn += ', ' + quoteIfNeeded + fullMode[2] + quoteIfNeeded;
  }
  if (len > 3) {
    toReturn += ', and others';
  }
  return toReturn;
}

// Return the number of distinct values
export function numDistinctValues(values) {
  return setSize(values, true);
}

export function topDecile(values) {
  return percentile(values, 0.9);
}

export function bottomDecile(values) {
  return percentile(values, 0.1);
}

function percentile(arr, p) {
  arr.sort((a, b) => a - b);
  return arr[Math.max(0, Math.floor(arr.length * p) - 1)];
}

// Return an InfoItem displaying the percentage of cells which are null
export function getPercentNullInfoItem(values) {
  const PREFIX = 'features.DataPrep.DataPrepStatistics.DataPrepInfo';
  const numNull = values.filter((val) => val == null).length;
  const percentNull = (100 * numNull) / values.length;
  if (percentNull === 0) {
    return (
      <InfoItem
        itemName={T.translate(`${PREFIX}.nullCells`)}
        itemValue={T.translate(`${PREFIX}.nullCellsNone`)}
      />
    );
  } else {
    return (
      <InfoItem
        itemName={T.translate(`${PREFIX}.nullCells`)}
        itemValue={percentNull < 0.5 ? percentNull.toFixed(2) : Math.round(percentNull)}
        valueSuffix="%"
      />
    );
  }
}
