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

import React from 'react';
import { IConnection } from '../types';

interface IConnectionsTableProps {
  tableData: IConnection[];
}

const ConnectionsTable = ({ tableData }: IConnectionsTableProps) => {
  const transformedTableData = tableData.map((req) => ({
    requestTime: '00:00:00',
    gcloudProject: req.metadata.metadata.project,
    instanceName: req.name,
    region: req.metadata.metadata.location,
    requestedResources: req.metadata.namespaceAllocations,
  }));

  return (
    <>
      {/* TODO: Will be completed after pending requests and new request creation*/}
      {transformedTableData.map((row) => row.gcloudProject)}
    </>
  );
};

export default ConnectionsTable;
