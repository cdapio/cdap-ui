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

import { IHeaderNamesList } from 'components/WranglerGrid/SelectColumnPanel/types';
import { IGeneralStatistics } from 'components/GridTable/types';

/**
 * @param  {Record<string, IGeneralStatistics>} statistics
 * @param  {IHeaderNamesList[]} columnList
 * @return {Record<string, string>} This function is used to calculate data quality that is percentage of null values present in the table with respect to column
 */
export const getDataQuality = (
  statistics: Record<string, IGeneralStatistics>,
  columnList: IHeaderNamesList[]
) => {
  const dataQuality: Array<Record<string, string | number>> = [];
  columnList.forEach((columnName: IHeaderNamesList) => {
    const generalValues: Record<string, string | number> = statistics[columnName.name].general;
    if (generalValues.null) {
      const nullCount = generalValues.null || 0;
      dataQuality.push({
        label: columnName.name,
        value: nullCount,
      });
    } else {
      dataQuality.push({
        label: columnName.name,
        value: '0',
      });
    }
  });
  return dataQuality;
};
