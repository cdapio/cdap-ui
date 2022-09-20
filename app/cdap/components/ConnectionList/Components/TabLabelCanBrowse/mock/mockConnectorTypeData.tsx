import { GCSIcon } from 'components/ConnectionList/icons';
import React from 'react';

export const mockConnectorTypeData = {
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
  canBrowse: true,
  count: 1,
  icon: <GCSIcon />,
};
