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
import T from 'i18n-react';
import styled, { css } from 'styled-components';
import { IConnection, IPendingReqsTableData } from '../types';
import { formatAsPercentage } from 'services/DataFormatter';
import { humanReadableDate } from 'services/helpers';

const PREFIX = 'features.Administration.Tethering';
const REQUEST_DATE_FORMAT = 'MM/DD/YYYY - hh:mm A';

const PENDING_REQS_TABLE_HEADERS = [
  {
    property: 'requestTime', // properties may come handy when adding sort by columns to the table, will remove if not needed
    label: T.translate(`${PREFIX}.ColumnHeaders.requestTime`),
  },
  {
    property: 'gcp',
    label: T.translate(`${PREFIX}.ColumnHeaders.gcp`),
  },
  {
    property: 'instanceName',
    label: T.translate(`${PREFIX}.ColumnHeaders.instanceName`),
  },
  {
    property: 'region',
    label: T.translate(`${PREFIX}.ColumnHeaders.region`),
  },
  {
    property: 'omniNamespace',
    label: T.translate(`${PREFIX}.ColumnHeaders.omniNamespace`),
  },
  {
    property: 'cpu',
    label: T.translate(`${PREFIX}.ColumnHeaders.cpu`),
  },
  {
    property: 'memory',
    label: T.translate(`${PREFIX}.ColumnHeaders.memory`),
  },
  {
    label: '',
  },
];

const GridContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  margin-bottom: 15px;
  padding: 0 30px;
  max-height: none;
`;

const GridRow = styled.div`
  display: grid;
  height: 30px;
  padding: 5px 5px 5px 20px;
  grid-template-columns: 1.5fr 1.5fr 2fr 1fr 2fr 1fr 0.5fr 1fr;

  ${(props) =>
    props.border &&
    css`
      border-bottom: 1px solid var(--grey11);
    `}

  ${(props) =>
    props.header &&
    css`
      background-color: var(--grey08);
    `}
`;

const GridCell = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 20px;

  ${(props) =>
    props.border &&
    css`
      margin-bottom: -5px;
      border-bottom: 1px solid 1px solid var(--grey11);
    `}
`;

interface IPendingReqsTableProps {
  tableData: IConnection[];
}

const PendingRequestsTable = ({ tableData }: IPendingReqsTableProps) => {
  const transformedTableData = tableData.map((req) => ({
    requestTime: humanReadableDate(Date.now(), true, false, REQUEST_DATE_FORMAT), // will be updated once backend server captures request time upon creation
    gcloudProject: req.metadata.metadata.project,
    instanceName: req.name,
    region: req.metadata.metadata.location,
    requestedResources: req.metadata.namespaceAllocations,
  }));

  const renderTable = (data: IPendingReqsTableData[]) => {
    return (
      <GridContainer>
        {renderTableHeader()}
        {renderTableBody(data)}
      </GridContainer>
    );
  };

  const renderTableHeader = () => {
    return (
      <GridRow header={true}>
        {PENDING_REQS_TABLE_HEADERS.map((header, i) => {
          return <strong key={i}>{header.label}</strong>;
        })}
      </GridRow>
    );
  };

  const renderTableBody = (data: IPendingReqsTableData[]) => {
    return <div>{data.map((req: IPendingReqsTableData) => renderRow(req))}</div>;
  };

  const renderRow = (req: IPendingReqsTableData) => {
    const { requestedResources, requestTime, gcloudProject, instanceName, region } = req;
    return requestedResources.map((resource, i) => {
      const { namespace, cpuLimit, memoryLimit } = resource;
      const isFirst = i === 0;
      const isLast = requestedResources.length === i + 1;
      return (
        <GridRow border={isLast} key={i}>
          <GridCell>{isFirst ? requestTime : ''}</GridCell>
          <GridCell>{isFirst ? gcloudProject : ''}</GridCell>
          <GridCell>{isFirst ? instanceName : ''}</GridCell>
          <GridCell>{isFirst ? region : ''}</GridCell>
          <GridCell border={!isLast}>{namespace}</GridCell>
          <GridCell border={!isLast}>{formatAsPercentage(cpuLimit)}</GridCell>
          <GridCell border={!isLast}>{formatAsPercentage(memoryLimit)}</GridCell>
        </GridRow>
      );
    });
  };

  return renderTable(transformedTableData);
};

export default PendingRequestsTable;
