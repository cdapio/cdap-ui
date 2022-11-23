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
import {
  IConnectionWithConnectorType,
  IExistingExplorationCard,
  IConnectionsList,
  IWorkspace,
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
import { IExplorationCardDetails } from '../OngoingDataExplorationsCard/types';

export default function() {
  const [onGoingExplorationsData, setOnGoingExplorationsData] = useState<IExplorationCardDetails[]>(
    []
  );

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
      context: 'default',
    })
      .pipe(
        switchMap((response: Record<string, unknown[]>) => {
          let values: IWorkspace[] = [];
          values = response?.values ?? [];

          // sorting the workspaces based on dataset created time.
          values.sort((a, b) => b.createdTimeMillis - a.createdTimeMillis);

          const workspaces = values.map((eachValue) => {
            const params = {
              context: 'default',
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
              let dataQuality = 0;
              workspace?.headers?.forEach((eachWorkspaceHeader) => {
                const general = workspace.summary?.statistics[eachWorkspaceHeader]?.general;
                // Here we are getting empty & non-null(renaming it as nonEmpty) values from general(API Response) and provinding default values for them
                const { empty: empty = 0, 'non-null': nonEmpty = 100 } = general;

                // Round number to next lowest .1%
                // Number.toFixed() can round up and leave .0 on integers
                const nonNull = Math.floor((nonEmpty - empty) * 10) / 10;
                dataQuality = dataQuality + nonNull;
              });
              const totalDataQuality = dataQuality / workspace.headers?.length ?? 1;
              explorationData[index].dataQuality = totalDataQuality;
              explorationData[index].count = workspace.count;
              const final = getUpdatedExplorationCards(explorationData);
              setOnGoingExplorationsData(final);
            });
        }
      });
  }, []);

  useEffect(() => {
    getOngoingData();
  }, []);

  const filteredData = onGoingExplorationsData.filter(
    (eachWorkspace) => eachWorkspace[6].count !== 0
  );

  return (
    <Box data-testid="ongoing-data-explore-parent">
      {filteredData &&
        Array.isArray(filteredData) &&
        filteredData?.map((item, index) => {
          console.log(item, 'item');
          return (
            <Link
              to={{
                pathname: `/ns/${getCurrentNamespace()}/wrangler-grid/${`${item[5].workspaceId}`}`,
                state: {
                  from: T.translate('features.Breadcrumb.labels.wrangleHome'),
                  path: T.translate('features.Breadcrumb.params.wrangleHome'),
                },
              }}
              style={{ textDecoration: 'none' }}
              data-testid={`wrangler-home-ongoing-data-exploration-card-${index}`}
            >
              {index <= 1 && (
                <OngoingDataExplorationsCard
                  explorationCardDetails={item}
                  key={index}
                  cardIndex={index}
                />
              )}
            </Link>
          );
        })}
    </Box>
  );
}
