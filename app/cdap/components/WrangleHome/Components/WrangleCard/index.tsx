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

import { Box, Card, Typography } from '@material-ui/core';
import DataPrepStore from 'components/DataPrep/store';
import { useStyles } from 'components/WrangleHome/Components/WrangleCard/styles';
import { getUpdatedConnectorCards } from 'components/WrangleHome/services/getUpdatedConnectorCards';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { IConnector, IWrangleCard } from 'components/WrangleHome/Components/WrangleCard/types';

export default function({ toggleViewAllLink }: IWrangleCard) {
  const [connectorsData, setConnectorsData] = useState<{ connectorTypes: IConnector[] }>({
    connectorTypes: [],
  });

  // Fetching all the fetchedConnectorTypes and adding SVG its object to each connectorType and
  // then using unshift function to add an object for Imported Dataset to entire ConnectorTypes Array.

  const classes = useStyles();
  const connectorTypes: IConnector[] = connectorsData.connectorTypes;

  const updateState = (updatedState: { connectorTypes: IConnector[] }) => {
    if (
      updatedState.hasOwnProperty('connectorTypes') &&
      Array.isArray(updatedState.connectorTypes) &&
      updatedState.connectorTypes.length > 5
    ) {
      toggleViewAllLink(true);
    } else {
      toggleViewAllLink(false);
    }
    setConnectorsData(updatedState);
  };

  const [fetchedConnectorsData, setFetchedConnectorsData] = useState([]);

  DataPrepStore.subscribe(() => {
    const newState = DataPrepStore.getState();
    setFetchedConnectorsData(newState.dataprep.connectorsWithIcons);
  });

  useEffect(() => {
    getUpdatedConnectorCards(fetchedConnectorsData).then((res) => {
      updateState(res);
    });
  }, [fetchedConnectorsData]);

  let startIndex = 0;
  let endIndex = 2;
  // Here we are finding out the connections are exist in the app or not
  if (connectorTypes?.length > 2) {
    startIndex = 1; // This line is writtern to eliminate the add-connection cards's data from the array
    endIndex = 5;
  }

  return (
    <Box className={classes.wrapper} data-testid="wrangle-card-parent">
      {/* Here we are only showing top 4 connectors on home page */}
      {connectorTypes?.slice(startIndex, endIndex).map((item, index) => {
        return (
          <Link
            to={{
              pathname:
                startIndex === 0
                  ? `/ns/${getCurrentNamespace()}/${item.link}`
                  : index === 0
                  ? `/ns/${getCurrentNamespace()}/${item.link}`
                  : `/ns/${getCurrentNamespace()}/datasources/${item.name}`,
              state: {
                from: { addConnectionRequestFromNewUI: 'home' },
              },
            }}
            style={{ textDecoration: 'none' }}
            data-testid={`wrangle-card-${item.name
              .toLowerCase()
              .split(' ')
              .join('-')}`}
          >
            <Card className={classes.card}>
              <Box className={classes.cardContent} key={index}>
                {item.SVG}
                <Typography className={classes.cardText}>
                  {item.displayName ?? item.name}
                </Typography>
              </Box>
            </Card>
          </Link>
        );
      })}
    </Box>
  );
}
