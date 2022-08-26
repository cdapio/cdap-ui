import React from 'react';

export const convertNonNullPercent = (gridData, key, nonNullValue) => {
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

export const checkFrequentlyOccuredValues = (gridData, key) => {
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
