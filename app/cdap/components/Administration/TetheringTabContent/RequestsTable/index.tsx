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
import { Grid, GridHeader, GridBody, GridRow, GridCell, StyledButton } from '../shared.styles';
import { IConnection, IReqsTableData } from '../types';
import { getScrollableColTemplate, getTotalTableRows } from '../utils';
import { humanReadableDate } from 'services/helpers';

const PREFIX = 'features.Administration.Tethering';
const REQUEST_DATE_FORMAT = 'MM/DD/YYYY - hh:mm A';

const REQS_TABLE_HEADERS = [
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

interface IReqsTableProps {
  tableData: IConnection[];
  columnTemplate: string;
  renderLastColumn: (instanceName: string) => JSX.Element;
}

const renderTableHeader = (tableData: IConnection[], columnTemplate: string) => {
  const headerColumnTemplate =
    getTotalTableRows(tableData) > 10 ? getScrollableColTemplate(columnTemplate) : columnTemplate;
  return (
    <GridHeader>
      <GridRow columnTemplate={headerColumnTemplate}>
        {REQS_TABLE_HEADERS.map((header, i) => {
          return <GridCell key={i}>{header.label}</GridCell>;
        })}
      </GridRow>
    </GridHeader>
  );
};

const renderTableBody = (
  data: IReqsTableData[],
  renderRowFn: (req: IReqsTableData, idx: number) => React.ReactNode
) => <GridBody>{data.map((req, idx) => renderRowFn(req, idx))}</GridBody>;

const RequestsTable = ({ tableData, columnTemplate, renderLastColumn }: IReqsTableProps) => {
  const transformedTableData = tableData.map((req) => ({
    requestTime: humanReadableDate(req.requestTime, true, false, REQUEST_DATE_FORMAT),
    gcloudProject: req.metadata.metadata.project,
    instanceName: req.name,
    region: req.metadata.metadata.location,
    requestedResources: req.metadata.namespaceAllocations,
  }));

  const renderRow = (req: IReqsTableData, idx: number) => {
    const { requestedResources, requestTime, gcloudProject, instanceName, region } = req;

    return requestedResources.map((resource, i) => {
      const { namespace, cpuLimit, memoryLimit } = resource;
      const isFirst = i === 0;
      const isLast = requestedResources.length === i + 1;
      const isLastReq = idx === transformedTableData.length - 1;

      return (
        <GridRow columnTemplate={columnTemplate} border={isLast && !isLastReq} key={i}>
          <GridCell>{isFirst ? requestTime : ''}</GridCell>
          <GridCell>{isFirst ? gcloudProject : ''}</GridCell>
          <GridCell>{isFirst ? instanceName : ''}</GridCell>
          <GridCell>{isFirst ? region : ''}</GridCell>
          <GridCell border={!isLast}>{namespace}</GridCell>
          <GridCell border={!isLast}>{cpuLimit}</GridCell>
          <GridCell border={!isLast}>{memoryLimit}</GridCell>
          {isFirst && <GridCell lastCol={true}>{renderLastColumn(instanceName)}</GridCell>}
        </GridRow>
      );
    });
  };

  return (
    <Grid>
      {renderTableHeader(tableData, columnTemplate)}
      {renderTableBody(transformedTableData, renderRow)}
    </Grid>
  );
};

export default RequestsTable;
