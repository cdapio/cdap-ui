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
import { BigQuery } from 'components/WrangleHome/Components/WrangleCard/iconStore/BigQuerySVG';
import { CloudSQLMySQL } from 'components/WrangleHome/Components/WrangleCard/iconStore/CloudSQLMySQL';
import { CloudSQLPostGreSQL } from 'components/WrangleHome/Components/WrangleCard/iconStore/CloudSQLPostGreSQL';
import { Database } from 'components/WrangleHome/Components/WrangleCard/iconStore/Database';
import { GCS } from 'components/WrangleHome/Components/WrangleCard/iconStore/GCS';
import { Kafka } from 'components/WrangleHome/Components/WrangleCard/iconStore/Kafka';
import { MySQL } from 'components/WrangleHome/Components/WrangleCard/iconStore/MySQL';
import { Oracle } from 'components/WrangleHome/Components/WrangleCard/iconStore/Oracle';
import { PostgreSQL } from 'components/WrangleHome/Components/WrangleCard/iconStore/PostgreSQL';
import { S3 } from 'components/WrangleHome/Components/WrangleCard/iconStore/S3';
import { Spanner } from 'components/WrangleHome/Components/WrangleCard/iconStore/Spanner';
import { SQLServer } from 'components/WrangleHome/Components/WrangleCard/iconStore/SQLServer';
import { useStyles } from 'components/WrangleHome/Components/WrangleCard/styles';
import { getCategorizedConnections } from 'components/Connections/Browser/SidePanel/apiHelpers';
import { ImportDatasetIcon } from 'components/WrangleHome/Components/WrangleCard/iconStore/ImportDatasetIcon';

export default function WrangleCard() {
  const [connectorTypes, setConnectorTypes] = useState({
    fetchedConnectorTypes: [],
  });

  // Fetching all the fetchedConnectorTypes and adding SVG its object to each connectorType and
  // then using unshift function to add an object for Imported Dataset to entire ConnectorTypes Array.
  const getConnectorTypesNames = async () => {
    let fetchedConnectorTypesFromAPI = await fetchConnectors();
    const categorizedConnections = await getCategorizedConnections();
    const connectorTypeWithConnections = [];
    categorizedConnections.forEach((itemEach, key) => {
      connectorTypeWithConnections.push(key);
    });
    fetchedConnectorTypesFromAPI = fetchedConnectorTypesFromAPI.map((connectorType) => {
      if (connectorType.name === 'S3') {
        return {
          ...connectorType,
          SVG: S3,
        };
      } else if (connectorType.name === 'Database') {
        return {
          ...connectorType,
          SVG: Database,
        };
      } else if (connectorType.name === 'BigQuery') {
        return {
          ...connectorType,
          SVG: BigQuery,
        };
      } else if (connectorType.name === 'GCS') {
        return {
          ...connectorType,
          SVG: GCS,
        };
      } else if (connectorType.name === 'Spanner') {
        return {
          ...connectorType,
          SVG: Spanner,
        };
      } else if (connectorType.name === 'Kafka') {
        return {
          ...connectorType,
          SVG: Kafka,
        };
      } else if (connectorType.name === 'SQL Server') {
        return {
          ...connectorType,
          SVG: SQLServer,
        };
      } else if (connectorType.name === 'MySQL') {
        return {
          ...connectorType,
          SVG: MySQL,
        };
      } else if (connectorType.name === 'Oracle') {
        return {
          ...connectorType,
          SVG: Oracle,
        };
      } else if (connectorType.name === 'PostgreSQL') {
        return {
          ...connectorType,
          SVG: PostgreSQL,
        };
      } else if (connectorType.name === 'File') {
        return {
          ...connectorType,
          SVG: ImportDatasetIcon,
        };
      } else if (connectorType.name === 'CloudSQLMySQL') {
        return {
          ...connectorType,
          SVG: CloudSQLMySQL,
        };
      } else if (connectorType.name === 'CloudSQLPostgreSQL') {
        return {
          ...connectorType,
          SVG: CloudSQLPostGreSQL,
        };
      } else {
        return {
          ...connectorType,
          SVG: BigQuery,
        };
      }
    });

    /* remove the other connector Types based on getCategorized connections */

    fetchedConnectorTypesFromAPI = fetchedConnectorTypesFromAPI.filter((obj) =>
      connectorTypeWithConnections.find((each) => each === obj.name)
    );

    fetchedConnectorTypesFromAPI.unshift({
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

    setConnectorTypes({
      fetchedConnectorTypes: fetchedConnectorTypesFromAPI,
    });
  };

  useEffect(() => {
    getConnectorTypesNames();
  }, []);

  const classes = useStyles();
  const fetchedConnectorTypes = connectorTypes.fetchedConnectorTypes;
  return (
    <Box className={classes.wrapper} data-testid="wrangle-card-parent">
      {fetchedConnectorTypes.map((item, index) => {
        return (
          <Link
            to={`/ns/${getCurrentNamespace()}/datasources/${item.name}`}
            style={{ textDecoration: 'none' }}
            data-testid={'item' + index}
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
}
