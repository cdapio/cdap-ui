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
import { IExecuteAPIResponse, IGeneralNonNull } from './types';

/**
 * 
 * @description This function takes API response of execute api and object containing detail about null, non-null or 
 * empty values and returns the count of Missing/Null values
 * @param {IExecuteAPIResponse} gridData This is the execute API Response
 * @param {nonNullValue} nonNullValue This the extracted object with respect to column from execute API Response
 * @returns {number} This is the calculated count of missing/null value
 */
export const convertNonNullPercent = (gridData: IExecuteAPIResponse, nonNullValue: IGeneralNonNull) => {
  const lengthOfData: number = gridData?.values.length;
  let nullValueCount: number = 0;
  if (lengthOfData) {
    nullValueCount = nonNullValue.null
      ? (((nonNullValue.null || 0) + (nonNullValue.empty || 0)) / 100) * lengthOfData
      : 0;
  }
  return nullValueCount;
};

