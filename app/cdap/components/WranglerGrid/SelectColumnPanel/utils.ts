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
import { multipleColumnSelected } from 'components/WranglerGrid/SelectColumnPanel/constants';

export const getColumnsSupportedType = (
  transformationDataType: string[],
  columnsList: IHeaderNamesList[]
) => {
  return transformationDataType?.length > 0 && transformationDataType?.includes('all')
    ? transformationDataType?.filter((supportedType: string) => supportedType === 'all')
    : columnsList?.filter((columnDetail: IHeaderNamesList) => {
        return transformationDataType?.some((dataTypeCollection: string | string[]) => {
          return dataTypeCollection?.includes(columnDetail?.type[0]?.toLowerCase());
        });
      });
};

export const getFilteredColumn = (
  transformationDataType: string[],
  columnsList: IHeaderNamesList[]
) => {
  return transformationDataType?.length > 0 && transformationDataType?.includes('all')
    ? columnsList
    : columnsList?.filter((columnDetail: IHeaderNamesList) => {
        return transformationDataType?.some((dataTypeCollection: string | string[]) => {
          return dataTypeCollection?.includes(columnDetail?.type[0]?.toLowerCase());
        });
      });
};

export const enableDoneButton = (transformationName, selectedColumns) => {
  if (
    multipleColumnSelected.filter(
      (functionNameDetail: IMultipleSelectedFunctionDetail) =>
        functionNameDetail.value === transformationName && !functionNameDetail.isMoreThanTwo
    )?.length
  ) {
    return selectedColumns?.length === 2 ? false : true;
  } else if (
    multipleColumnSelected.filter(
      (functionNameDetail: IMultipleSelectedFunctionDetail) =>
        functionNameDetail.value === transformationName && functionNameDetail.isMoreThanTwo
    )?.length
  ) {
    return selectedColumns?.length >= 1 ? false : true;
  } else {
    return selectedColumns?.length >= 1 ? false : true;
  }
};
