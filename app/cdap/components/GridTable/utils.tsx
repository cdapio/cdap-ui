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
import { IExecuteAPIResponse } from './types';

/**
 *
 * @description This function takes API response of execute api and object containing detail about null, non-null or
 * empty values and returns the count of Missing/Null values
 * @param {IExecuteAPIResponse} gridData This is the execute API Response
 * @param {nonNullValue} nonNullValue This the extracted object with respect to column from execute API Response
 * @returns {number} This is the calculated count of missing/null value
 */
export const convertNonNullPercent = (gridData: IExecuteAPIResponse | undefined, nonNullValue) => {
  const lengthOfData: number = gridData?.values.length;
  let nullValueCount: number = 0;
  if (lengthOfData) {
    nullValueCount = nonNullValue.null
      ? (((nonNullValue.null || 0) + (nonNullValue.empty || 0)) / 100) * lengthOfData
      : 0;
  }
  return nullValueCount;
};

/**
 *
 * @description This function takes API response of execute api and key(header column key) and finds out which item
 * in a column appears maximum times, and returns an object containing value and the number of time it is present
 * @param {IExecuteAPIResponse} gridData This is the execute API Response
 * @param {string} key This is the name of column header
 * @returns {name: string, count: number} Return value, object containing name of most frequently occurred value with its count
 */
export const checkFrequentlyOccuredValues = (
  gridData: IExecuteAPIResponse | undefined,
  key: string
) => {
  const valueOfKey = gridData?.values.map((el) => el[key]);
  let mostFrequentItem: number = 1;
  let mostFrequentItemCount: number = 0;
  let mostFrequentItemValue: string = '';
  const mostFrequentDataItem = {
    name: '',
    count: 0,
  };
  if (Array.isArray(valueOfKey) && valueOfKey.length) {
    valueOfKey.map((item, index) => {
      valueOfKey.map((value, valueIndex) => {
        if (item == value) {
          mostFrequentItemCount++;
        }
        if (mostFrequentItem < mostFrequentItemCount) {
          mostFrequentItem = mostFrequentItemCount;
          mostFrequentItemValue = item;
        }
      });
      mostFrequentItemCount = 0;
      mostFrequentItemValue = mostFrequentItemValue == '' ? item : mostFrequentItemValue;
    });
  }
  mostFrequentDataItem.name = mostFrequentItemValue;
  mostFrequentDataItem.count = mostFrequentItemCount;
  return mostFrequentDataItem;
};
