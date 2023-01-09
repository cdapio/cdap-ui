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

import { Box } from '@material-ui/core/';
import MyDataPrepApi from 'api/dataprep';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import NoRecordScreen from 'components/NoRecordScreen';
import {
  IConnectionWithConnectorType,
  IExistingExplorationCard,
  IConnectionsList,
  IWorkspace,
  IOngoingDataExplorationsProps,
} from 'components/WrangleHome/Components/OngoingDataExplorations/types';
import { getUpdatedExplorationCards } from 'components/WrangleHome/Components/OngoingDataExplorations/utils';
import OngoingDataExplorationsCard from 'components/WrangleHome/Components/OngoingDataExplorationsCard';
import T from 'i18n-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { defaultIfEmpty, switchMap } from 'rxjs/operators';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { IExplorationCardDetails } from 'components/WrangleHome/Components/OngoingDataExplorationsCard/types';
import styled from 'styled-components';

const OngoingExplorationCardLink = styled(Link)`
  text-decoration: none !important;
`;

export default function({
  cardCount,
  fromAddress,
  setLoading,
  setShowExplorations,
}: IOngoingDataExplorationsProps) {
  const [onGoingExplorationsData, setOnGoingExplorationsData] = useState<
    IExplorationCardDetails[][]
  >([]);

  const getOngoingData = useCallback(async () => {
    const connectionsWithConnectorTypes: Map<
      string,
      IConnectionsList[]
    > = await getCategorizedConnections();
    const connectionsWithConnectorTypeData: IConnectionWithConnectorType[] = [];
    for (const connectorName of connectionsWithConnectorTypes.keys()) {
      const values = connectionsWithConnectorTypes.get(connectorName);
      const connections = values.map((eachValue) => ({
        name: eachValue.name,
        connectorType: eachValue.connectionType,
      }));
      connectionsWithConnectorTypeData.push(...connections);
    }

    // return corresponding connector name for the given connection name param
    const findConnectorType = (connection: string) => {
      if (connection) {
        const matchedConnection: IConnectionWithConnectorType = connectionsWithConnectorTypeData.find(
          (eachConnection) => eachConnection.name === connection.replace('_', ' ')
        );
        return matchedConnection ? matchedConnection.connectorType : undefined;
      }
      return T.translate(
        'features.WranglerNewUI.OnGoingDataExplorations.labels.importedDataset'
      ).toString();
    };

    const explorationData: IExistingExplorationCard[] = [];

    // Getting the workspace name, path ,workspaceId and name from MyDataPrepApi.getWorkspaceList API and
    //  using these in params and requestBody to get Data quality from MyDataPrepApi.execute API
    MyDataPrepApi.getWorkspaceList({
      context: getCurrentNamespace(),
    })
      .pipe(
        switchMap((response: Record<string, unknown[]>) => {
          let values: IWorkspace[] = [];
          values = response?.values ?? [];

          // sorting the workspaces based on dataset created time.
          values.sort((a, b) => b.createdTimeMillis - a.createdTimeMillis);

          const workspaces = values.map((eachValue) => {
            const params = {
              context: getCurrentNamespace(),
              workspaceId: eachValue.workspaceId,
            };
            const requestBody = {
              directives: eachValue.directives,
              limit: 1000,
              insights: {
                name: eachValue?.sampleSpec?.connectionName,
                workspaceName: eachValue.workspaceName,
                path: eachValue?.sampleSpec?.path,
                visualization: {},
              },
            };

            const connectorName: string | undefined = findConnectorType(
              eachValue?.sampleSpec?.connectionName
            );
            if (connectorName) {
              explorationData.push({
                connectorType: connectorName,
                connectionName: eachValue?.sampleSpec?.connectionName
                  ? eachValue?.sampleSpec?.connectionName
                  : T.translate(
                      'features.WranglerNewUI.OnGoingDataExplorations.labels.importedDataset'
                    ).toString(),
                workspaceName: eachValue.workspaceName,
                recipeSteps: eachValue.directives?.length ?? 0,
                dataQuality: null,
                workspaceId: eachValue.workspaceId,
                count: 0,
              });
              return MyDataPrepApi.execute(params, requestBody);
            }
            return of(undefined);
          });
          return forkJoin(workspaces).pipe(defaultIfEmpty(null));
        })
      )
      .subscribe((responses) => {
        if (responses && Array.isArray(responses) && responses.length) {
          responses
            ?.filter((eachResponse) => eachResponse)
            .forEach((workspace, index) => {
              let NullValuesPercentage = 0;
              workspace?.headers?.forEach((eachWorkspaceHeader) => {
                const general = workspace.summary?.statistics[eachWorkspaceHeader]?.general;
                // Adding null percentage to NullValuesPercentage if we get null percentage directly
                if (general.null) {
                  NullValuesPercentage = NullValuesPercentage + general.null;
                }
                // Adding NullValuesPercentage when we get non-null percentage but not NULL percentage from API
                else {
                  NullValuesPercentage = NullValuesPercentage + (100 - general['non-null']);
                }
              });
              // calculating cumulative null values percentage
              const totalNullValuesPercentage = NullValuesPercentage / workspace.headers?.length;
              explorationData[index].dataQuality = totalNullValuesPercentage;
              explorationData[index].count = workspace.count;
            });
        }
        const ongoingDataExplorationsCardsData = getUpdatedExplorationCards(explorationData);
        setOnGoingExplorationsData(ongoingDataExplorationsCardsData);
        setShowExplorations &&
          setShowExplorations(
            Boolean(ongoingDataExplorationsCardsData) &&
              Array.isArray(ongoingDataExplorationsCardsData) &&
              ongoingDataExplorationsCardsData.length
              ? true
              : false
          );
        setLoading && setLoading(false);
      });
  }, []);

  useEffect(() => {
    getOngoingData();
  }, []);

  const filteredOnGoingExplorationsData = onGoingExplorationsData.filter(
    (eachWorkspace) => eachWorkspace[6].count !== 0
  );

  const getOngoingDataExplorationsCards = (
    filteredOnGoingExplorationsData: IExplorationCardDetails[][]
  ) => {
    const isFilteredDataPresent =
      filteredOnGoingExplorationsData &&
      Array.isArray(filteredOnGoingExplorationsData) &&
      filteredOnGoingExplorationsData.length;
    if (!isFilteredDataPresent && fromAddress === 'Workspaces') {
      return (
        <NoRecordScreen
          title={T.translate('features.WranglerNewUI.NoRecordScreen.workspacesList.title')}
          subtitle={T.translate('features.WranglerNewUI.NoRecordScreen.workspacesList.subtitle')}
        />
      );
    }
    return filteredOnGoingExplorationsData
      ?.slice(0, cardCount && cardCount)
      .map((eachExplorationCardData, cardIndex) => {
        return (
          <OngoingExplorationCardLink
            to={{
              pathname: `/ns/${getCurrentNamespace()}/wrangler-grid/${`${eachExplorationCardData[5].workspaceId}`}`,
              state: {
                from: fromAddress,
                path: T.translate('features.WranglerNewUI.Breadcrumb.params.wrangleHome'),
              },
            }}
            style={{ textDecoration: 'none' }}
            data-testid={`wrangler-home-ongoing-data-exploration-card-${cardIndex}`}
          >
            <OngoingDataExplorationsCard
              key={`ongoing-data-exploration-card-${cardIndex}`}
              explorationCardDetails={eachExplorationCardData}
              cardIndex={cardIndex}
              fromAddress={fromAddress}
            />
          </OngoingExplorationCardLink>
        );
      });
  };

  return (
    <Box data-testid="ongoing-data-explore-parent">
      {getOngoingDataExplorationsCards(filteredOnGoingExplorationsData)}
    </Box>
  );
}
