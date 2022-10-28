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
