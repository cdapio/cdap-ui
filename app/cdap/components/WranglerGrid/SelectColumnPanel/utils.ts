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

import {
  IHeaderNamesList,
  IMultipleSelectedFunctionDetail,
} from 'components/WranglerGrid/SelectColumnPanel/types';
import { MULTI_SELECTION_COLUMN } from 'components/WranglerGrid/SelectColumnPanel/constants';

/**
 * @param  {string[]} transformationDataType
 * @param  {IHeaderNamesList[]} columnsList
 * @return {IHeaderNamesList[]} returns the list of column based on the transformation/option selected
 * For Example ADD, this can be performed on column whose datatype is int/float/double so this function will return only those
 * columns whose dataype int/float/double
 */
export const getFilteredColumn = (
  transformationDataType: string[], // list of data types that are supported by the selected transformation
  columnsList: IHeaderNamesList[] // list of all existing columns
) => {
  if (transformationDataType.length && transformationDataType.includes('all')) {
    return columnsList;
  }

  return columnsList.filter((columnDetail: IHeaderNamesList) =>
    transformationDataType.some((dataTypeCollection: string) =>
      dataTypeCollection.includes(columnDetail.type[0].toLowerCase())
    )
  );
};

/**
 * @param  {string} transformationName
 * @param  {IHeaderNamesList[]} selectedColumns
 * @return {boolean} enables done button only when atleast one column is selected
 * In case of join and swap two column needs to be selected while in delete/keep more than two selections are posible
 */
export const enableDoneButton = (
  transformationName: string,
  selectedColumns: IHeaderNamesList[]
) => {
  const indexForTwoColumnSelection = MULTI_SELECTION_COLUMN.findIndex(
    (functionNameDetail: IMultipleSelectedFunctionDetail) =>
      functionNameDetail.value === transformationName && !functionNameDetail.isMoreThanTwo
  );
  const indexForMultipleColumnSelection = MULTI_SELECTION_COLUMN.findIndex(
    (functionNameDetail: IMultipleSelectedFunctionDetail) =>
      functionNameDetail.value === transformationName && functionNameDetail.isMoreThanTwo
  );
  if (indexForTwoColumnSelection > -1) {
    return selectedColumns.length !== 2; // implies that the button should be enabled on when two columns are selected
  }
  if (indexForMultipleColumnSelection > -1) {
    return !(selectedColumns.length >= 1); // implies that even if one column is selected the button should be enabled (more than two column selection)
  }
  return !(selectedColumns.length >= 1); // implies case of single selection of radio button only one needs to be selected to enable button
};

/**
 * @param  {string} transformationName
 * @return {boolean} checks whether transformation selected can be applied on single column or multiple column can be selected
 */
export const getIsSingleSelectionCheck = (transformationName: string) =>
  !MULTI_SELECTION_COLUMN.some(
    (functionDetail: IMultipleSelectedFunctionDetail) =>
      functionDetail.value.toLowerCase() === transformationName.toLowerCase()
  );
