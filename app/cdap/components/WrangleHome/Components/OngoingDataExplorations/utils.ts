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

import DataPrepStore from 'components/DataPrep/store';
import {
  IExistingExplorationCard,
  IOnGoingDataExplorationsData,
} from 'components/WrangleHome/Components/OngoingDataExplorations/types';
import T from 'i18n-react';

const PREFIX = 'features.WranglerNewUI.OnGoingDataExplorations.labels';

export const getUpdatedExplorationCards = (
  existingExplorationCards: IExistingExplorationCard[]
) => {
  // Massaging the data to map the API response to the Ongoing Data Exploration List
  const updatedExplorationCards = [];
  const { dataprep } = DataPrepStore.getState();
  const { connectorsWithIcons } = dataprep;

  const getIconForConnector = (connectorName: string) => {
    const matchingConnector = connectorsWithIcons?.find(
      (eachConnector) => eachConnector.name === connectorName
    );
    return matchingConnector?.SVG;
  };

  if (
    existingExplorationCards &&
    Array.isArray(existingExplorationCards) &&
    existingExplorationCards.length
  ) {
    existingExplorationCards.forEach((eachExplorationCard) => {
      const eachExplorationCardData = [];
      Object.keys(eachExplorationCard).forEach((keys) => {
        const onGoingDatExplorationData = {} as IOnGoingDataExplorationsData;
        switch (keys) {
          case 'connectorType':
            onGoingDatExplorationData.icon = getIconForConnector(eachExplorationCard[keys]);
            onGoingDatExplorationData.label = eachExplorationCard[keys];
            onGoingDatExplorationData.type = 'icon';
            break;
          case 'connectionName':
            onGoingDatExplorationData.label = eachExplorationCard[keys];
            onGoingDatExplorationData.type = 'iconWithText';
            break;
          case 'workspaceName':
            onGoingDatExplorationData.label = eachExplorationCard[keys];
            onGoingDatExplorationData.type = 'text';
            break;
          case 'recipeSteps':
            onGoingDatExplorationData.label = [
              eachExplorationCard[keys],
              T.translate(`${PREFIX}.recipeSteps`),
            ].join(' ');
            onGoingDatExplorationData.type = 'text';
            break;
          case 'dataQuality':
            onGoingDatExplorationData.label = Number(eachExplorationCard[keys]);
            onGoingDatExplorationData.percentageSymbol = '%';
            onGoingDatExplorationData.subText = T.translate(`${PREFIX}.nullValues`);
            onGoingDatExplorationData.type = 'percentageWithText';
            break;
          case 'workspaceId':
            onGoingDatExplorationData.workspaceId = eachExplorationCard[keys];
            break;
          case 'count':
            onGoingDatExplorationData.count = eachExplorationCard[keys];
            break;
        }
        eachExplorationCardData.push(onGoingDatExplorationData);
      });

      updatedExplorationCards.push(eachExplorationCardData);
    });
  }

  return updatedExplorationCards;
};
