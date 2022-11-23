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
  IOngoingExplorationCard,
  IMassagedObject,
} from 'components/WrangleHome/Components/OngoingDataExploration/types';
import { importDatasetIcon } from 'components/WrangleHome/Components/WrangleCard/iconStore/importDataset';

export const generateDataForExplorationCard = (oldData: IOngoingExplorationCard[]) => {
  // Massaging the data to map the API response to the Ongoing Data Exploration List
  const massagedArray = [];

  if (oldData && Array.isArray(oldData) && oldData.length) {
    oldData.forEach((eachItem) => {
      const childArray = [];

      Object.keys(eachItem).map((keys) => {
        const obj = {} as IMassagedObject;

        if (keys === 'connectionName') {
          obj.icon = importDatasetIcon;
          obj.label = eachItem[keys];
          obj.type = 'iconWithText';
        } else if (keys === 'workspaceName') {
          obj.label = eachItem[keys];
          obj.type = 'text';
        } else if (keys === 'recipeSteps') {
          obj.label = `${eachItem[keys]} Recipe steps`;
          obj.type = 'text';
        } else if (keys === 'dataQuality') {
          obj.label = Number(eachItem[keys]);
          obj.percentageSymbol = '%';
          obj.subText = 'Data Quality';
          obj.type = 'percentageWithText';
        } else if (keys === 'workspaceId') {
          obj.workspaceId = eachItem[keys];
        }
        childArray.push(obj);
      });

      massagedArray.push(childArray);
    });
  }

  return massagedArray;
};
