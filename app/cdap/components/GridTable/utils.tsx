/*
 * Copyright © 2017-2018 Cask Data, Inc.
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

export const convertNonNullPercent = (gridData: IExecuteAPIResponse, key: string, nonNullValue) => {
  const lengthOfData: number = gridData?.values.length;
  let count: number = 0;
  let nonNullCount: number = 0;
  let emptyCount: number = 0;
  let nullValueCount: number = 0;
  if (lengthOfData) {
    nonNullCount = nonNullValue['non-null'] ? (nonNullValue['non-null'] / 100) * lengthOfData : 0;
    nullValueCount = nonNullValue.null ? (nonNullValue.null / 100) * lengthOfData : 0;
    emptyCount = nonNullValue.empty ? (nonNullValue.empty / 100) * lengthOfData : 0;
    count = parseInt(nullValueCount.toFixed(0) + emptyCount.toFixed(0));
  }
  return count;
};

export const checkFrequentlyOccuredValues = (gridData: IExecuteAPIResponse, key: string) => {
  const valueOfHeaderKey = gridData?.values.map((el) => el[key]);
  let mostfrequentItemCount: number = 1;
  let count: number = 0;
  let mostfrequentItemValue: string = '';
  const mostFrequentOccuredData = {
    name: '',
    count: 0,
  };
  for (let i = 0; i < valueOfHeaderKey.length; i++) {
    for (let j = i; j < valueOfHeaderKey.length; j++) {
      if (valueOfHeaderKey[i] == valueOfHeaderKey[j]) {
        count++;
      }
      if (mostfrequentItemCount < count) {
        mostfrequentItemCount = count;
        mostfrequentItemValue = valueOfHeaderKey[i];
      }
    }
    count = 0;
    mostfrequentItemValue =
      mostfrequentItemValue == '' ? valueOfHeaderKey[i] : mostfrequentItemValue;
  }
  mostFrequentOccuredData.name = mostfrequentItemValue;
  mostFrequentOccuredData.count = mostfrequentItemCount;
  return mostFrequentOccuredData;
};
