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

import { IValues } from 'components/GridTable/types';
import T from 'i18n-react';

const PREFIX = 'features.WranglerNewUI.GridTable';

/**
 * @description This function takes column name , rowsDataList and calculate the distinct values in the Column .
 * @param  {IRecords} values , this is the rowDataList .
 * @param  {string} columnName  , this is the column Name .
 * @returns {distinctCount : number } Return number of distinct values
 */

export const calculateDistinctValues = (values: IValues[], columnName: string) => {
  const arrayOfColumn = values && Array.isArray(values) && values.map((el) => el[columnName]);
  const arr = [...arrayOfColumn];
  let distinctCount: number = 0;

  let isNonNullElement = false;
  arr.forEach((element, index) => {
    if (arr.indexOf(element) === index && element !== undefined) {
      distinctCount += 1;
    }
    if (element === undefined) {
      isNonNullElement = true;
    }
  });
  return isNonNullElement ? distinctCount + 1 : distinctCount;
};

/**
 * @description This function takes column name , rowsDataList and calculate the minimum and maximum character Count in the Column .
 * @param  {IRecords} values , this is the rowDataList .
 * @param  {string} columnName , this is the column Name .
 * @returns {min : number || max : number } Return minimum and maximum character Count .
 */

export const characterCount = (values: IValues[], columnName: string) => {
  let minCount = 0;
  let maxCount = 0;
  const arrayOfColumn = values && Array.isArray(values) && values.map((el) => el[columnName]);

  arrayOfColumn &&
    Array.isArray(arrayOfColumn) &&
    arrayOfColumn?.length &&
    arrayOfColumn.map((element) => {
      if (element !== undefined) {
        if (element.length < minCount) {
          minCount = element.length;
        } else if (element.length > maxCount) {
          maxCount = element.length;
        }
      }
    });
  return { min: minCount || 0, max: maxCount || 0 };
};

/**
 * @description This function takes  rowsDataList .
 * @param  {IRecords} values , this is the rowDataList .
 * @returns  the Column Headers List .
 */

export const getColumnNames = (values) => {
  const uniqueColumnDataSet = new Set<string>();
  values.forEach((element) => {
    for (const [key] of Object.entries(element)) {
      uniqueColumnDataSet.add(`${key}`);
    }
  });
  return [...uniqueColumnDataSet];
};

/**
 *
 * @description This function takes API response of execute API and coloumn Name
 * @param  {IRecords} values , this is the rowDataList .
 * @param  {string} columnName  , this is the column Name .
 * @returns {number} This is the calculated count of empty Value
 */

export const calculateEmptyValueCount = (values: IValues[], columnName: string) => {
  const arrayOfColumn = values && Array.isArray(values) && values.map((el) => el[columnName]);
  let emptyValueCount = 0;
  arrayOfColumn &&
    Array.isArray(arrayOfColumn) &&
    arrayOfColumn?.length &&
    arrayOfColumn &&
    arrayOfColumn.map((element) => {
      if (element !== undefined && !element.replace(/\s/g, '').length) {
        emptyValueCount = emptyValueCount + 1;
      }
    });

  return emptyValueCount;
};

/**
 * @description This function takes column name , rowsDataList and checks for column container letter , trailing spaces , number ,leading space
 * @param  {IRecords} values , this is the rowDataList .
 * @param  {string} columnName , this is the column Name .
 * @returns {returnValue : string } Returns a string which describe the column having letter or number or leading , trailing spaces.
 */

export const checkAlphaNumericAndSpaces = (values: IValues[], columnName: string) => {
  const arrayOfColumn =
    values && Array.isArray(values) && values?.length && values.map((el) => el[columnName]);
  let containNumber = false;
  let containLetter = false;
  let containLeadingSpace = false;
  let containTrailingSpace = false;
  let returnValue = '';

  arrayOfColumn.forEach((element) => {
    if (element !== undefined) {
      if (!containNumber) {
        containNumber = isNumber(element);
      }
      if (!containLetter) {
        containLetter = isLetter(element);
      }
      if (!containLeadingSpace) {
        containLeadingSpace = isLeadingSpace(element);
      }
      if (!containTrailingSpace) {
        containTrailingSpace = isTrailingSpace(element);
      }
    }
  });

  if (containNumber && containLetter && containLeadingSpace && containTrailingSpace) {
    returnValue = T.translate(`${PREFIX}.containsLetterNumberLeadingTrailingSpaces`).toString();
  } else if (containLetter && containLeadingSpace && containTrailingSpace) {
    returnValue = T.translate(`${PREFIX}.containsLetterLeadingTrailing`).toString();
  } else if (containLetter && containLeadingSpace) {
    returnValue = T.translate(`${PREFIX}.containsLetterLeading`).toString();
  } else if (containLetter && containTrailingSpace) {
    returnValue = T.translate(`${PREFIX}.containsLetterTrailing`).toString();
  } else if (containLetter && containNumber) {
    returnValue = T.translate(`${PREFIX}.containsLetterNumber`).toString();
  } else if (containLetter) {
    returnValue = T.translate(`${PREFIX}.containsLetterOnly`).toString();
  } else if (containNumber) {
    returnValue = T.translate(`${PREFIX}.containsNumberOnly`).toString();
  }

  return returnValue;
};

/* Checks whether a string has number*/
const isNumber = (str: string) => {
  return /\d/.test(str);
};

/*Checks whether a string has leading space */
const isLeadingSpace = (str: string) => {
  return /^\s+/.test(str);
};

/*Checks whether a string has trailing space */
const isTrailingSpace = (str: string) => {
  return /[\s]+$/.test(str);
};

/* Checks whether a string has letter */
const isLetter = (str: string) => {
  return /[a-zA-Z]/.test(str) || (/[^A-Za-z0-9]+/.test(str) && !/\d/.test(str));
};

/**
 * @description This function takes column name , rowsDataList and calculate Distribution Graph Data
 * @param  {IRecords} values , this is the rowDataList .
 * @param  {string}  columnName, this is the column Name .
 * @returns Column distribution Data .
 */

export const calculateDistributionGraphData = (values: IValues[], columnName: string) => {
  const arrayOfColumn = values && Array.isArray(values) && values.map((el) => el[columnName]);
  const map = {};
  for (let i = 0; i < arrayOfColumn.length; i++) {
    map[arrayOfColumn[i]] = (map[arrayOfColumn[i]] || 0) + 1;
  }
  return Object.keys(map)
    .sort(function(a, b) {
      return map[b] - map[a];
    })
    .map((key) => {
      return { text: key, value: map[key] };
    });
};

/**
 *
 * @description This function takes API response of execute api and object containing detail about null, non-null or
 * empty values and returns the count of Missing/Null values
 * @param {IExecuteAPIResponse} gridData This is the execute API Response
 * @param {nonNullValue} nonNullValue This the extracted object with respect to column from execute API Response
 * @returns {number} This is the calculated count of missing/null value
 */

export const convertNonNullPercentForColumnSelected = (values: IValues[], nonNullValue: any) => {
  const lengthOfData: number = values?.length || 0;
  let nullValueCount: number = 0;
  if (lengthOfData) {
    nullValueCount =
      (((nonNullValue?.null || 0) + (nonNullValue?.empty || 0)) / 100) * lengthOfData || 0;
  }
  return nullValueCount.toFixed(0);
};
