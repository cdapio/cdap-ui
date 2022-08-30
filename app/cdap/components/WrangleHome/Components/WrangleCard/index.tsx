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
import { fetchConnectors } from 'components/Connections/Create/reducer';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { useStyles } from './styles';
import { getCategoriesToConnectorsMap, getSVG } from './Components/WidgetData';
import { fetchConnectionDetails } from 'components/Connections/Create/reducer';
import { ImportDatasetIcon } from './iconStore/ImportDatasetIcon';

const WrangleCard = () => {
  const [state, setState] = useState({
    connectorTypes: [],
  });

  const widgetData = async () => {
    const connectorTypes = await fetchConnectors();
    const connectorDataArray = [];
    const connectorDataWithSvgArray = [];
    const allConnectorsPluginProperties: any = getCategoriesToConnectorsMap(connectorTypes);
    const connectionPayloadArray = [];
    allConnectorsPluginProperties.forEach((connectorsArray) => {
      if (connectorsArray.length) {
        connectorsArray.map((item) => {
          connectionPayloadArray.push(item);
        });
      }
    });
    const connectionDetailsData = await Promise.all(
      connectionPayloadArray.map(async (item, index) => {
        const selectedConnector = {
          artifact: item.artifact,
          category: item.category,
          name: item.name,
          type: item.type,
        };
        connectorDataArray.push(selectedConnector);
        return new Promise((resolve, reject) => {
          const response = fetchConnectionDetails(selectedConnector);
          if (response) {
            resolve(response);
          }
        });
      })
    );
    const connectorWidgetJson = connectionDetailsData.map(
      ({ connectorWidgetJSON }) => connectorWidgetJSON
    );
    connectorWidgetJson.map((item) => {
      connectorDataArray.map((connectorType) => {
        if (item['display-name'] && item['display-name'].includes(connectorType.name)) {
          connectorDataWithSvgArray.push({
            ...connectorType,
            SVG: getSVG(item?.icon?.arguments?.data),
          });
        }
      });
    });
    connectorDataWithSvgArray.unshift({
      name: 'Imported Datasets',
      type: 'default',
      category: 'default',
      description: 'All Connections from the List',
      artifact: {
        name: 'allConnections',
        version: 'local',
        scope: 'local',
      },

      SVG: ImportDatasetIcon,
    });
    setState({
      connectorTypes: connectorDataWithSvgArray,
    });
  };
  useEffect(() => {
    widgetData();
  }, []);
  const classes = useStyles();
  const connectorTypes = state.connectorTypes;
  return (
    <Box className={classes.wrapper} data-testid="wrangle-card-parent">
      {connectorTypes.map((item, index) => {
        return (
          <Link
            to={`/ns/${getCurrentNamespace()}/datasources/${item.name}`}
            style={{ textDecoration: 'none' }}
          >
            <Card className={classes.card}>
              <Box className={classes.cardContent} key={index}>
                {item.SVG}
                <Typography className={classes.cardText}>{item.name}</Typography>
              </Box>
            </Card>
          </Link>
        );
      })}
    </Box>
  );
};
export default WrangleCard;
