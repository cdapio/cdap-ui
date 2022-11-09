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
import { IDataQuality } from 'components/ColumnView/SelectColumnsList/types';
import { IHeaderNamesList } from 'components/GridTable/types';

export const prepareDataQualtiy = (statistics: IDataQuality, columnList: IHeaderNamesList[]) => {
  const dataQualityToArray = statistics && Object.entries(statistics);
  const dataQuality = [];
  Array.isArray(columnList) &&
    columnList.length !== 0 &&
    columnList.map((columnName) => {
      dataQualityToArray?.forEach(([key, value]) => {
        if (columnName.name == key) {
          const generalValues = Object.entries(value);
          Array.isArray(generalValues) &&
            generalValues.length !== 0 &&
            generalValues.forEach(([vKey, vValue]) => {
              if (vKey == 'general') {
                if (vValue.null) {
                  const nullCount = vValue.null || 0;
                  const totalNullEmpty = nullCount;
                  dataQuality.push({
                    label: key,
                    value: totalNullEmpty,
                  });
                } else {
                  dataQuality.push({
                    label: key,
                    value: 0,
                  });
                }
              }
            });
        }
      });
    });
  return dataQuality;
};
