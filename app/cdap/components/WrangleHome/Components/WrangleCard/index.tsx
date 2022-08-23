import { Box, Card, Typography } from '@material-ui/core';
import { fetchConnectors } from 'components/Connections/Create/reducer';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Bigquery } from './iconStore/Bigquery';
import { CloudSQLMySQL } from './iconStore/CloudSQLMySQL';
import { CloudSQLPostGreSQL } from './iconStore/CloudSQLPostGreSQL';
import { Database } from './iconStore/Database';
import { GCS } from './iconStore/GCS';
import { ImportDatasetIcon } from './iconStore/ImportDatasetIcon';
import { Kafka } from './iconStore/Kafka';
import { MySQL } from './iconStore/MySQL';
import { Oracle } from './iconStore/Oracle';
import { PostGRESSQL } from './iconStore/PostGRESQL';
import { S3 } from './iconStore/S3';
import { Spanner } from './iconStore/Spanner';
import { SQLServer } from './iconStore/SQLServer';
import { useStyles } from './styles';

const WrangleCard = () => {
  const [state, setState] = useState({
    connectorTypes: [],
  });
  const getConnectorTypesNames = async () => {
    let connectorTypes = await fetchConnectors();

    connectorTypes = connectorTypes.map((connectorType) => {
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
          SVG: Bigquery,
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
          SVG: PostGRESSQL,
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
          SVG: Bigquery,
        };
      }
    });

    connectorTypes.unshift({
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
      connectorTypes,
    });
  };
  useEffect(() => {
    getConnectorTypesNames();
  }, []);
  const classes = useStyles();
  const connectorTypes = state.connectorTypes;
  return (
    <Box className={classes.wrapper} data-testid="wrangle-card-parent">
      {connectorTypes.map((item, index) => {
        return (
          <Link
            to={`/ns/${getCurrentNamespace()}/datasets/${item.name}`}
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
