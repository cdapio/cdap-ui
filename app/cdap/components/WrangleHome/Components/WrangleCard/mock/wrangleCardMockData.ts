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

export const wrangleCardFetchConnectors = [
  {
    name: 'S3',
    type: 'connector',
    category: 'Amazon Web Services',
    description: 'Connection to access data in Amazon S3.',
    className: 'io.cdap.plugin.aws.s3.connector.S3Connector',
    artifact: {
      name: 'amazon-s3-plugins',
      version: '1.18.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'CloudSQLMySQL',
    type: 'connector',
    category: 'Database',
    description: 'Connection to access data in CloudSQL MySQL Server databases using JDBC.',
    className: 'io.cdap.plugin.cloudsql.mysql.CloudSQLMySQLConnector',
    artifact: {
      name: 'cloudsql-mysql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'CloudSQLPostgreSQL',
    type: 'connector',
    category: 'Database',
    description: 'Connection to access data in CloudSQL PostgreSQL Server databases using JDBC.',
    className: 'io.cdap.plugin.cloudsql.postgres.CloudSQLPostgreSQLConnector',
    artifact: {
      name: 'cloudsql-postgresql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'File',
    type: 'connector',
    category: 'File',
    description: 'Connection to browse and sample data from the local file system.',
    className: 'io.cdap.plugin.batch.connector.FileConnector',
    artifact: {
      name: 'core-plugins',
      version: '2.10.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'Database',
    type: 'connector',
    category: 'Database',
    description: 'Connection to access data in relational databases using JDBC.',
    className: 'io.cdap.plugin.db.connector.DBConnector',
    artifact: {
      name: 'database-plugins',
      version: '2.10.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'BigQuery',
    type: 'connector',
    category: 'Google Cloud Platform',
    description: 'Connection to access data in BigQuery datasets and tables.',
    className: 'io.cdap.plugin.gcp.bigquery.connector.BigQueryConnector',
    artifact: {
      name: 'google-cloud',
      version: '0.21.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'GCS',
    type: 'connector',
    category: 'Google Cloud Platform',
    description: 'Connection to access data in Google Cloud Storage.',
    className: 'io.cdap.plugin.gcp.gcs.connector.GCSConnector',
    artifact: {
      name: 'google-cloud',
      version: '0.21.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'Spanner',
    type: 'connector',
    category: 'Google Cloud Platform',
    description: 'Connection to access data in Spanner databases and tables.',
    className: 'io.cdap.plugin.gcp.spanner.connector.SpannerConnector',
    artifact: {
      name: 'google-cloud',
      version: '0.21.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'Kafka',
    type: 'connector',
    category: 'Messaging Systems',
    description: 'Connection to access data in Kafka topics.',
    className: 'io.cdap.plugin.connector.KafkaConnector',
    artifact: {
      name: 'kafka-plugins-client',
      version: '3.1.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'SQL Server',
    type: 'connector',
    category: 'Database',
    description: 'Connection to access data in SQL Server databases using JDBC.',
    className: 'io.cdap.plugin.mssql.SqlServerConnector',
    artifact: {
      name: 'mssql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'MySQL',
    type: 'connector',
    category: 'Database',
    description: 'Connection to access data in Mysql databases using JDBC.',
    className: 'io.cdap.plugin.mysql.MysqlConnector',
    artifact: {
      name: 'mysql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'Oracle',
    type: 'connector',
    category: 'Database',
    description: 'Connection to access data in Oracle databases using JDBC.',
    className: 'io.cdap.plugin.oracle.OracleConnector',
    artifact: {
      name: 'oracle-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
  {
    name: 'PostgreSQL',
    type: 'connector',
    category: 'Database',
    description: 'Connection to access data in PostgreSQL databases using JDBC.',
    className: 'io.cdap.plugin.postgres.PostgresConnector',
    artifact: {
      name: 'postgresql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
  },
];

export const wrangleCardDummyResPostGresSql = [
  {
    name: 'TESTING',
    connectionId: 'TESTING',
    connectionType: 'PostgreSQL',
    description: '',
    preConfigured: false,
    isDefault: false,
    createdTimeMillis: 1663766799085,
    updatedTimeMillis: 1663766799085,
    plugin: {
      category: 'Database',
      name: 'PostgreSQL',
      type: 'connector',
      properties: {
        host: 'jenkins.divami.com',
        port: '5432',
        jdbcPluginName: 'postgresql',
        database: 'exlaibias',
        user: 'postgres',
        password: 'divami',
        connectionArguments: '1=1',
      },
      artifact: {
        scope: 'SYSTEM',
        name: 'postgresql-plugin',
        version: '1.9.0-SNAPSHOT',
      },
    },
  },
];

export const wrangleCardDummyResFile = [
  {
    name: 'fjhgkhjl',
    connectionId: 'fjhgkhjl',
    connectionType: 'File',
    description: '',
    preConfigured: false,
    isDefault: false,
    createdTimeMillis: 1663766703232,
    updatedTimeMillis: 1663766703232,
    plugin: {
      category: 'File',
      name: 'File',
      type: 'connector',
      properties: {},
      artifact: {
        scope: 'SYSTEM',
        name: 'core-plugins',
        version: '2.10.0-SNAPSHOT',
      },
    },
  },
];

export const updatedCardsMockResponse = [
  {
    name: "Add Connection",
    SVG: {
      type: "svg",
      key: null,
      ref: null,
      props: {
        width: "40",
        height: "40",
        viewBox: "0 0 40 40",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
          {
            type: "rect",
            key: null,
            ref: null,
            props: {
              x: "0.307129",
              y: "16.21",
              width: "39.386",
              height: "7",
              fill: "#FFC107",
            },
            _owner: null,
            _store: {},
          },
          {
            type: "rect",
            key: null,
            ref: null,
            props: {
              x: "16.5",
              y: "39.4033",
              width: "39.386",
              height: "7",
              transform: "rotate(-90 16.5 39.4033)",
              fill: "#43A047",
            },
            _owner: null,
            _store: {},
          },
          {
            type: "rect",
            key: null,
            ref: null,
            props: {
              x: "16.5",
              y: "16.21",
              width: "23.1931",
              height: "7",
              fill: "#2196F3",
            },
            _owner: null,
            _store: {},
          },
          {
            type: "path",
            key: null,
            ref: null,
            props: {
              d: "M16.5 23.4033L16.5 0.0173569H23.5V16.2059L16.5 23.4033Z",
              fill: "#E53935",
            },
            _owner: null,
            _store: {},
          },
        ],
      },
      _owner: null,
      _store: {},
    },
    link: "connections/create",
  },
  {
    name: "Import Data",
    SVG: {
      type: "svg",
      key: null,
      ref: null,
      props: {
        width: "40",
        height: "41",
        viewBox: "0 0 40 41",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
          {
            type: "rect",
            key: null,
            ref: null,
            props: {
              y: "33.5444",
              width: "40",
              height: "6.66667",
              fill: "#FFC107",
            },
            _owner: null,
            _store: {},
          },
          {
            type: "rect",
            key: null,
            ref: null,
            props: {
              x: "20",
              y: "33.5444",
              width: "20",
              height: "6.66667",
              fill: "#E53935",
            },
            _owner: null,
            _store: {},
          },
          {
            type: "path",
            key: null,
            ref: null,
            props: {
              d:
                "M16.6665 28.2109L16.6665 0.210941H23.3332V28.2109H16.6665Z",
              fill: "#2196F3",
            },
            _owner: null,
            _store: {},
          },
          {
            type: "path",
            key: null,
            ref: null,
            props: {
              "fill-rule": "evenodd",
              "clip-rule": "evenodd",
              d:
                "M20.3052 32.2617L36.0508 15.9567L31.2552 11.3256L20.1409 22.8348L8.63134 11.7202L4.00029 16.5158L15.5098 27.6304L15.5096 27.6307L20.3052 32.2617Z",
              fill: "#43A047",
            },
            _owner: null,
            _store: {},
          },
        ],
      },
      _owner: null,
      _store: {},
    },
    link: "home",
  },
  {
    name: "PostgreSQL",
    time: 1665646820205,
    SVG: {
      key: null,
      ref: null,
      props: {
        label: "PostgreSQL",
      },
      _owner: null,
      _store: {},
    },
    displayName: "PostgreSQL",
  },
  {
    name: "File",
    time: 1665479458620,
    SVG: {
      key: null,
      ref: null,
      props: {
        label: "File",
      },
      _owner: null,
      _store: {},
    },
    displayName: "File",
  },
]
