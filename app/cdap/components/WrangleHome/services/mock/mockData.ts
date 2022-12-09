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

export const fetchConnectorMock = [
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

export const postGresMock = [
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

export const fileMock = [
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

export const msgSystemsMock = [
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
    olderVersions: [],
  },
];

export const awsMock = [
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
    olderVersions: [],
  },
];

export const dataBaseMock = [
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
    olderVersions: [],
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
    olderVersions: [],
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
    olderVersions: [],
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
    olderVersions: [],
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
    olderVersions: [],
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
    olderVersions: [],
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
    olderVersions: [],
  },
];

export const googleCloudMock = [
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
    olderVersions: [],
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
    olderVersions: [],
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
    olderVersions: [],
  },
];

export const fileMock2 = [
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
    olderVersions: [],
  },
];

export const propertiesMock = [
  {
    properties: {
      'widgets.S3-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "widget-type": "radio-group",\n          "name": "authenticationMethod",\n          "label": "Authentication Method",\n          "widget-attributes": {\n            "layout": "inline",\n            "default": "Access Credentials",\n            "options": [\n              {\n                "id": "Access Credentials",\n                "label": "Access Credentials"\n              },\n              {\n                "id": "IAM",\n                "label": "IAM"\n              }\n            ]\n          }\n        },\n        {\n          "widget-type": "textbox",\n          "name": "accessID",\n          "label": "Access ID",\n          "widget-attributes": {"placeholder": "Amazon Access ID"}\n        },\n        {\n          "widget-type": "password",\n          "name": "accessKey",\n          "label": "Access Key",\n          "widget-attributes": {"placeholder": "Amazon Access Key"}\n        },\n        {\n          "widget-type": "sessiontoken",\n          "name": "sessionToken",\n          "label": "Session Token",\n          "widget-attributes": {"placeholder": "Amazon temporary credential session token"}\n        },\n        {\n          "widget-type": "select",\n          "name": "region",\n          "label": "Region",\n          "widget-attributes": {"values": [\n            {\n              "label": "US East (Ohio) - us-east-2",\n              "value": "us-east-2"\n            },\n            {\n              "label": "US East (N. Virginia) - us-east-1",\n              "value": "us-east-1"\n            },\n            {\n              "label": "US West (N. California) - us-west-1",\n              "value": "us-west-1"\n            },\n            {\n              "label": "US West (Oregon) - us-west-2",\n              "value": "us-west-2"\n            },\n            {\n              "label": "Asia Pacific (Mumbai) - ap-south-1",\n              "value": "ap-south-1"\n            },\n            {\n              "label": "Asia Pacific (Seoul) - ap-northeast-2",\n              "value": "ap-northeast-2"\n            },\n            {\n              "label": "Asia Pacific (Singapore) - ap-southeast-1",\n              "value": "ap-southeast-1"\n            },\n            {\n              "label": "Asia Pacific (Sydney) - ap-southeast-2",\n              "value": "ap-southeast-2"\n            },\n            {\n              "label": "Asia Pacific (Tokyo) - ap-northeast-1",\n              "value": "ap-northeast-1"\n            },\n            {\n              "label": "Canada (Central) - ca-central-1",\n              "value": "ca-central-1"\n            },\n            {\n              "label": "EU (Frankfurt) - eu-central-1",\n              "value": "eu-central-1"\n            },\n            {\n              "label": "EU (Ireland) - eu-west-1",\n              "value": "eu-west-1"\n            },\n            {\n              "label": "EU (London) - eu-west-2",\n              "value": "eu-west-2"\n            },\n            {\n              "label": "South America (São Paulo) - sa-east-1",\n              "value": "sa-east-1"\n            }\n          ]}\n        }\n      ]\n    },\n    {\n      "label": "Sampling Properties",\n      "properties": [\n        {\n          "widget-type": "plugin-list",\n          "name": "format",\n          "label": "Format",\n          "widget-attributes": {"plugin-type": "validatingInputFormat"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "delimiter",\n          "label": "Delimiter",\n          "widget-attributes": {"placeholder": "Delimiter if the format is \'delimited\'"}\n        },\n        {\n          "widget-type": "toggle",\n          "name": "skipHeader",\n          "label": "Skip Header",\n          "widget-attributes": {\n            "default": "false",\n            "off": {\n              "label": "False",\n              "value": "false"\n            },\n            "on": {\n              "label": "True",\n              "value": "true"\n            }\n          }\n        },\n        {\n          "widget-type": "select",\n          "name": "fileEncoding",\n          "label": "File encoding",\n          "widget-attributes": {\n            "default": "UTF-8",\n            "values": [\n              {\n                "label": "UTF-8",\n                "value": "UTF-8"\n              },\n              {\n                "label": "UTF-32",\n                "value": "UTF-32"\n              },\n              {\n                "label": "ISO-8859-1 (Latin-1 Western European)",\n                "value": "ISO-8859-1"\n              },\n              {\n                "label": "ISO-8859-2 (Latin-2 Central European)",\n                "value": "ISO-8859-2"\n              },\n              {\n                "label": "ISO-8859-3 (Latin-3 South European)",\n                "value": "ISO-8859-3"\n              },\n              {\n                "label": "ISO-8859-4 (Latin-4 North European)",\n                "value": "ISO-8859-4"\n              },\n              {\n                "label": "ISO-8859-5 (Latin/Cyrillic)",\n                "value": "ISO-8859-5"\n              },\n              {\n                "label": "ISO-8859-6 (Latin/Arabic)",\n                "value": "ISO-8859-6"\n              },\n              {\n                "label": "ISO-8859-7 (Latin/Greek)",\n                "value": "ISO-8859-7"\n              },\n              {\n                "label": "ISO-8859-8 (Latin/Hebrew)",\n                "value": "ISO-8859-8"\n              },\n              {\n                "label": "ISO-8859-9 (Latin-5 Turkish)",\n                "value": "ISO-8859-9"\n              },\n              {\n                "label": "ISO-8859-11 (Latin/Thai)",\n                "value": "ISO-8859-11"\n              },\n              {\n                "label": "ISO-8859-13 (Latin-7 Baltic Rim)",\n                "value": "ISO-8859-13"\n              },\n              {\n                "label": "ISO-8859-15 (Latin-9)",\n                "value": "ISO-8859-15"\n              },\n              {\n                "label": "Windows-1250",\n                "value": "Windows-1250"\n              },\n              {\n                "label": "Windows-1251",\n                "value": "Windows-1251"\n              },\n              {\n                "label": "Windows-1252",\n                "value": "Windows-1252"\n              },\n              {\n                "label": "Windows-1253",\n                "value": "Windows-1253"\n              },\n              {\n                "label": "Windows-1254",\n                "value": "Windows-1254"\n              },\n              {\n                "label": "Windows-1255",\n                "value": "Windows-1255"\n              },\n              {\n                "label": "Windows-1256",\n                "value": "Windows-1256"\n              },\n              {\n                "label": "Windows-1257",\n                "value": "Windows-1257"\n              },\n              {\n                "label": "Windows-1258",\n                "value": "Windows-1258"\n              },\n              {\n                "label": "IBM00858",\n                "value": "IBM00858"\n              },\n              {\n                "label": "IBM01140",\n                "value": "IBM01140"\n              },\n              {\n                "label": "IBM01141",\n                "value": "IBM01141"\n              },\n              {\n                "label": "IBM01142",\n                "value": "IBM01142"\n              },\n              {\n                "label": "IBM01143",\n                "value": "IBM01143"\n              },\n              {\n                "label": "IBM01144",\n                "value": "IBM01144"\n              },\n              {\n                "label": "IBM01145",\n                "value": "IBM01145"\n              },\n              {\n                "label": "IBM01146",\n                "value": "IBM01146"\n              },\n              {\n                "label": "IBM01147",\n                "value": "IBM01147"\n              },\n              {\n                "label": "IBM01148",\n                "value": "IBM01148"\n              },\n              {\n                "label": "IBM01149",\n                "value": "IBM01149"\n              },\n              {\n                "label": "IBM037",\n                "value": "IBM037"\n              },\n              {\n                "label": "IBM1026",\n                "value": "IBM1026"\n              },\n              {\n                "label": "IBM1047",\n                "value": "IBM1047"\n              },\n              {\n                "label": "IBM273",\n                "value": "IBM273"\n              },\n              {\n                "label": "IBM277",\n                "value": "IBM277"\n              },\n              {\n                "label": "IBM278",\n                "value": "IBM278"\n              },\n              {\n                "label": "IBM280",\n                "value": "IBM280"\n              },\n              {\n                "label": "IBM284",\n                "value": "IBM284"\n              },\n              {\n                "label": "IBM285",\n                "value": "IBM285"\n              },\n              {\n                "label": "IBM290",\n                "value": "IBM290"\n              },\n              {\n                "label": "IBM297",\n                "value": "IBM297"\n              },\n              {\n                "label": "IBM420",\n                "value": "IBM420"\n              },\n              {\n                "label": "IBM424",\n                "value": "IBM424"\n              },\n              {\n                "label": "IBM437",\n                "value": "IBM437"\n              },\n              {\n                "label": "IBM500",\n                "value": "IBM500"\n              },\n              {\n                "label": "IBM775",\n                "value": "IBM775"\n              },\n              {\n                "label": "IBM850",\n                "value": "IBM850"\n              },\n              {\n                "label": "IBM852",\n                "value": "IBM852"\n              },\n              {\n                "label": "IBM855",\n                "value": "IBM855"\n              },\n              {\n                "label": "IBM857",\n                "value": "IBM857"\n              },\n              {\n                "label": "IBM860",\n                "value": "IBM860"\n              },\n              {\n                "label": "IBM861",\n                "value": "IBM861"\n              },\n              {\n                "label": "IBM862",\n                "value": "IBM862"\n              },\n              {\n                "label": "IBM863",\n                "value": "IBM863"\n              },\n              {\n                "label": "IBM864",\n                "value": "IBM864"\n              },\n              {\n                "label": "IBM865",\n                "value": "IBM865"\n              },\n              {\n                "label": "IBM866",\n                "value": "IBM866"\n              },\n              {\n                "label": "IBM868",\n                "value": "IBM868"\n              },\n              {\n                "label": "IBM869",\n                "value": "IBM869"\n              },\n              {\n                "label": "IBM870",\n                "value": "IBM870"\n              },\n              {\n                "label": "IBM871",\n                "value": "IBM871"\n              },\n              {\n                "label": "IBM918",\n                "value": "IBM918"\n              }\n            ]\n          }\n        }\n      ]\n    }\n  ],\n  "display-name": "S3",\n  "icon": {\n    "arguments": {"data": "data:image/png;base64,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"},\n    "type": "inline"\n  },\n  "filters": [{\n    "condition": {"expression": "authenticationMethod == \'Access Credentials\'"},\n    "name": "AuthByIAM",\n    "show": [\n      {"name": "accessID"},\n      {"name": "accessKey"},\n      {"name": "sessionToken"}\n    ]\n  }]\n}',
      'doc.S3-connector':
        "# Amazon S3 Connection\n\n\nDescription\n-----------\nUse this connection to access data in Amazon S3.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**Authentication Method:** Authentication method to access S3. The default value is Access Credentials.\nIAM can only be used if the plugin is run in an AWS environment, such as on EMR.\n\n**Access ID:** Amazon access ID required for authentication.\n\n**Access Key:** Amazon access key required for authentication.\n\n**Session Token:** Amazon session token required for authentication. Only required for temporary credentials.\nTemporary credentials are only supported for S3A paths.\n\n**Region:** Region to be used by the S3 Client. Note: Region is only used to sample data in Wrangler. It is not used in the S3 batch source plugin in data pipelines.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It's an absolute Amazon S3 path of a file or folder.\n",
    },
    name: 'amazon-s3-plugins',
    version: '1.18.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'widgets.CloudSQLMySQL-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [\n        {\n          "widget-type": "plugin-list",\n          "name": "jdbcPluginName",\n          "label": "JDBC Driver name",\n          "widget-attributes": {"plugin-type": "jdbc"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "database",\n          "label": "Database"\n        },\n        {\n          "widget-type": "radio-group",\n          "name": "instanceType",\n          "label": "CloudSQL Instance Type",\n          "widget-attributes": {\n            "layout": "inline",\n            "default": "public",\n            "options": [\n              {\n                "id": "public",\n                "label": "Public"\n              },\n              {\n                "id": "private",\n                "label": "Private"\n              }\n            ]\n          }\n        },\n        {\n          "widget-type": "textbox",\n          "name": "connectionName",\n          "label": "Connection Name",\n          "widget-attributes": {"placeholder": "CloudSQL instance connection name"}\n        }\n      ]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "widget-type": "textbox",\n          "name": "user",\n          "label": "Username",\n          "widget-attributes": {"placeholder": "The username to use to connect to the CloudSQL database"}\n        },\n        {\n          "widget-type": "password",\n          "name": "password",\n          "label": "Password",\n          "widget-attributes": {"placeholder": "The password to use to connect to the CloudSQL database"}\n        }\n      ]\n    },\n    {\n      "label": "Advanced",\n      "properties": [{\n        "widget-type": "keyvalue",\n        "name": "connectionArguments",\n        "label": "Connection Arguments",\n        "widget-attributes": {\n          "kv-delimiter": "=",\n          "key-placeholder": "Key",\n          "value-placeholder": "Value",\n          "delimiter": ";",\n          "showDelimiter": "false"\n        }\n      }]\n    }\n  ],\n  "display-name": "CloudSQL MySQL"\n}',
      'doc.CloudSQLMySQL-connector':
        '# CloudSQLMySQL Connection\n\n\nDescription\n-----------\nUse this connection to access data in a CloudSQLMySQL database using JDBC.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**JDBC Driver name:** Select the JDBC driver to use.\n\n**CloudSQL Instance Type:** Whether the CloudSQL instance to connect to is private or public. Defaults to \'Public\'.\n\n**Connection Name:** The CloudSQL instance to connect to in the format <PROJECT_ID>:\\<REGION>:<INSTANCE_NAME>.\nCan be found in the instance overview page.\n\n**Database:** MySQL database name.\n\n**Username:** User identity for connecting to the specified database. Required for databases that need\nauthentication. Optional for databases that do not require authentication.\n\n**Password:** Password to use to connect to the specified database.\n\n**Connection Arguments:** A list of arbitrary string tag/value pairs as connection arguments. These arguments\nwill be passed to the JDBC driver, as connection arguments, for JDBC drivers that may need additional configurations.\nThis is a semicolon-separated list of key-value pairs, where each pair is separated by a equals \'=\' and specifies\nthe key and value for the argument. For example, \'key1=value1;key2=value\' specifies that the connection will be\ngiven arguments \'key1\' mapped to \'value1\' and the argument \'key2\' mapped to \'value2\'.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{database}/{table}`\n   This path indicates a table. A table is the only one that can be sampled. Browse on this path to return the specified table.\n\n2. `/{database}`\n   This path indicates a database. A database cannot be sampled. Browse on this path to get all the tables under this database.\n\n3. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the databases visible through this connection.\n\nExamples\n--------\n**Connecting to a public CloudSQL MySQL instance**\n\nSuppose you want to read data from CloudSQL MySQL database named "prod", as "root" user with "root" password (Get the\nlatest version of the CloudSQL socket factory jar with driver and dependencies\n[here](https://github.com/GoogleCloudPlatform/cloud-sql-jdbc-socket-factory/releases)), then configure plugin with:\n\n\n```\nReference Name: "connection1"\nDriver Name: "cloudsql-mysql"\nDatabase: "prod"\nCloudSQL Instance Type: "Public" \nConnection Name: [PROJECT_ID]:[REGION]:[INSTANCE_NAME]\nUsername: "root"\nPassword: "root"\n```\n\n**Connecting to a private CloudSQL MySQL instance**\n\nIf you want to connect to a private CloudSQL MySQL instance, create a Compute Engine VM that runs the CloudSQL Proxy\ndocker image using the following command\n\n```\n# Set the environment variables\nexport PROJECT=[project_id]\nexport REGION=[vm-region]\nexport ZONE=`gcloud compute zones list --filter="name=${REGION}" --limit\n1 --uri --project=${PROJECT}| sed \'s/.*\\///\'`\nexport SUBNET=[vpc-subnet-name]\nexport NAME=[gce-vm-name]\nexport MYSQL_CONN=[mysql-instance-connection-name]\n\n# Create a Compute Engine VM\ngcloud beta compute --project=${PROJECT_ID} instances create ${INSTANCE_NAME}\n--zone=${ZONE} --machine-type=g1-small --subnet=${SUBNE} --no-address\n--metadata=startup-script="docker run -d -p 0.0.0.0:3306:3306\ngcr.io/cloudsql-docker/gce-proxy:1.16 /cloud_sql_proxy\n-instances=${MYSQL_CONNECTION_NAME}=tcp:0.0.0.0:3306" --maintenance-policy=MIGRATE\n--scopes=https://www.googleapis.com/auth/cloud-platform\n--image=cos-69-10895-385-0 --image-project=cos-cloud\n```\n\nOptionally, you can promote the internal IP address of the VM running the Proxy image to a static IP using\n\n```\n# Get the VM internal IP\nexport IP=`gcloud compute instances describe ${NAME} --zone ${ZONE} |\ngrep "networkIP" | awk \'{print $2}\'`\n\n# Promote the VM internal IP to static IP\ngcloud compute addresses create mysql-proxy --addresses ${IP} --region\n${REGION} --subnet ${SUBNET}\n\n\n# Note down the IP to be used in MySQL or PostgreSQL JDBC \n# connection string\necho Proxy IP: ${IP}\n\necho "JDBC Connection strings:"\necho "jdbc:postgresql://${IP}:5432/{PostgreSQL_DB_NAME}"\necho "jdbc:mysql://${IP}:3306/{MySQL_DB_NAME}"\n```\n\nGet the latest version of the CloudSQL socket factory jar with driver and dependencies from\n[here](https://github.com/GoogleCloudPlatform/cloud-sql-jdbc-socket-factory/releases), then configure plugin with:\n\n```\nReference Name: "connection1"\nDriver Name: "cloudsql-mysql"\nDatabase: "prod"\nCloudSQL Instance Type: "Private"\nConnection Name: <proxy-ip> (obtained from commands above)\nUsername: "root"\nPassword: "root"\n```',
    },
    name: 'cloudsql-mysql-plugin',
    version: '1.9.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'doc.CloudSQLPostgreSQL-connector':
        '# CloudSQLPostgreSQL Connection\n\n\nDescription\n-----------\nUse this connection to access data in a CloudSQLPostgreSQL database using JDBC.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**JDBC Driver name:** Select the JDBC driver to use.\n\n**CloudSQL Instance Type:** Whether the CloudSQL instance to connect to is private or public. Defaults to \'Public\'.\n\n**Connection Name:** The CloudSQL instance to connect to in the format <PROJECT_ID>:\\<REGION>:<INSTANCE_NAME>.\nCan be found in the instance overview page.\n\n**Database:** CloudSQL PostgreSQL database name.\n\n**Username:** User identity for connecting to the specified database. Required for databases that need\nauthentication. Optional for databases that do not require authentication.\n\n**Password:** Password to use to connect to the specified database.\n\n**Connection Arguments:** A list of arbitrary string tag/value pairs as connection arguments. These arguments\nwill be passed to the JDBC driver, as connection arguments, for JDBC drivers that may need additional configurations.\nThis is a semicolon-separated list of key-value pairs, where each pair is separated by a equals \'=\' and specifies\nthe key and value for the argument. For example, \'key1=value1;key2=value\' specifies that the connection will be\ngiven arguments \'key1\' mapped to \'value1\' and the argument \'key2\' mapped to \'value2\'.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{schema}/{table}`\n   This path indicates a table. A table is the only one that can be sampled. Browse on this path to return the specified table.\n\n2. `/{schema}`\n   This path indicates a schema. A schema cannot be sampled. Browse on this path to get all the tables under this schema.\n\n3. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the schemas visible through this connection.\n\nExamples\n--------\n**Connecting to a public CloudSQL PostgreSQL instance**\n\nSuppose you want to read data from CloudSQL PostgreSQL database named "prod", as "postgres" user with "postgres"\npassword (Get the latest version of the CloudSQL socket factory jar with driver and dependencies\n[here](https://github.com/GoogleCloudPlatform/cloud-sql-jdbc-socket-factory/releases)), then configure plugin with:\n\n\n```\nName: "connection1"\nDriver Name: "cloudsql-postgresql"\nDatabase: "prod"\nConnection Name: [PROJECT_ID]:[REGION]:[INSTANCE_NAME]\nCloudSQL Instance Type: "Public"\nUsername: "postgres"\nPassword: "postgres"\n```\n\n**Connecting to a private CloudSQL PostgreSQL instance**\n\nIf you want to connect to a private CloudSQL PostgreSQL instance, create a Compute Engine VM that runs the CloudSQL Proxy\ndocker image using the following command\n\n```\n# Set the environment variables\nexport PROJECT=[project_id]\nexport REGION=[vm-region]\nexport ZONE=`gcloud compute zones list --filter="name=${REGION}" --limit\n1 --uri --project=${PROJECT}| sed \'s/.*\\///\'`\nexport SUBNET=[vpc-subnet-name]\nexport NAME=[gce-vm-name]\nexport POSTGRESQL_CONN=[postgresql-instance-connection-name]\n\n# Create a Compute Engine VM\ngcloud beta compute --project=${PROJECT_ID} instances create ${INSTANCE_NAME}\n--zone=${ZONE} --machine-type=g1-small --subnet=${SUBNE} --no-address\n--metadata=startup-script="docker run -d -p 0.0.0.0:3306:3306\ngcr.io/cloudsql-docker/gce-proxy:1.16 /cloud_sql_proxy\n-instances=${POSTGRESQL_CONNECTION_NAME}=tcp:0.0.0.0:3306" --maintenance-policy=MIGRATE\n--scopes=https://www.googleapis.com/auth/cloud-platform\n--image=cos-69-10895-385-0 --image-project=cos-cloud  \n```\n\nOptionally, you can promote the internal IP address of the VM running the Proxy image to a static IP using\n\n```\n# Get the VM internal IP\nexport IP=`gcloud compute instances describe ${NAME} --zone ${ZONE} |\ngrep "networkIP" | awk \'{print $2}\'`\n\n# Promote the VM internal IP to static IP\ngcloud compute addresses create postgresql-proxy --addresses ${IP} --region\n${REGION} --subnet ${SUBNET}\n\n# Note down the IP to be used in MySQL or PostgreSQL JDBC \n# connection string\necho Proxy IP: ${IP}\n\necho "JDBC Connection strings:"\necho "jdbc:postgresql://${IP}:5432/{PostgreSQL_DB_NAME}"\necho "jdbc:mysql://${IP}:3306/{MySQL_DB_NAME}"\n```\n\nGet the latest version of the CloudSQL socket factory jar with driver and dependencies from\n[here](https://github.com/GoogleCloudPlatform/cloud-sql-jdbc-socket-factory/releases), then configure plugin with:\n\n```\nName: "connection1"\nDriver Name: "cloudsql-postgresql"\nDatabase: "prod"\nConnection Name: <proxy-ip> (obtained from commands above)\nCloudSQL Instance Type: "Private"\nUsername: "postgres"\nPassword: "postgres"\n```',
      'widgets.CloudSQLPostgreSQL-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [\n        {\n          "widget-type": "plugin-list",\n          "name": "jdbcPluginName",\n          "label": "JDBC Driver name",\n          "widget-attributes": {"plugin-type": "jdbc"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "database",\n          "label": "Database"\n        },\n        {\n          "widget-type": "radio-group",\n          "name": "instanceType",\n          "label": "CloudSQL Instance Type",\n          "widget-attributes": {\n            "layout": "inline",\n            "default": "public",\n            "options": [\n              {\n                "id": "public",\n                "label": "Public"\n              },\n              {\n                "id": "private",\n                "label": "Private"\n              }\n            ]\n          }\n        },\n        {\n          "widget-type": "textbox",\n          "name": "connectionName",\n          "label": "Connection Name",\n          "widget-attributes": {"placeholder": "CloudSQL instance connection name"}\n        }\n      ]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "widget-type": "textbox",\n          "name": "user",\n          "label": "Username",\n          "widget-attributes": {"placeholder": "The username to use to connect to the CloudSQL database"}\n        },\n        {\n          "widget-type": "password",\n          "name": "password",\n          "label": "Password",\n          "widget-attributes": {"placeholder": "The password to use to connect to the CloudSQL database"}\n        }\n      ]\n    },\n    {\n      "label": "Advanced",\n      "properties": [{\n        "widget-type": "keyvalue",\n        "name": "connectionArguments",\n        "label": "Connection Arguments",\n        "widget-attributes": {\n          "kv-delimiter": "=",\n          "key-placeholder": "Key",\n          "value-placeholder": "Value",\n          "delimiter": ";",\n          "showDelimiter": "false"\n        }\n      }]\n    }\n  ],\n  "display-name": "CloudSQL PostgreSQL"\n}',
    },
    name: 'cloudsql-postgresql-plugin',
    version: '1.9.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'doc.File-connector':
        "# File Connection\n\n\nDescription\n-----------\nUse this connection to browse and sample the local file system.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection. \n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It's an absolute local filesystem path of a file or folder.",
      'widgets.File-connector':
        '{\n  "metadata": {"spec-version": "1.5"},\n  "configuration-groups": [{\n    "label": "Sampling Properties",\n    "properties": [\n      {\n        "widget-type": "plugin-list",\n        "name": "format",\n        "label": "Format",\n        "widget-attributes": {"plugin-type": "validatingInputFormat"}\n      },\n      {\n        "widget-type": "textbox",\n        "name": "delimiter",\n        "label": "Delimiter",\n        "widget-attributes": {"placeholder": "Delimiter if the format is \'delimited\'"}\n      },\n      {\n        "widget-type": "toggle",\n        "name": "skipHeader",\n        "label": "Skip Header",\n        "widget-attributes": {\n          "default": "false",\n          "off": {\n            "label": "False",\n            "value": "false"\n          },\n          "on": {\n            "label": "True",\n            "value": "true"\n          }\n        }\n      },\n      {\n        "widget-type": "select",\n        "name": "fileEncoding",\n        "label": "File encoding",\n        "widget-attributes": {\n          "default": "UTF-8",\n          "values": [\n            {\n              "label": "UTF-8",\n              "value": "UTF-8"\n            },\n            {\n              "label": "UTF-32",\n              "value": "UTF-32"\n            },\n            {\n              "label": "ISO-8859-1 (Latin-1 Western European)",\n              "value": "ISO-8859-1"\n            },\n            {\n              "label": "ISO-8859-2 (Latin-2 Central European)",\n              "value": "ISO-8859-2"\n            },\n            {\n              "label": "ISO-8859-3 (Latin-3 South European)",\n              "value": "ISO-8859-3"\n            },\n            {\n              "label": "ISO-8859-4 (Latin-4 North European)",\n              "value": "ISO-8859-4"\n            },\n            {\n              "label": "ISO-8859-5 (Latin/Cyrillic)",\n              "value": "ISO-8859-5"\n            },\n            {\n              "label": "ISO-8859-6 (Latin/Arabic)",\n              "value": "ISO-8859-6"\n            },\n            {\n              "label": "ISO-8859-7 (Latin/Greek)",\n              "value": "ISO-8859-7"\n            },\n            {\n              "label": "ISO-8859-8 (Latin/Hebrew)",\n              "value": "ISO-8859-8"\n            },\n            {\n              "label": "ISO-8859-9 (Latin-5 Turkish)",\n              "value": "ISO-8859-9"\n            },\n            {\n              "label": "ISO-8859-11 (Latin/Thai)",\n              "value": "ISO-8859-11"\n            },\n            {\n              "label": "ISO-8859-13 (Latin-7 Baltic Rim)",\n              "value": "ISO-8859-13"\n            },\n            {\n              "label": "ISO-8859-15 (Latin-9)",\n              "value": "ISO-8859-15"\n            },\n            {\n              "label": "Windows-1250",\n              "value": "Windows-1250"\n            },\n            {\n              "label": "Windows-1251",\n              "value": "Windows-1251"\n            },\n            {\n              "label": "Windows-1252",\n              "value": "Windows-1252"\n            },\n            {\n              "label": "Windows-1253",\n              "value": "Windows-1253"\n            },\n            {\n              "label": "Windows-1254",\n              "value": "Windows-1254"\n            },\n            {\n              "label": "Windows-1255",\n              "value": "Windows-1255"\n            },\n            {\n              "label": "Windows-1256",\n              "value": "Windows-1256"\n            },\n            {\n              "label": "Windows-1257",\n              "value": "Windows-1257"\n            },\n            {\n              "label": "Windows-1258",\n              "value": "Windows-1258"\n            },\n            {\n              "label": "IBM00858",\n              "value": "IBM00858"\n            },\n            {\n              "label": "IBM01140",\n              "value": "IBM01140"\n            },\n            {\n              "label": "IBM01141",\n              "value": "IBM01141"\n            },\n            {\n              "label": "IBM01142",\n              "value": "IBM01142"\n            },\n            {\n              "label": "IBM01143",\n              "value": "IBM01143"\n            },\n            {\n              "label": "IBM01144",\n              "value": "IBM01144"\n            },\n            {\n              "label": "IBM01145",\n              "value": "IBM01145"\n            },\n            {\n              "label": "IBM01146",\n              "value": "IBM01146"\n            },\n            {\n              "label": "IBM01147",\n              "value": "IBM01147"\n            },\n            {\n              "label": "IBM01148",\n              "value": "IBM01148"\n            },\n            {\n              "label": "IBM01149",\n              "value": "IBM01149"\n            },\n            {\n              "label": "IBM037",\n              "value": "IBM037"\n            },\n            {\n              "label": "IBM1026",\n              "value": "IBM1026"\n            },\n            {\n              "label": "IBM1047",\n              "value": "IBM1047"\n            },\n            {\n              "label": "IBM273",\n              "value": "IBM273"\n            },\n            {\n              "label": "IBM277",\n              "value": "IBM277"\n            },\n            {\n              "label": "IBM278",\n              "value": "IBM278"\n            },\n            {\n              "label": "IBM280",\n              "value": "IBM280"\n            },\n            {\n              "label": "IBM284",\n              "value": "IBM284"\n            },\n            {\n              "label": "IBM285",\n              "value": "IBM285"\n            },\n            {\n              "label": "IBM290",\n              "value": "IBM290"\n            },\n            {\n              "label": "IBM297",\n              "value": "IBM297"\n            },\n            {\n              "label": "IBM420",\n              "value": "IBM420"\n            },\n            {\n              "label": "IBM424",\n              "value": "IBM424"\n            },\n            {\n              "label": "IBM437",\n              "value": "IBM437"\n            },\n            {\n              "label": "IBM500",\n              "value": "IBM500"\n            },\n            {\n              "label": "IBM775",\n              "value": "IBM775"\n            },\n            {\n              "label": "IBM850",\n              "value": "IBM850"\n            },\n            {\n              "label": "IBM852",\n              "value": "IBM852"\n            },\n            {\n              "label": "IBM855",\n              "value": "IBM855"\n            },\n            {\n              "label": "IBM857",\n              "value": "IBM857"\n            },\n            {\n              "label": "IBM860",\n              "value": "IBM860"\n            },\n            {\n              "label": "IBM861",\n              "value": "IBM861"\n            },\n            {\n              "label": "IBM862",\n              "value": "IBM862"\n            },\n            {\n              "label": "IBM863",\n              "value": "IBM863"\n            },\n            {\n              "label": "IBM864",\n              "value": "IBM864"\n            },\n            {\n              "label": "IBM865",\n              "value": "IBM865"\n            },\n            {\n              "label": "IBM866",\n              "value": "IBM866"\n            },\n            {\n              "label": "IBM868",\n              "value": "IBM868"\n            },\n            {\n              "label": "IBM869",\n              "value": "IBM869"\n            },\n            {\n              "label": "IBM870",\n              "value": "IBM870"\n            },\n            {\n              "label": "IBM871",\n              "value": "IBM871"\n            },\n            {\n              "label": "IBM918",\n              "value": "IBM918"\n            }\n          ]\n        }\n      }\n    ]\n  }]\n}',
    },
    name: 'core-plugins',
    version: '2.10.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'widgets.Database-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [\n        {\n          "widget-type": "plugin-list",\n          "name": "jdbcPluginName",\n          "label": "JDBC Driver name",\n          "widget-attributes": {"plugin-type": "jdbc"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "connectionString",\n          "label": "Connection String"\n        }\n      ]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "widget-type": "textbox",\n          "name": "user",\n          "label": "Username"\n        },\n        {\n          "widget-type": "password",\n          "name": "password",\n          "label": "Password"\n        }\n      ]\n    },\n    {\n      "label": "Advanced",\n      "properties": [{\n        "widget-type": "keyvalue",\n        "name": "connectionArguments",\n        "label": "Connection Arguments",\n        "widget-attributes": {\n          "kv-delimiter": "=",\n          "key-placeholder": "Key",\n          "value-placeholder": "Value",\n          "delimiter": ";",\n          "showDelimiter": "false"\n        }\n      }]\n    }\n  ],\n  "display-name": "Database"\n}',
      'doc.Database-connector':
        "# Database Connection\n\n\nDescription\n-----------\nUse this connection to access data in a relational database using JDBC. \nThis is a generic database connection that might not handle some special cases \nfor certain special databases that have a specific implementation of JDBC. \nTry to use those specific database connections \n(for example, MySQL, Oracle, Postgres, and SQL Server connections) if they exist.\n\n\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**JDBC Driver name:** Select the JDBC driver to use.\n\n**Connection String:** JDBC connection string including database name.\n\n**Username:** User identity for connecting to the specified database. Required for databases that need\nauthentication. Optional for databases that do not require authentication.\n\n**Password:** Password to use to connect to the specified database. Required for databases\nthat need authentication. Optional for databases that do not require authentication.\n\n**Connection Arguments:** A list of arbitrary string tag/value pairs as connection arguments. These arguments\nwill be passed to the JDBC driver, as connection arguments, for JDBC drivers that may need additional configurations.\nThis is a semicolon-separated list of key-value pairs, where each pair is separated by a equals '=' and specifies\nthe key and value for the argument. For example, 'key1=value1;key2=value' specifies that the connection will be\ngiven arguments 'key1' mapped to 'value1' and the argument 'key2' mapped to 'value2'.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{schema}/{table}`\n   This path indicates a table. A table is the only one that can be sampled. Browse on this path to return the specified table.\n   If a database doesn't support `schema` (e.g. MySQL), you can omit the `/{schema}` part.\n\n2. `/{schema}`\n   This path indicates a schema. A schema cannot be sampled. Browse on this path to get all the tables under this schema.\n   Such path is only valid for those databases that support `schema`.\n   \n3. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the schemas visible through this connection.\n   If a database doesn't support `schema` (e.g. MySQL), browse on this path will get all the tables visible through this connection.",
    },
    name: 'database-plugins',
    version: '2.10.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'widgets.BigQuery-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [\n        {\n          "widget-type": "textbox",\n          "name": "project",\n          "label": "Project ID",\n          "widget-attributes": {"default": "auto-detect"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "datasetProject",\n          "label": "Dataset Project ID",\n          "widget-attributes": {"placeholder": "Project the dataset belongs to, if different from the Project ID."}\n        },\n        {\n          "widget-type": "hidden",\n          "name": "rootDataset"\n        },\n        {\n          "widget-type": "toggle",\n          "name": "showHiddenDatasets",\n          "label": "Show Hidden Datasets",\n          "widget-attributes": {\n            "default": "false",\n            "off": {\n              "label": "NO",\n              "value": "false"\n            },\n            "on": {\n              "label": "YES",\n              "value": "true"\n            }\n          }\n        }\n      ]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "name": "serviceAccountType",\n          "widget-type": "radio-group",\n          "label": "Service Account Type",\n          "widget-attributes": {\n            "layout": "inline",\n            "default": "filePath",\n            "options": [\n              {\n                "id": "filePath",\n                "label": "File Path"\n              },\n              {\n                "id": "JSON",\n                "label": "JSON"\n              }\n            ]\n          }\n        },\n        {\n          "widget-type": "textbox",\n          "name": "serviceFilePath",\n          "label": "Service Account File Path",\n          "widget-attributes": {"default": "auto-detect"}\n        },\n        {\n          "widget-type": "textarea",\n          "name": "serviceAccountJSON",\n          "label": "Service Account JSON"\n        }\n      ]\n    }\n  ],\n  "display-name": "BigQuery",\n  "filters": [\n    {\n      "condition": {"expression": "serviceAccountType == \'filePath\'"},\n      "name": "ServiceAuthenticationTypeFilePath",\n      "show": [{\n        "name": "serviceFilePath",\n        "type": "property"\n      }]\n    },\n    {\n      "condition": {"expression": "serviceAccountType == \'JSON\'"},\n      "name": "ServiceAuthenticationTypeJSON",\n      "show": [{\n        "name": "serviceAccountJSON",\n        "type": "property"\n      }]\n    }\n  ]\n}',
      'doc.BigQuery-connector':
        '# Google BigQuery Connection\n\nDescription\n-----------\nUse this connection to access data in Google BigQuery.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**Project ID**: Google Cloud Project ID, which uniquely identifies a project. This is where the BigQuery job will be run\nto query the data. It can be found on the Dashboard in the Google Cloud Platform Console. Make sure the service account\nspecified below has the permission to run BigQuery jobs in this project by granting the service account\nthe `BigQuery Job User` role.\n\n**Dataset Project ID**: Google Cloud Project ID of the project where your dataset is. It can be found on the Dashboard\nin the Google Cloud Platform Console. Make sure the service account specified below has the permission to view data in\nthis project by granting the service account the `BigQuery Data Viewer` role.\n\n**Service Account**: When running on Google Cloud Platform, the service account key does not need to be provided, as\nit can automatically be read from the environment. In other environments, the service account key must be provided.\n\n* **File Path**: Path on the local file system of the service account key used for authorization. Can be set to \'\n  auto-detect\' when running on a Dataproc cluster. When running on other clusters, the file must be present on every\n  node in the cluster.\n\n* **JSON**: Contents of the service account JSON file.\n\n**Show Hidden Datasets:** Whether to show hidden datasets.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through \n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{dataset}/{table}`\n   This path indicates a table. A table is the only one that can be sampled. Browse on this path to return the specified table.\n\n2. `/{dataset}`\n   This path indicates a dataset. A dataset cannot be sampled. Browse on this path to get all the tables under this dataset.\n\n3. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the datasets visible through this connection.\n\nTrouble Shooting\n----------------\n\n**missing permission to run BigQuery jobs**\n\nIf your pipeline failed with the following error in the log:\n```\nPOST https://bigquery.googleapis.com/bigquery/v2/projects/xxxx/jobs\n{\n"code" : 403,\n"errors" : [ {\n"domain" : "global",\n"message" : "Access Denied: Project xxxx: User does not have bigquery.jobs.create permission in project xxxx",\n"reason" : "accessDenied"\n} ],\n"message" : "Access Denied: Project xxxx: User does not have bigquery.jobs.create permission in project xxxx.",\n"status" : "PERMISSION_DENIED"\n}\n``` \n`xxxx` is the `Project ID` you specified in this plugin. This means the specified service account doesn\'t have the\npermission to run BigQuery jobs. You must grant "BigQuery Job User" role on the project identified by the `Project ID`\nyou specified in this plugin to the service account. If you think you already granted the role, check if you granted the\nrole on the wrong project (for example the one identified by the `Dataset Project ID`).\n\n**missing permission to read the BigQuery dataset**\nIf your pipeline failed with the following error in the log:\n```\ncom.google.api.client.googleapis.json.GoogleJsonResponseException: 403 Forbidden\nGET https://www.googleapis.com/bigquery/v2/projects/xxxx/datasets/mysql_bq_perm?prettyPrint=false\n{\n"code" : 403,\n"errors" : [ {\n"domain" : "global",\n"message" : "Access Denied: Dataset xxxx:mysql_bq_perm: Permission bigquery.datasets.get denied on dataset xxxx:mysql_bq_perm (or it may not exist).",\n"reason" : "accessDenied"\n} ],\n"message" : "Access Denied: Dataset xxxx:mysql_bq_perm: Permission bigquery.datasets.get denied on dataset xxxx:mysql_bq_perm (or it may not exist).",\n"status" : "PERMISSION_DENIED"\n}\n```\n`xxxx` is the `Dataset Project ID` you specified in this plugin. The service account you specified in this plugin doesn\'t\nhave the permission to read the dataset you specified in this plugin. You must grant "BigQuery Data Viewer" role on the\nproject identified by the `Dataset Project ID` you specified in this plugin to the service account. If you think you\nalready granted the role, check if you granted the role on the wrong project (for example the one identified by the `Project ID`).\n\n',
    },
    name: 'google-cloud',
    version: '0.21.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'widgets.GCS-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [\n        {\n          "widget-type": "textbox",\n          "name": "project",\n          "label": "Project ID",\n          "widget-attributes": {"default": "auto-detect"}\n        },\n        {\n          "widget-type": "hidden",\n          "name": "rootBucket"\n        }\n      ]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "name": "serviceAccountType",\n          "widget-type": "radio-group",\n          "label": "Service Account Type",\n          "widget-attributes": {\n            "layout": "inline",\n            "default": "filePath",\n            "options": [\n              {\n                "id": "filePath",\n                "label": "File Path"\n              },\n              {\n                "id": "JSON",\n                "label": "JSON"\n              }\n            ]\n          }\n        },\n        {\n          "widget-type": "textbox",\n          "name": "serviceFilePath",\n          "label": "Service Account File Path",\n          "widget-attributes": {"default": "auto-detect"}\n        },\n        {\n          "widget-type": "textarea",\n          "name": "serviceAccountJSON",\n          "label": "Service Account JSON"\n        }\n      ]\n    },\n    {\n      "label": "Sampling Properties",\n      "properties": [\n        {\n          "widget-type": "plugin-list",\n          "name": "format",\n          "label": "Format",\n          "widget-attributes": {"plugin-type": "validatingInputFormat"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "delimiter",\n          "label": "Delimiter",\n          "widget-attributes": {"placeholder": "Delimiter if the format is \'delimited\'"}\n        },\n        {\n          "widget-type": "toggle",\n          "name": "skipHeader",\n          "label": "Skip Header",\n          "widget-attributes": {\n            "default": "false",\n            "off": {\n              "label": "False",\n              "value": "false"\n            },\n            "on": {\n              "label": "True",\n              "value": "true"\n            }\n          }\n        },\n        {\n          "widget-type": "select",\n          "name": "fileEncoding",\n          "label": "File encoding",\n          "widget-attributes": {\n            "default": "UTF-8",\n            "values": [\n              {\n                "label": "UTF-8",\n                "value": "UTF-8"\n              },\n              {\n                "label": "UTF-32",\n                "value": "UTF-32"\n              },\n              {\n                "label": "ISO-8859-1 (Latin-1 Western European)",\n                "value": "ISO-8859-1"\n              },\n              {\n                "label": "ISO-8859-2 (Latin-2 Central European)",\n                "value": "ISO-8859-2"\n              },\n              {\n                "label": "ISO-8859-3 (Latin-3 South European)",\n                "value": "ISO-8859-3"\n              },\n              {\n                "label": "ISO-8859-4 (Latin-4 North European)",\n                "value": "ISO-8859-4"\n              },\n              {\n                "label": "ISO-8859-5 (Latin/Cyrillic)",\n                "value": "ISO-8859-5"\n              },\n              {\n                "label": "ISO-8859-6 (Latin/Arabic)",\n                "value": "ISO-8859-6"\n              },\n              {\n                "label": "ISO-8859-7 (Latin/Greek)",\n                "value": "ISO-8859-7"\n              },\n              {\n                "label": "ISO-8859-8 (Latin/Hebrew)",\n                "value": "ISO-8859-8"\n              },\n              {\n                "label": "ISO-8859-9 (Latin-5 Turkish)",\n                "value": "ISO-8859-9"\n              },\n              {\n                "label": "ISO-8859-11 (Latin/Thai)",\n                "value": "ISO-8859-11"\n              },\n              {\n                "label": "ISO-8859-13 (Latin-7 Baltic Rim)",\n                "value": "ISO-8859-13"\n              },\n              {\n                "label": "ISO-8859-15 (Latin-9)",\n                "value": "ISO-8859-15"\n              },\n              {\n                "label": "Windows-1250",\n                "value": "Windows-1250"\n              },\n              {\n                "label": "Windows-1251",\n                "value": "Windows-1251"\n              },\n              {\n                "label": "Windows-1252",\n                "value": "Windows-1252"\n              },\n              {\n                "label": "Windows-1253",\n                "value": "Windows-1253"\n              },\n              {\n                "label": "Windows-1254",\n                "value": "Windows-1254"\n              },\n              {\n                "label": "Windows-1255",\n                "value": "Windows-1255"\n              },\n              {\n                "label": "Windows-1256",\n                "value": "Windows-1256"\n              },\n              {\n                "label": "Windows-1257",\n                "value": "Windows-1257"\n              },\n              {\n                "label": "Windows-1258",\n                "value": "Windows-1258"\n              },\n              {\n                "label": "IBM00858",\n                "value": "IBM00858"\n              },\n              {\n                "label": "IBM01140",\n                "value": "IBM01140"\n              },\n              {\n                "label": "IBM01141",\n                "value": "IBM01141"\n              },\n              {\n                "label": "IBM01142",\n                "value": "IBM01142"\n              },\n              {\n                "label": "IBM01143",\n                "value": "IBM01143"\n              },\n              {\n                "label": "IBM01144",\n                "value": "IBM01144"\n              },\n              {\n                "label": "IBM01145",\n                "value": "IBM01145"\n              },\n              {\n                "label": "IBM01146",\n                "value": "IBM01146"\n              },\n              {\n                "label": "IBM01147",\n                "value": "IBM01147"\n              },\n              {\n                "label": "IBM01148",\n                "value": "IBM01148"\n              },\n              {\n                "label": "IBM01149",\n                "value": "IBM01149"\n              },\n              {\n                "label": "IBM037",\n                "value": "IBM037"\n              },\n              {\n                "label": "IBM1026",\n                "value": "IBM1026"\n              },\n              {\n                "label": "IBM1047",\n                "value": "IBM1047"\n              },\n              {\n                "label": "IBM273",\n                "value": "IBM273"\n              },\n              {\n                "label": "IBM277",\n                "value": "IBM277"\n              },\n              {\n                "label": "IBM278",\n                "value": "IBM278"\n              },\n              {\n                "label": "IBM280",\n                "value": "IBM280"\n              },\n              {\n                "label": "IBM284",\n                "value": "IBM284"\n              },\n              {\n                "label": "IBM285",\n                "value": "IBM285"\n              },\n              {\n                "label": "IBM290",\n                "value": "IBM290"\n              },\n              {\n                "label": "IBM297",\n                "value": "IBM297"\n              },\n              {\n                "label": "IBM420",\n                "value": "IBM420"\n              },\n              {\n                "label": "IBM424",\n                "value": "IBM424"\n              },\n              {\n                "label": "IBM437",\n                "value": "IBM437"\n              },\n              {\n                "label": "IBM500",\n                "value": "IBM500"\n              },\n              {\n                "label": "IBM775",\n                "value": "IBM775"\n              },\n              {\n                "label": "IBM850",\n                "value": "IBM850"\n              },\n              {\n                "label": "IBM852",\n                "value": "IBM852"\n              },\n              {\n                "label": "IBM855",\n                "value": "IBM855"\n              },\n              {\n                "label": "IBM857",\n                "value": "IBM857"\n              },\n              {\n                "label": "IBM860",\n                "value": "IBM860"\n              },\n              {\n                "label": "IBM861",\n                "value": "IBM861"\n              },\n              {\n                "label": "IBM862",\n                "value": "IBM862"\n              },\n              {\n                "label": "IBM863",\n                "value": "IBM863"\n              },\n              {\n                "label": "IBM864",\n                "value": "IBM864"\n              },\n              {\n                "label": "IBM865",\n                "value": "IBM865"\n              },\n              {\n                "label": "IBM866",\n                "value": "IBM866"\n              },\n              {\n                "label": "IBM868",\n                "value": "IBM868"\n              },\n              {\n                "label": "IBM869",\n                "value": "IBM869"\n              },\n              {\n                "label": "IBM870",\n                "value": "IBM870"\n              },\n              {\n                "label": "IBM871",\n                "value": "IBM871"\n              },\n              {\n                "label": "IBM918",\n                "value": "IBM918"\n              }\n            ]\n          }\n        }\n      ]\n    }\n  ],\n  "display-name": "GCS",\n  "icon": {\n    "arguments": {"data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAL\\r\\nEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6\\r\\neD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYg\\r\\neG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4K\\r\\nICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlm\\r\\nZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRh\\r\\ndGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9y\\r\\nZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAADF9JREFUaAXFWguMXFUZ/s+95965s7Pb6cKGUoot\\r\\nWKxVItHwSFATl0AQlIeKu4hY5Q0RAhVBhGCdSngohW1YbXgJaXwgXSQxBowS0kVjJAoYDNVYoFos\\r\\nAoV2HzO7M3Mf5/j95967M7M7ryWhnuQ+zuN/fOd/nHPujKBFFy0GC2QXl5NYNGkXBH1vkB4vUEQk\\r\\ndBfD392QQkFbRPo9AdCokRZDQ9vsxrb2ta6VYhCFglDM7tIfVtZMqMwRWrFVQrTI9lI69sY8hEV6\\r\\niaTdD31d/JNJGMzY2DCs07l0BWRoSIOhiNY/rJfu2hfdVQnFsBaiF+ZvK4F7F+cfGg6lS55Nv1zd\\r\\nb107conYn8puKwidcJX2hS3BILTW1svvRI8Enn1RJKxeBQ2V1m0vELXtX0hPxLyDrPW1l/dH27Zv\\r\\n15Jlxy7dXs+OPjEeg1XnbFZXRq59ml+MQp5pXB0nob3o5r2MvTpN5Obsk0f/qq7BqLvGEx2aU8St\\r\\nbX1jsKDleEGE6+/Ty/8xET4X2fIwHUZwaN1xAtoJ7dwnQmHb0lbRW6v6gxPuvzz7WqpLK9o2s6rF\\r\\n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\\r\\nTMT/AMOVvu39V/HOAAAAAElFTkSuQmCC"},\n    "type": "inline"\n  },\n  "filters": [\n    {\n      "condition": {"expression": "serviceAccountType == \'filePath\'"},\n      "name": "ServiceAuthenticationTypeFilePath",\n      "show": [{\n        "name": "serviceFilePath",\n        "type": "property"\n      }]\n    },\n    {\n      "condition": {"expression": "serviceAccountType == \'JSON\'"},\n      "name": "ServiceAuthenticationTypeJSON",\n      "show": [{\n        "name": "serviceAccountJSON",\n        "type": "property"\n      }]\n    }\n  ]\n}',
      'doc.GCS-connector':
        "# Google Cloud Storage Connection\n\nDescription\n-----------\nUse this connection to access data in Google Cloud Storage.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**Project ID**: Google Cloud Project ID, which uniquely identifies a project.\nIt can be found on the Dashboard in the Google Cloud Platform Console.\n\n**Service Account**: When running on Google Cloud Platform, the service account key does not need to be provided, \nas it can automatically be read from the environment. In other environments, the service account key must be provided.\n\n* **File Path**: Path on the local file system of the service account key used for\nauthorization. Can be set to 'auto-detect' when running on a Dataproc cluster.\nWhen running on other clusters, the file must be present on every node in the cluster.\n\n* **JSON**: Contents of the service account JSON file.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It's an absolute Google Cloud Storage path of a file or folder.",
    },
    name: 'google-cloud',
    version: '0.21.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'doc.Spanner-connector':
        "# Google Cloud Spanner Connection\n\nDescription\n-----------\nUse this connection to access data in Google Cloud Spanner.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**Project ID**: Google Cloud Project ID, which uniquely identifies a project.\nIt can be found on the Dashboard in the Google Cloud Platform Console.\n\n**Service Account**: When running on Google Cloud Platform, the service account key does not need to be provided, \nas it can automatically be read from the environment. In other environments, the service account key must be provided.\n\n* **File Path**: Path on the local file system of the service account key used for\nauthorization. Can be set to 'auto-detect' when running on a Dataproc cluster.\nWhen running on other clusters, the file must be present on every node in the cluster.\n\n* **JSON**: Contents of the service account JSON file.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{instance}/{database}/{table}`\n   This path indicates a table. A table is the only one that can be sampled. Browse on this path to return the specified table.\n\n2. `/{instance}/{database}`\n   This path indicates a database. A database cannot be sampled. Browse on this path to get all the tables under this database.\n\n3. `/{instance}`\n   This path indicates a instance. A instance cannot be sampled. Browse on this path to get all the databases under this instance.\n\n4. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the instances visible through this connection.\n",
      'widgets.Spanner-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [{\n        "widget-type": "textbox",\n        "name": "project",\n        "label": "Project ID",\n        "widget-attributes": {"default": "auto-detect"}\n      }]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "name": "serviceAccountType",\n          "widget-type": "radio-group",\n          "label": "Service Account Type",\n          "widget-attributes": {\n            "layout": "inline",\n            "default": "filePath",\n            "options": [\n              {\n                "id": "filePath",\n                "label": "File Path"\n              },\n              {\n                "id": "JSON",\n                "label": "JSON"\n              }\n            ]\n          }\n        },\n        {\n          "widget-type": "textbox",\n          "name": "serviceFilePath",\n          "label": "Service Account File Path",\n          "widget-attributes": {"default": "auto-detect"}\n        },\n        {\n          "widget-type": "textarea",\n          "name": "serviceAccountJSON",\n          "label": "Service Account JSON"\n        }\n      ]\n    }\n  ],\n  "display-name": "Spanner",\n  "filters": [\n    {\n      "condition": {"expression": "serviceAccountType == \'filePath\'"},\n      "name": "ServiceAuthenticationTypeFilePath",\n      "show": [{\n        "name": "serviceFilePath",\n        "type": "property"\n      }]\n    },\n    {\n      "condition": {"expression": "serviceAccountType == \'JSON\'"},\n      "name": "ServiceAuthenticationTypeJSON",\n      "show": [{\n        "name": "serviceAccountJSON",\n        "type": "property"\n      }]\n    }\n  ]\n}',
    },
    name: 'google-cloud',
    version: '0.21.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'widgets.Kafka-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.5"},\n  "configuration-groups": [{\n    "label": "Credentials",\n    "properties": [{\n      "widget-type": "csv",\n      "name": "kafkaBrokers",\n      "label": "Kafka Brokers",\n      "widget-attributes": {"delimiter": ","}\n    }]\n  }],\n  "display-name": "Kafka Connector",\n  "icon": {\n    "arguments": {"data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6\\r\\nJgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB\\r\\nWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczpt\\r\\nZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0\\r\\ndHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRl\\r\\nc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMu\\r\\nYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6\\r\\nT3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4\\r\\nbXBtZXRhPgpMwidZAAAGJklEQVRoBe2YWajVVRTGtXkuMRskvEWiQTSY1EMJWdJTERkU2IP0UA8J\\r\\nRr0E+aA3wuohoqKwILgIURQpRAOUDUq9CFEZjcQ17SE1s7TBysr6/e5/f5ft7Vw9dzh6Iz/4/nvt\\r\\ntae19trTOePGHcTYmoHxo2TOofRT97WbvPzPQOMPG8TawfSDVB+Z2pkcLg6h4d/Qmdfoc+BZRd5B\\r\\nqt7+rTNmoRPBPIS1cDvcCTfDFfB8KOq6jWaMfOu9sASbnPFW/BH9bChGEvmmhw58Y9Q19F07sI78\\r\\ni3BTpe9FnghF2jW5A/yto/EqtsSRZciHF9vOJn2/KltQ9GPKkRhzMsatL8ZuJJ1QjD2ipNeXMh3t\\r\\nKTonoZ4I1e4fOVBv2ZAw3I2owTle3eS/lFHjyLfkdUIc2ST9ebO2dVI82aRQN2yHhupIjNNQKc6D\\r\\n1/VJ48b9XNKbSWPUV0WXsXTgT/hX0ZvYrzqRek2uzW9mtc3q/XeDg66EM6EGPwE9bj+F18IboXC2\\r\\nrSc0UONlF5wPZ0CjuAG+AFdDnbJuIoXYGWTGjqb7d6ADD8ZuyoTOZn/NRd4KW7V5CH2QcZLvSBqj\\r\\nJtG7l1+MMlLKP8FFMMjemYXiD1jX9xJN3vQeKPaLIw4UZ5SvgF9ADXkWToFBXe91lDF6NfIceCF8\\r\\nFMZBJ2E6FENd+k2rYXwz0zZ9BWrkLWbAUdBZjTHTkLdB66yHp8EaT5OJk7eVgrSt67WURxI+Z3pX\\r\\n1WucOqbofitpxjid/LFF9x6pbzL3We6gVaXM5NQit73h2/a4GkRRJ3J8uqw8pTyBxK3wePg8/BI6\\r\\ny6IXet94r7h0jNivhST97ZV3+AFOQtvO9LUYwidrXmOXwywH09+rvI/GhVCMh3dBHUn9HuQueBJ0\\r\\nKbk3LHOvXAJFnj1NbhS/WSbO6hvQgY2Mac1a9yRlbw8oT90t6N0vyZv2wMAJ6AgSjQfo3UHdB6Ya\\r\\ncx80AhriklGf41jZmV4KF0PzrfgSeiMtMlaTG8Vv9lMXfW6DMWQNso/IGleS+QGmztfIl1YVLH8O\\r\\nfgg/hkbX5ZUIdMwJxug/Rucjx0DX9bkWApebazpG3IGcehuQT4Aip5uyp9iJChXSvlLtW8ya33fN\\r\\nxijrnVlVfh/5k5J36cj0+Raym1tMhhf0SU0/Gms9y3NCGXF1OQ0R20cGbb/FnjVdClkOe5b8O2d0\\r\\nOoahOBKDN1TWXIScpeWykrtL+RzSXIDfIH9U9PbjrFvvOJgL0YNB3bCWFu3aRr3Zv6NV1v8a5IGb\\r\\nXSf2ttktd7Pr3GfwTehmz8R23JkM0Or4vR9Dboc9cLDj1yO6G2YSBqYvU9bx45cx+mfME2oV1JD6\\r\\n8othtW5fF2Jv6Sdte8gHWc7Jj2qaqDhzy2EMMK2fKJ5GC6HQoDxR3AfW1eApsNUT5WL0wj3XUcQZ\\r\\nB7kCPg63Qg1cB++GU6GIMWcg5yK1jlGt8TAZ28s7S0H2Zcl2JqmdcYQsNfdJ4ObNBXg5cp40voyF\\r\\nL+AJfVLzGz6OdBddNn/JDp60XbFFF+6DGGlxfpvsLHU1UlhPbIK5IF06/rDSMU83cVWT9H23FHkk\\r\\n9lXd7V2sI+Ly+hw6o8/CLhjUy+M1lJn11chz4Az4CPRVYJnP/+lQ1G0bzSh/48Qk+l0JY1xeu77B\\r\\nFlVjJnKXoYvBtrG+EUx7024oOh6NDOBP2ndhbcRAuZty4akV5+ci52AYWP9BKxdknORHPY1BzngM\\r\\n+R75XngTdGnliHV/zITCZaJDogsuhiugv0Eeg7Nh0HEnMoBG+QeCjmjsDbDGU2Ti5NJSYNs6MnX9\\r\\nyJZnjOg6kiYak+l9I9TYdTB7wEegmAUTlWf6NM0nEXEi0pcl6uuIqRsShuv9LkbJserNHAfUi1Ng\\r\\njPa2F8kru8lt7/ixQZ0Ts19QG/MqI2b5LENOVKYif1CVLUAWdQQazQH+xqCrsSOOZIm9iM6LL/pe\\r\\n5IlQpF2TGwPfOipLsCdGD0y92GYXe8ecE8Wu/nVtfh5cC7dDL7fN0GM1v9GzB1B1DvXsDnUUDfRk\\r\\nEp4406Cb3nfSRiiMRA6FPsVY/TgROtEKg+lb1R2xbiQRqQd35uu+jFSiVdc7KP9vZuAfG4mx8F0N\\r\\nPGYAAAAASUVORK5C"},\n    "type": "inline"\n  }\n}',
      'doc.Kafka-connector':
        '# Kafka Connection\n\nDescription\n-----------\nUse this connection to access data in Kafka.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**kafkaBrokers:** List of Kafka brokers specified in host1:port1,host2:port2 form.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{topic}`\n   This path indicates a topic. A topic is the only one that can be sampled. Browse on this path to return the specified topic.\n\n2. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the topics visible through this connection.\n',
    },
    name: 'kafka-plugins-client',
    version: '3.1.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'widgets.SQL Server-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [\n        {\n          "widget-type": "plugin-list",\n          "name": "jdbcPluginName",\n          "label": "JDBC Driver name",\n          "widget-attributes": {"plugin-type": "jdbc"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "host",\n          "label": "Host",\n          "widget-attributes": {"default": "localhost"}\n        },\n        {\n          "widget-type": "number",\n          "name": "port",\n          "label": "Port",\n          "widget-attributes": {"default": "1433"}\n        }\n      ]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "name": "authenticationType",\n          "widget-type": "radio-group",\n          "label": "Authentication Type",\n          "widget-attributes": {\n            "layout": "inline",\n            "default": "SQL Login",\n            "options": [\n              {\n                "id": "SQL Login",\n                "label": "SQL Login"\n              },\n              {\n                "id": "ActiveDirectoryPassword",\n                "label": "Active Directory Password"\n              }\n            ]\n          }\n        },\n        {\n          "widget-type": "textbox",\n          "name": "user",\n          "label": "Username"\n        },\n        {\n          "widget-type": "password",\n          "name": "password",\n          "label": "Password"\n        }\n      ]\n    },\n    {\n      "label": "Advanced",\n      "properties": [{\n        "widget-type": "keyvalue",\n        "name": "connectionArguments",\n        "label": "Connection Arguments",\n        "widget-attributes": {\n          "kv-delimiter": "=",\n          "key-placeholder": "Key",\n          "value-placeholder": "Value",\n          "delimiter": ";",\n          "showDelimiter": "false"\n        }\n      }]\n    }\n  ],\n  "display-name": "SqlServer"\n}',
      'doc.SQL Server-connector':
        "# SQL Server Connection\n\n\nDescription\n-----------\nUse this connection to access data in a SQL Server database using JDBC.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**JDBC Driver name:** Select the JDBC driver to use.\n\n**Host:** Host name or IP address of the database server to connect to.\n\n**Port:** Port number of the database server to connect to. Default is 1433.\n\n**Username:** User identity for connecting to the specified database. Required for databases that need\nauthentication. Optional for databases that do not require authentication.\n\n**Password:** Password to use to connect to the specified database.\n\n**Authentication Type:** Indicates which authentication method will be used for the connection. Use 'SQL Login'. to\nconnect to a SQL Server using username and password properties. Use 'Active Directory Password' to connect to an Azure\nSQL Database/Data Warehouse using an Azure AD principal name and password.\n\n**Connection Arguments:** A list of arbitrary string tag/value pairs as connection arguments. These arguments\nwill be passed to the JDBC driver, as connection arguments, for JDBC drivers that may need additional configurations.\nThis is a semicolon-separated list of key-value pairs, where each pair is separated by a equals '=' and specifies\nthe key and value for the argument. For example, 'key1=value1;key2=value' specifies that the connection will be\ngiven arguments 'key1' mapped to 'value1' and the argument 'key2' mapped to 'value2'.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{database}/{schema}/{table}`\n   This path indicates a table. A table is the only one that can be sampled. Browse on this path to return the specified table.\n\n2. `/{database}/{schema}`\n   This path indicates a schema. A schema cannot be sampled. Browse on this path to get all the tables under this schema.\n\n3. `/{database}`\n   This path indicates a database. A database cannot be sampled. Browse on this path to get all the schemas under this database.\n\n4. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the databases visible through this connection.",
    },
    name: 'mssql-plugin',
    version: '1.9.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'doc.MySQL-connector':
        "# MySQL Connection\n\n\nDescription\n-----------\nUse this connection to access data in a MySQL database using JDBC.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**JDBC Driver name:** Select the JDBC driver to use.\n\n**Host:** Host name or IP address of the database server to connect to.\n\n**Port:** Port number of the database server to connect to. If not specified will default to 3306.\n\n**Username:** User identity for connecting to the specified database. Required for databases that need\nauthentication. Optional for databases that do not require authentication.\n\n**Password:** Password to use to connect to the specified database.\n\n**Connection Arguments:** A list of arbitrary string tag/value pairs as connection arguments. These arguments\nwill be passed to the JDBC driver, as connection arguments, for JDBC drivers that may need additional configurations.\nThis is a semicolon-separated list of key-value pairs, where each pair is separated by a equals '=' and specifies\nthe key and value for the argument. For example, 'key1=value1;key2=value' specifies that the connection will be\ngiven arguments 'key1' mapped to 'value1' and the argument 'key2' mapped to 'value2'.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{database}/{table}`\n   This path indicates a table. A table is the only one that can be sampled. Browse on this path to return the specified table.\n\n2. `/{database}`\n   This path indicates a database. A database cannot be sampled. Browse on this path to get all the tables under this database.\n\n3. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the databases visible through this connection.\n",
      'widgets.MySQL-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [\n        {\n          "widget-type": "plugin-list",\n          "name": "jdbcPluginName",\n          "label": "JDBC Driver name",\n          "widget-attributes": {"plugin-type": "jdbc"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "host",\n          "label": "Host",\n          "widget-attributes": {"default": "localhost"}\n        },\n        {\n          "widget-type": "number",\n          "name": "port",\n          "label": "Port",\n          "widget-attributes": {"default": "3306"}\n        }\n      ]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "widget-type": "textbox",\n          "name": "user",\n          "label": "Username"\n        },\n        {\n          "widget-type": "password",\n          "name": "password",\n          "label": "Password"\n        }\n      ]\n    },\n    {\n      "label": "Advanced",\n      "properties": [{\n        "widget-type": "keyvalue",\n        "name": "connectionArguments",\n        "label": "Connection Arguments",\n        "widget-attributes": {\n          "kv-delimiter": "=",\n          "key-placeholder": "Key",\n          "value-placeholder": "Value",\n          "delimiter": ";",\n          "showDelimiter": "false"\n        }\n      }]\n    }\n  ],\n  "display-name": "Mysql"\n}',
    },
    name: 'mysql-plugin',
    version: '1.9.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'doc.Oracle-connector':
        "# Oracle Connection\n\n\nDescription\n-----------\nUse this connection to access data in an Oracle database using JDBC.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**JDBC Driver name:** Select the JDBC driver to use.\n\n**Host:** Host name or IP address of the database server to connect to.\n\n**Port:** Port number of the database server to connect to. If not specified will default to 1521.\n\n**Username:** User identity for connecting to the specified database. Required for databases that need\nauthentication. Optional for databases that do not require authentication.\n\n**Password:** Password to use to connect to the specified database.\n\n**Connection Type** Whether to use an SID, Service Name, or TNS Connect Descriptor when connecting to the database.\n\n**SID/Service Name/TNS Connect Descriptor:** Oracle connection point (Database name, Service name, or a TNS Connect Descriptor). When using TNS, place\nthe full TNS Connect Descriptor in the text field. For example:\n(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = 123.123.123.123)(PORT = 1521))(CONNECT_DATA =(SERVER = DEDICATED)\n(SERVICE_NAME = XE)))\n\n**Role:** Login role of the user when connecting to the database.\n\n**Transaction Isolation Level** The transaction isolation level of the databse connection\n- TRANSACTION_READ_COMMITTED: No dirty reads. Non-repeatable reads and phantom reads are possible.\n- TRANSACTION_SERIALIZABLE (default): No dirty reads. Non-repeatable and phantom reads are prevented.\n- Note: If the user role selected is SYSDBA or SYSOPER, the plugin will default to TRANSACTION_READ_COMMITTED to prevent ORA-08178 errors\n\n**Connection Arguments:** A list of arbitrary string tag/value pairs as connection arguments. These arguments\nwill be passed to the JDBC driver, as connection arguments, for JDBC drivers that may need additional configurations.\nThis is a semicolon-separated list of key-value pairs, where each pair is separated by a equals '=' and specifies\nthe key and value for the argument. For example, 'key1=value1;key2=value' specifies that the connection will be\ngiven arguments 'key1' mapped to 'value1' and the argument 'key2' mapped to 'value2'.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{schema}/{table}`\n   This path indicates a table. A table is the only one that can be sampled. Browse on this path to return the specified table.\n\n2. `/{schema}`\n   This path indicates a schema. A schema cannot be sampled. Browse on this path to get all the tables under this schema.\n\n3. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the schemas visible through this connection.\n",
      'widgets.Oracle-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [\n        {\n          "widget-type": "plugin-list",\n          "name": "jdbcPluginName",\n          "label": "JDBC Driver name",\n          "widget-attributes": {"plugin-type": "jdbc"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "host",\n          "label": "Host",\n          "widget-attributes": {"default": "localhost"}\n        },\n        {\n          "widget-type": "number",\n          "name": "port",\n          "label": "Port",\n          "widget-attributes": {"default": "1521"}\n        },\n        {\n          "name": "connectionType",\n          "widget-type": "radio-group",\n          "label": "Connection Type",\n          "widget-attributes": {\n            "layout": "inline",\n            "default": "SID",\n            "options": [\n              {\n                "id": "SID",\n                "label": "SID"\n              },\n              {\n                "id": "service",\n                "label": "Service Name"\n              },\n              {\n                "id": "TNS",\n                "label": "TNS Connect Descriptor"\n              }\n            ]\n          }\n        },\n        {\n          "widget-type": "textbox",\n          "name": "database",\n          "description": "Oracle connection point (Database name, Service name, or TNS Connect Descriptor)",\n          "label": "SID/Service Name/TNS Connect Descriptor"\n        }\n      ]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "widget-type": "textbox",\n          "name": "user",\n          "label": "Username"\n        },\n        {\n          "widget-type": "password",\n          "name": "password",\n          "label": "Password"\n        },\n        {\n          "name": "role",\n          "widget-type": "radio-group",\n          "label": "Role",\n          "widget-attributes": {\n            "layout": "inline",\n            "default": "normal",\n            "options": [\n              {\n                "id": "normal",\n                "label": "Normal"\n              },\n              {\n                "id": "sysdba",\n                "label": "SYSDBA"\n              },\n              {\n                "id": "sysoper",\n                "label": "SYSOPER"\n              }\n            ]\n          }\n        },\n        {\n          "widget-type": "select",\n          "name": "transactionIsolationLevel",\n          "label": "Transaction Isolation Level",\n          "widget-attributes": {\n            "default": "TRANSACTION_SERIALIZABLE",\n            "values": [\n              "TRANSACTION_READ_COMMITTED",\n              "TRANSACTION_SERIALIZABLE"\n            ]\n          }\n        }\n      ]\n    },\n    {\n      "label": "Advanced",\n      "properties": [{\n        "widget-type": "keyvalue",\n        "name": "connectionArguments",\n        "label": "Connection Arguments",\n        "widget-attributes": {\n          "kv-delimiter": "=",\n          "key-placeholder": "Key",\n          "value-placeholder": "Value",\n          "delimiter": ";",\n          "showDelimiter": "false"\n        }\n      }]\n    }\n  ],\n  "display-name": "Oracle",\n  "filters": [{\n    "condition": {"expression": "role  == \'normal\'"},\n    "name": "showIsolationLevels",\n    "show": [{\n      "name": "transactionIsolationLevel",\n      "type": "property"\n    }]\n  }]\n}',
    },
    name: 'oracle-plugin',
    version: '1.9.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
  {
    properties: {
      'widgets.PostgreSQL-connector':
        '{\n  "outputs": [],\n  "metadata": {"spec-version": "1.0"},\n  "configuration-groups": [\n    {\n      "label": "Basic",\n      "properties": [\n        {\n          "widget-type": "plugin-list",\n          "name": "jdbcPluginName",\n          "label": "JDBC Driver name",\n          "widget-attributes": {"plugin-type": "jdbc"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "host",\n          "label": "Host",\n          "widget-attributes": {"default": "localhost"}\n        },\n        {\n          "widget-type": "number",\n          "name": "port",\n          "label": "Port",\n          "widget-attributes": {"default": "5432"}\n        },\n        {\n          "widget-type": "textbox",\n          "name": "database",\n          "label": "Database"\n        }\n      ]\n    },\n    {\n      "label": "Credentials",\n      "properties": [\n        {\n          "widget-type": "textbox",\n          "name": "user",\n          "label": "Username"\n        },\n        {\n          "widget-type": "password",\n          "name": "password",\n          "label": "Password"\n        }\n      ]\n    },\n    {\n      "label": "Advanced",\n      "properties": [{\n        "widget-type": "keyvalue",\n        "name": "connectionArguments",\n        "label": "Connection Arguments",\n        "widget-attributes": {\n          "kv-delimiter": "=",\n          "key-placeholder": "Key",\n          "value-placeholder": "Value",\n          "delimiter": ";",\n          "showDelimiter": "false"\n        }\n      }]\n    }\n  ],\n  "display-name": "PostgreSQL"\n}',
      'doc.PostgreSQL-connector':
        "# PostgreSQL Connection\n\n\nDescription\n-----------\nUse this connection to access data in a PostgreSQL database using JDBC.\n\nProperties\n----------\n**Name:** Name of the connection. Connection names must be unique in a namespace.\n\n**Description:** Description of the connection.\n\n**JDBC Driver name:** Select the JDBC driver to use.\n\n**Host:** Host name or IP address of the database server to connect to.\n\n**Port:** Port number of the database server to connect to. If not specified will default to 5432.\n\n**Username:** User identity for connecting to the specified database. Required for databases that need\nauthentication. Optional for databases that do not require authentication.\n\n**Password:** Password to use to connect to the specified database.\n\n**Database:** The name of the database to connect to.\n\n**Connection Arguments:** A list of arbitrary string tag/value pairs as connection arguments. These arguments\nwill be passed to the JDBC driver, as connection arguments, for JDBC drivers that may need additional configurations.\nThis is a semicolon-separated list of key-value pairs, where each pair is separated by a equals '=' and specifies\nthe key and value for the argument. For example, 'key1=value1;key2=value' specifies that the connection will be\ngiven arguments 'key1' mapped to 'value1' and the argument 'key2' mapped to 'value2'.\n\nPath of the connection\n----------------------\nTo browse, get a sample from, or get the specification for this connection through\n[Pipeline Microservices](https://cdap.atlassian.net/wiki/spaces/DOCS/pages/975929350/Pipeline+Microservices), the `path`\nproperty is required in the request body. It can be in the following form :\n\n1. `/{schema}/{table}`\n   This path indicates a table. A table is the only one that can be sampled. Browse on this path to return the specified table.\n\n2. `/{schema}`\n   This path indicates a schema. A schema cannot be sampled. Browse on this path to get all the tables under this schema.\n\n3. `/`\n   This path indicates the root. A root cannot be sampled. Browse on this path to get all the schemas visible through this connection.\n",
    },
    name: 'postgresql-plugin',
    version: '1.9.0-SNAPSHOT',
    scope: 'SYSTEM',
  },
];

export const dummyDisplayNames = [
  {
    name: 'Add Connection',
    SVG: {
      type: 'svg',
      key: null,
      ref: null,
      props: {
        width: '40',
        height: '40',
        viewBox: '0 0 40 40',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        children: [
          {
            type: 'rect',
            key: null,
            ref: null,
            props: {
              x: '0.307129',
              y: '16.21',
              width: '39.386',
              height: '7',
              fill: '#FFC107',
            },
            _owner: null,
            _store: {},
          },
          {
            type: 'rect',
            key: null,
            ref: null,
            props: {
              x: '16.5',
              y: '39.4033',
              width: '39.386',
              height: '7',
              transform: 'rotate(-90 16.5 39.4033)',
              fill: '#43A047',
            },
            _owner: null,
            _store: {},
          },
          {
            type: 'rect',
            key: null,
            ref: null,
            props: {
              x: '16.5',
              y: '16.21',
              width: '23.1931',
              height: '7',
              fill: '#2196F3',
            },
            _owner: null,
            _store: {},
          },
          {
            type: 'path',
            key: null,
            ref: null,
            props: {
              d: 'M16.5 23.4033L16.5 0.0173569H23.5V16.2059L16.5 23.4033Z',
              fill: '#E53935',
            },
            _owner: null,
            _store: {},
          },
        ],
      },
      _owner: null,
      _store: {},
    },
    link: 'connections/create',
  },
  {
    name: 'Import Data',
    SVG: {
      type: 'svg',
      key: null,
      ref: null,
      props: {
        width: '40',
        height: '41',
        viewBox: '0 0 40 41',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        children: [
          {
            type: 'rect',
            key: null,
            ref: null,
            props: {
              y: '33.5444',
              width: '40',
              height: '6.66667',
              fill: '#FFC107',
            },
            _owner: null,
            _store: {},
          },
          {
            type: 'rect',
            key: null,
            ref: null,
            props: {
              x: '20',
              y: '33.5444',
              width: '20',
              height: '6.66667',
              fill: '#E53935',
            },
            _owner: null,
            _store: {},
          },
          {
            type: 'path',
            key: null,
            ref: null,
            props: {
              d: 'M16.6665 28.2109L16.6665 0.210941H23.3332V28.2109H16.6665Z',
              fill: '#2196F3',
            },
            _owner: null,
            _store: {},
          },
          {
            type: 'path',
            key: null,
            ref: null,
            props: {
              'fill-rule': 'evenodd',
              'clip-rule': 'evenodd',
              d:
                'M20.3052 32.2617L36.0508 15.9567L31.2552 11.3256L20.1409 22.8348L8.63134 11.7202L4.00029 16.5158L15.5098 27.6304L15.5096 27.6307L20.3052 32.2617Z',
              fill: '#43A047',
            },
            _owner: null,
            _store: {},
          },
        ],
      },
      _owner: null,
      _store: {},
    },
    link: 'home',
  },
  {
    name: 'PostgreSQL',
    time: 1665646820205,
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'PostgreSQL',
      },
      _owner: null,
      _store: {},
    },
    displayName: 'PostgreSQL',
  },
  {
    name: 'File',
    time: 1665479458620,
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'File',
      },
      _owner: null,
      _store: {},
    },
    displayName: 'File',
  },
];

export const fetchConnectorMockResponse = [
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

export const connectorCardMockArgument = [
  {
    artifact: {
      name: 'amazon-s3-plugins',
      version: '1.18.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Amazon Web Services',
    name: 'S3',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        imageSource:
          'data:image/png;base64,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',
        label: 'S3',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'cloudsql-mysql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Database',
    name: 'CloudSQLMySQL',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'CloudSQLMySQL',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'cloudsql-postgresql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Database',
    name: 'CloudSQLPostgreSQL',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'CloudSQLPostgreSQL',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'database-plugins',
      version: '2.10.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Database',
    name: 'Database',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'Database',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'mssql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Database',
    name: 'SQL Server',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'SQL Server',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'mysql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Database',
    name: 'MySQL',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'MySQL',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'oracle-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Database',
    name: 'Oracle',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'Oracle',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'postgresql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Database',
    name: 'PostgreSQL',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'PostgreSQL',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'postgresql-plugin',
      version: '1.9.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Database',
    name: 'PostgreSQL',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'PostgreSQL',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'core-plugins',
      version: '2.10.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'File',
    name: 'File',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'File',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'google-cloud',
      version: '0.21.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Google Cloud Platform',
    name: 'BigQuery',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'BigQuery',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'google-cloud',
      version: '0.21.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Google Cloud Platform',
    name: 'GCS',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        imageSource:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAL\r\nEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6\r\neD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYg\r\neG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4K\r\nICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlm\r\nZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRh\r\ndGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9y\r\nZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAADF9JREFUaAXFWguMXFUZ/s+95965s7Pb6cKGUoot\r\nWKxVItHwSFATl0AQlIeKu4hY5Q0RAhVBhGCdSngohW1YbXgJaXwgXSQxBowS0kVjJAoYDNVYoFos\r\nAoV2HzO7M3Mf5/j95967M7M7ryWhnuQ+zuN/fOd/nHPujKBFFy0GC2QXl5NYNGkXBH1vkB4vUEQk\r\ndBfD392QQkFbRPo9AdCokRZDQ9vsxrb2ta6VYhCFglDM7tIfVtZMqMwRWrFVQrTI9lI69sY8hEV6\r\niaTdD31d/JNJGMzY2DCs07l0BWRoSIOhiNY/rJfu2hfdVQnFsBaiF+ZvK4F7F+cfGg6lS55Nv1zd\r\nb107conYn8puKwidcJX2hS3BILTW1svvRI8Enn1RJKxeBQ2V1m0vELXtX0hPxLyDrPW1l/dH27Zv\r\n15Jlxy7dXs+OPjEeg1XnbFZXRq59ml+MQp5pXB0nob3o5r2MvTpN5Obsk0f/qq7BqLvGEx2aU8St\r\nbX1jsKDleEGE6+/Ty/8xET4X2fIwHUZwaN1xAtoJ7dwnQmHb0lbRW6v6gxPuvzz7WqpLK9o2s6rF\r\nOLyHCV+dDr9NHoMIQzjxorJJK8Ft2yFDR5Dl2cvenHJu5LFIyYp064zZEsgg1gpCllo36h9XDemK\r\n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\r\nTMT/AMOVvu39V/HOAAAAAElFTkSuQmCC',
        label: 'GCS',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'google-cloud',
      version: '0.21.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Google Cloud Platform',
    name: 'Spanner',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        label: 'Spanner',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    artifact: {
      name: 'kafka-plugins-client',
      version: '3.1.0-SNAPSHOT',
      scope: 'SYSTEM',
    },
    category: 'Messaging Systems',
    name: 'Kafka',
    type: 'connector',
    SVG: {
      key: null,
      ref: null,
      props: {
        imageSource:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6\r\nJgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB\r\nWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczpt\r\nZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0\r\ndHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRl\r\nc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMu\r\nYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6\r\nT3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4\r\nbXBtZXRhPgpMwidZAAAGJklEQVRoBe2YWajVVRTGtXkuMRskvEWiQTSY1EMJWdJTERkU2IP0UA8J\r\nRr0E+aA3wuohoqKwILgIURQpRAOUDUq9CFEZjcQ17SE1s7TBysr6/e5/f5ft7Vw9dzh6Iz/4/nvt\r\ntae19trTOePGHcTYmoHxo2TOofRT97WbvPzPQOMPG8TawfSDVB+Z2pkcLg6h4d/Qmdfoc+BZRd5B\r\nqt7+rTNmoRPBPIS1cDvcCTfDFfB8KOq6jWaMfOu9sASbnPFW/BH9bChGEvmmhw58Y9Q19F07sI78\r\ni3BTpe9FnghF2jW5A/yto/EqtsSRZciHF9vOJn2/KltQ9GPKkRhzMsatL8ZuJJ1QjD2ipNeXMh3t\r\nKTonoZ4I1e4fOVBv2ZAw3I2owTle3eS/lFHjyLfkdUIc2ST9ebO2dVI82aRQN2yHhupIjNNQKc6D\r\n1/VJ48b9XNKbSWPUV0WXsXTgT/hX0ZvYrzqRek2uzW9mtc3q/XeDg66EM6EGPwE9bj+F18IboXC2\r\nrSc0UONlF5wPZ0CjuAG+AFdDnbJuIoXYGWTGjqb7d6ADD8ZuyoTOZn/NRd4KW7V5CH2QcZLvSBqj\r\nJtG7l1+MMlLKP8FFMMjemYXiD1jX9xJN3vQeKPaLIw4UZ5SvgF9ADXkWToFBXe91lDF6NfIceCF8\r\nFMZBJ2E6FENd+k2rYXwz0zZ9BWrkLWbAUdBZjTHTkLdB66yHp8EaT5OJk7eVgrSt67WURxI+Z3pX\r\n1WucOqbofitpxjid/LFF9x6pbzL3We6gVaXM5NQit73h2/a4GkRRJ3J8uqw8pTyBxK3wePg8/BI6\r\ny6IXet94r7h0jNivhST97ZV3+AFOQtvO9LUYwidrXmOXwywH09+rvI/GhVCMh3dBHUn9HuQueBJ0\r\nKbk3LHOvXAJFnj1NbhS/WSbO6hvQgY2Mac1a9yRlbw8oT90t6N0vyZv2wMAJ6AgSjQfo3UHdB6Ya\r\ncx80AhriklGf41jZmV4KF0PzrfgSeiMtMlaTG8Vv9lMXfW6DMWQNso/IGleS+QGmztfIl1YVLH8O\r\nfgg/hkbX5ZUIdMwJxug/Rucjx0DX9bkWApebazpG3IGcehuQT4Aip5uyp9iJChXSvlLtW8ya33fN\r\nxijrnVlVfh/5k5J36cj0+Raym1tMhhf0SU0/Gms9y3NCGXF1OQ0R20cGbb/FnjVdClkOe5b8O2d0\r\nOoahOBKDN1TWXIScpeWykrtL+RzSXIDfIH9U9PbjrFvvOJgL0YNB3bCWFu3aRr3Zv6NV1v8a5IGb\r\nXSf2ttktd7Pr3GfwTehmz8R23JkM0Or4vR9Dboc9cLDj1yO6G2YSBqYvU9bx45cx+mfME2oV1JD6\r\n8othtW5fF2Jv6Sdte8gHWc7Jj2qaqDhzy2EMMK2fKJ5GC6HQoDxR3AfW1eApsNUT5WL0wj3XUcQZ\r\nB7kCPg63Qg1cB++GU6GIMWcg5yK1jlGt8TAZ28s7S0H2Zcl2JqmdcYQsNfdJ4ObNBXg5cp40voyF\r\nL+AJfVLzGz6OdBddNn/JDp60XbFFF+6DGGlxfpvsLHU1UlhPbIK5IF06/rDSMU83cVWT9H23FHkk\r\n9lXd7V2sI+Ly+hw6o8/CLhjUy+M1lJn11chz4Az4CPRVYJnP/+lQ1G0bzSh/48Qk+l0JY1xeu77B\r\nFlVjJnKXoYvBtrG+EUx7024oOh6NDOBP2ndhbcRAuZty4akV5+ci52AYWP9BKxdknORHPY1BzngM\r\n+R75XngTdGnliHV/zITCZaJDogsuhiugv0Eeg7Nh0HEnMoBG+QeCjmjsDbDGU2Ti5NJSYNs6MnX9\r\nyJZnjOg6kiYak+l9I9TYdTB7wEegmAUTlWf6NM0nEXEi0pcl6uuIqRsShuv9LkbJserNHAfUi1Ng\r\njPa2F8kru8lt7/ixQZ0Ts19QG/MqI2b5LENOVKYif1CVLUAWdQQazQH+xqCrsSOOZIm9iM6LL/pe\r\n5IlQpF2TGwPfOipLsCdGD0y92GYXe8ecE8Wu/nVtfh5cC7dDL7fN0GM1v9GzB1B1DvXsDnUUDfRk\r\nEp4406Cb3nfSRiiMRA6FPsVY/TgROtEKg+lb1R2xbiQRqQd35uu+jFSiVdc7KP9vZuAfG4mx8F0N\r\nPGYAAAAASUVORK5C',
        label: 'Kafka',
      },
      _owner: null,
      _store: {},
    },
  },
  {
    name: 'Imported Dataset',
    SVG: {
      type: 'svg',
      key: null,
      ref: null,
      props: {
        width: '49',
        height: '40',
        viewBox: '0 0 49 40',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        children: [
          {
            type: 'path',
            key: null,
            ref: null,
            props: {
              'fill-rule': 'evenodd',
              'clip-rule': 'evenodd',
              d:
                'M3.04834 0C1.94377 0 1.04834 0.895429 1.04834 2V32.2584H1.04838V37.4203H41.9358V9.16197C41.9358 6.95283 40.145 5.16197 37.9358 5.16197H14.8388V2C14.8388 0.895431 13.9434 0 12.8388 0H3.04834Z',
              fill: '#E8B826',
            },
            _owner: null,
            _store: {},
          },
          {
            type: 'path',
            key: null,
            ref: null,
            props: {
              d:
                'M9.67749 12.3223C9.67749 11.2177 10.5729 10.3223 11.6775 10.3223H37.3552C38.4598 10.3223 39.3552 11.2177 39.3552 12.3223V14.1933H9.67749V12.3223Z',
              fill: 'white',
            },
            _owner: null,
            _store: {},
          },
          {
            type: 'path',
            key: null,
            ref: null,
            props: {
              d:
                'M5.89335 15.838C6.22107 14.4943 7.42487 13.5488 8.80791 13.5488H44.5679C46.5125 13.5488 47.9432 15.3705 47.4825 17.2597L42.4942 37.7116C42.1665 39.0552 40.9627 40.0007 39.5796 40.0007H3.81965C1.87505 40.0007 0.444304 38.179 0.90509 36.2898L5.89335 15.838Z',
              fill: '#FFC928',
            },
            _owner: null,
            _store: {},
          },
        ],
      },
      _owner: null,
      _store: {},
    },
  },
];
