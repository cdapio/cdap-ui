import { GCSIcon } from 'components/ConnectionList/icons';
import React from 'react';

export const tabsTestData = {
  data: [
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
      count: 1,
      icon: <GCSIcon />,
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
      count: 1,
      icon: <GCSIcon />,
    },
  ],
  showTabs: true,
  selectedTab: 'S3',
  isSearching: false,
};
